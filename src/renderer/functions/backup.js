'use strict'
const tar = require('tar')
const moment = require('moment')
const fs = require('fs-extra')
const dir = require('node-dir')
const path = require('path')
const db = require('../datastore').default
const config = require('../../config').default
const encryption = require('../functions/encryption').default
const { algorithms } = require('../../enums/algorithms')
const { getFileHash, getKeyFilename } = require('../functions/helpers')

export default {
  async do (params) {
    const task = params.task
    const point = this.prepareAny(task, params.pointName)

    switch (Number(task.algorithm)) {
      case algorithms.full:
        await this.prepareFull(task, point)
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
      throw new Error('Нет изменений для резервирования')
    }

    console.log(point)
    if (task.isEncrypted) {
      const ivSalt = await encryption.generateSalt()
      const iv = await encryption.deriveKey(config.ivPassword, ivSalt, 111333, 16, 'sha512')
      const keySalt = await encryption.generateSalt()
      const key = await encryption.deriveKey(config.keyPassword, keySalt, 111333, 32, 'sha512')

      const archive = await tar.c({ gzip: true }, changedFiles)
      await encryption.do(archive, point.filename + '.enc', key, iv)
      await fs.writeFile(path.join(task.keyStorage, '/', getKeyFilename(point.filename)), key)
      point.ivSalt = ivSalt
    } else {
      await tar.c({ file: point.filename, gzip: true }, changedFiles)
    }
    await db.points.insert(point)
    console.log('created backup')
  },
  async prepareFull (task, point) {
    point.files = await this.mapFiles(task)
  },
  async prepareIncremental (task, point) {
    const points = await db.points.find({ taskId: task._id })
    point.previous = points.length ? points.find(p => p.latest)._id : null

    let pointFiles = []
    if (point.previous) { // Инкрементная копия
      const previousPoint = await db.points.findOne({ _id: point.previous })
      const currentFiles = await this.mapFiles(task)
      pointFiles = this.removeUnchangedFiles(currentFiles, previousPoint.files)
      if (pointFiles.filter(pf => pf.changed).length) {
        await db.points.update({ _id: point.previous }, { $set: { latest: false } })
      }
    } else { // Полная копия в инкрементной
      pointFiles = await this.mapFiles(task)
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
      const currentFiles = await this.mapFiles(task)
      pointFiles = this.removeUnchangedFiles(currentFiles, previousPoint.files)
    } else { // Полная копия в дифференциальной.
      pointFiles = await this.mapFiles(task)
    }
    point.files = pointFiles
  },
  prepareAny (task, pointName) {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss')
    const filename = task.destination + '/' + task.name + '_' + pointName + '_' + timestamp + '.mbc'

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
  async mapFiles (task) {
    const pointFiles = []
    let allFiles = []
    for (const file of task.files.filter(f => f.isDir).map(f => f.name)) {
      const temp = await dir.promiseFiles(file)
      allFiles = allFiles.concat(temp)
    }

    allFiles = allFiles.concat(task.files.filter(f => f.isFile).map(f => f.name))
    for (const file of allFiles) {
      const attrs = fs.lstatSync(file)
      const hash = getFileHash(file, attrs)
      pointFiles.push({ name: file, hash, changed: true })
    }

    return pointFiles
  }
}
