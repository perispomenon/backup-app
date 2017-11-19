'use strict'
const moment = require('moment')
// const fse = require('fs-extra')
const tar = require('tar')

export default {
  do: async function (task) {
    // TODO проверки всякой хуйни
    const destination = task.destination + '/' +
      task.name + '_' +
      moment(task.datetime).format('YYYYMMDD-hhmmss') + '.tgz'

    // await fse.ensureDir(destination)
    // task.files.forEach(async f => {
    //   const copyName = destination + '/' + f.name
    //   await fse.copy(f.name, copyName)
    // })
    console.log(destination)
    await tar.c({ file: destination, gzip: true }, task.files.map(f => f.name))
  }
}
