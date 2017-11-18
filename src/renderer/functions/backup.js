'use strict'
const moment = require('moment')
// const fs = require('fs')
const fse = require('fs-extra')

export default {
  do: async function (task) {
    // TODO проверки всякой хуйни
    const destination = task.destination + '/' +
      task.name + '_' +
      moment(task.datetime).format('YYYYMMDD-hhmmss')

    await fse.ensureDir(destination)
    task.files.forEach(async f => {
      const copyName = destination + '/' + f.name
      await fse.copy(f.name, copyName)
    })
  }
}
