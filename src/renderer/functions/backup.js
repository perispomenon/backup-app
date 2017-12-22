'use strict'
const tar = require('tar')
const moment = require('moment')
const fs = require('fs-extra')
const db = require('../datastore').default
const { algorithms } = require('../../enums/algorithms')
const { getFileHash } = require('../functions/helpers').default

export default {
  async do (params) {
    const task = params.task
    if (!task.files.length) {
      console.error('No files to backup')
    }

    const point = this.prepareAny(task, params.pointName)

    switch (Number(task.algorithm)) {
      case algorithms.full:
        this.prepareFull(task, point)
        break
      case algorithms.incremental:
        this.prepareIncremental(task, point)
        break
      case algorithms.differential:
        await this.prepareDifferential(task, point)
        break
      default:
        console.error('bad algorithm')
    }

    console.log(point)
    await tar.c({ file: point.filename, gzip: true }, point.files.map(f => f.name))
    await db.points.insert(point)
    console.log('created backup ' + point.filename)
  },
  prepareFull (task, point) {
    point.files = task.files
  },
  prepareIncremental (task, point) {
    // TODO impl.
  },
  async prepareDifferential (task, point) {
    // Если есть точка восстановления, у которой нет предыдущей, то это связанная с полной копией.
    const points = await db.points.find({ taskId: task._id, previous: null })
    point.previous = points.length ? points[0]._id : null

    let pointFiles = []
    if (point.previous) {
      const previousPoint = await db.points.findOne({ _id: point.previous })

      for (const file of previousPoint.files) {
        const attrs = fs.lstatSync(file.name)
        const hash = getFileHash(file.name, attrs)
        pointFiles.push({ name: file.name, attrs, hash })
      }

      pointFiles = this.removeUnchangedFiles(pointFiles, previousPoint.files)
    } else {
      for (const file of task.files.map(f => f.name)) {
        const attrs = fs.lstatSync(file)
        const hash = getFileHash(file, attrs)
        pointFiles.push({ name: file, attrs, hash })
      }
    }
    point.files = pointFiles
  },
  prepareAny (task, pointName) {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss')
    const filename = task.destination + '/' + task.name + '_' + pointName + '_' + timestamp + '.tgz'

    return {
      taskId: task._id,
      name: pointName,
      filename: filename
    }
  },
  removeUnchangedFiles (currentFiles, previousFiles) {
    console.log('suka ebanaya')
    console.log(currentFiles)
    let changedFiles = currentFiles
      .filter(cf => !previousFiles.map(pf => pf.hash).includes(cf.hash))
    return changedFiles
  }
}
