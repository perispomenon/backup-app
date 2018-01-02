'use strict'
import tar from 'tar'
import db from '../datastore'
import { algorithms } from '../../enums/algorithms'

export default {
  async do (pointId) {
    const { point, task } = await this.getRestoreData(pointId)

    let copyNames = []
    switch (Number(task.algorithm)) {
      case algorithms.full:
        copyNames = this.prepareFull(point, task)
        break
      case algorithms.incremental:
        copyNames = this.prepareIncremental(point, task)
        break
      case algorithms.differential:
        copyNames = await this.prepareDifferential(point, task)
        break
    }

    await this.execute(copyNames)
  },
  async getRestoreData (pointId) {
    const point = await db.points.findOne({ _id: pointId })
    const task = await db.tasks.findOne({ _id: point.taskId })
    return { point, task }
  },
  prepareFull (point, task) {
    return [point.filename]
  },
  prepareIncremental (point, task) {
    // TODO impl
    return [point.filename]
  },
  async prepareDifferential (point, task) {
    if (!point.previous) {
      return [point.filename]
    }
    const taskPoints = await db.points.find({ taskId: task._id })
    return [taskPoints.find(p => !p.previous).filename, point.filename]
  },
  async execute (copyNames) {
    for (const copyName of copyNames) {
      await tar.x({ file: copyName, cwd: '/' })
    }
    console.log('restored from backup ')
  }
}
