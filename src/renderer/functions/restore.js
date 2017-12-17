'use strict'
import db from '../datastore'
import tar from 'tar'

export default {
  do: async function (pointId) {
    const point = await db.points.findOne({ _id: pointId })
    await tar.x({ file: point.filename, cwd: '/' })
    console.log('restored from backup')
  }
}
