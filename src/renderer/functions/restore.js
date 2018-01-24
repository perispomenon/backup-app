'use strict'
import tar from 'tar'
import _ from 'lodash'
import fs from 'fs-extra'
import crypto from 'crypto'
import path from 'path'
import axios from 'axios'
import db from '../datastore'
import { algorithms } from '../../enums/algorithms'
import { mediums } from '../../enums/mediums'
import encryption from '../functions/encryption'
import config from '../../config'
import { getKeyFilename, getYandexDownloadUrl } from '../functions/helpers'

export default {
  async do (pointId) {
    const { point, task } = await this.getRestoreData(pointId)

    let copyNames = []
    switch (Number(task.algorithm)) {
      case algorithms.full:
        copyNames = this.prepareFull(point, task)
        break
      case algorithms.incremental:
        copyNames = await this.prepareIncremental(point, task)
        break
      case algorithms.differential:
        copyNames = await this.prepareDifferential(point, task)
        break
    }

    await this.execute(copyNames, task)
  },
  async getRestoreData (pointId) {
    const point = await db.points.findOne({ _id: pointId })
    const task = await db.tasks.findOne({ _id: point.taskId })
    return { point, task }
  },
  prepareFull (point, task) {
    return [point.filename]
  },
  async prepareIncremental (point, task) {
    if (!point.previous) {
      return [point.filename]
    }
    const taskPoints = (await db.points.find({ taskId: task._id }))
      .filter(tp => tp.createdAt <= point.createdAt)

    return _(taskPoints).sortBy('createdAt').value().map(tp => tp.filename)
  },
  async prepareDifferential (point, task) {
    if (!point.previous) {
      return [point.filename]
    }
    const taskPoints = await db.points.find({ taskId: task._id })
    return [taskPoints.find(p => !p.previous).filename, point.filename]
  },
  async execute (copyNames, task, point) {
    for (const copyName of copyNames) {
      if (Number(task.medium) === mediums.cloud) {
        const downloadUrl = await getYandexDownloadUrl(copyName)
        const fileContents = await axios.get(downloadUrl)
        await fs.writeFile(copyName, fileContents.data)
      }

      if (task.isEncrypted) {
        const points = await db.points.find({})
        const actPoint = points.find(p => p.taskId === task._id && p.filename === copyName)
        await this.decrypt(copyName, task, actPoint)
      } else {
        await tar.x({ file: copyName, cwd: '/' })
        if (Number(task.medium) === mediums.cloud) {
          await fs.remove(copyName)
        }
      }
    }
    console.log('restored from backup ')
  },
  async decrypt (copyName, task, point) {
    return new Promise(async (resolve, reject) => {
      const key = await fs.readFile(path.join(task.keyStorage, '/',
        getKeyFilename(point.filename)))
      const iv = await encryption.deriveKey(config.ivPassword, point.ivSalt,
        config.iterations, 16, 'sha512')

      const input = fs.createReadStream(copyName + '.enc')
      const decipher = crypto.createDecipheriv(config.encryptionAlgorithm, key, iv)
      const output = await tar.x({ cwd: '/' })
      output.on('finish', () => { resolve() })
      output.on('error', err => { reject(err) })
      input.pipe(decipher).pipe(output)
    })
  }
}
