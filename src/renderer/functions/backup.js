'use strict'
const tar = require('tar')
// const { algorithms } = require('../../enums/algorithms')

export default {
  do: async function (params) {
    const task = params.task
    const filename = params.filename

    if (!task.files.length) {
      console.error('No files to backup')
    }

    await tar.c({ file: filename, gzip: true }, task.files.map(f => f.name))
    console.log('created backup')
  }
}
