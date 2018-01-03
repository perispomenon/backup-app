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
    const point = this.prepareAny(task, params.pointName)

    switch (Number(task.algorithm)) {
      case algorithms.full:
        this.prepareFull(task, point)
        break
      case algorithms.incremental:
        await this.prepareIncremental(task, point)
        break
      case algorithms.differential:
        await this.prepareDifferential(task, point)
        break
    }

    const changedFiles = point.files.filter(pf => pf.changed).map(pf => pf.name)
    if (!changedFiles.length) {
      console.error('Нет изменений для резервирования')
      return
    }

    console.log(point)
    await tar.c({ file: point.filename, gzip: true }, changedFiles)
    await db.points.insert(point)
    console.log('created backup ' + point.filename)
  },
  prepareFull (task, point) {
    point.files = this.mapFiles(task)
  },
  async prepareIncremental (task, point) {
    const points = await db.points.find({ taskId: task._id })
    point.previous = points.length ? points.find(p => p.latest)._id : null

    let pointFiles = []
    if (point.previous) { // Инкрементная копия
      const previousPoint = await db.points.findOne({ _id: point.previous })
      pointFiles = this.removeUnchangedFiles(this.mapFiles(task), previousPoint.files)
      if (pointFiles.filter(pf => pf.changed).length) {
        await db.points.update({ _id: point.previous }, { $set: { latest: false } })
      }
    } else { // Полная копия в инкрементной
      pointFiles = this.mapFiles(task)
    }
    point.files = pointFiles
    point.latest = true
  },
  async prepareDifferential (task, point) {
    // Если есть точка восстановления, у которой нет предыдущей, то это связанная с полной копией.
    const points = await db.points.find({ taskId: task._id, previous: null })
    point.previous = points.length ? points[0]._id : null

    let pointFiles = []
    if (point.previous) { // Дифференциальная копия.
      const previousPoint = await db.points.findOne({ _id: point.previous })
      pointFiles = this.removeUnchangedFiles(this.mapFiles(task), previousPoint.files)
    } else { // Полная копия в дифференциальной.
      pointFiles = this.mapFiles(task)
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
    const unchangedFiles = currentFiles
      .filter(cf => previousFiles.map(pf => pf.hash).includes(cf.hash))
    for (const unchangedFile of unchangedFiles.map(uf => uf.name)) {
      currentFiles.find(cf => cf.name === unchangedFile).changed = false
    }
    return currentFiles
  },
  mapFiles (task) {
    const pointFiles = []
    for (const file of task.files.map(f => f.name)) {
      const attrs = fs.lstatSync(file)
      const hash = getFileHash(file, attrs)
      pointFiles.push({ name: file, attrs, hash, changed: true })
    }
    return pointFiles
  }
}
