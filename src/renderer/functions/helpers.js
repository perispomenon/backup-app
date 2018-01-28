'use strict'
import hasha from 'hasha'
import axios from 'axios'
import moment from 'moment'
import { remote } from 'electron'
import config from '../../config'
import db from '../datastore'

function getFileHash (filename, attrs) {
  const indicator = filename + attrs.size + attrs.mtime
  return hasha(indicator, { algorithm: 'md5' })
}

function getKeyFilename (pointName) {
  const parts = pointName.split('/')
  const lastPart = parts[parts.length - 1]
  return `${lastPart.slice(0, lastPart.length - 4)}.mky`
}

async function getYandexUploadUrl (fullFilename) {
  const parts = fullFilename.split('/')
  const filename = parts[parts.length - 1]
  const uploadUrl = await axios.request({
    url: `https://cloud-api.yandex.net/v1/disk/resources/upload?path=${config.yandexAppPrefix}${filename}`,
    method: 'get',
    headers: {
      Authorization: config.yandexToken
    }
  })
  return uploadUrl.data.href
}

async function getYandexDownloadUrl (fullFilename) {
  const parts = fullFilename.split('/')
  const filename = parts[parts.length - 1]
  const downloadUrl = await axios.request({
    url: `https://cloud-api.yandex.net/v1/disk/resources/download?path=${config.yandexAppPrefix}${filename}`,
    method: 'get',
    headers: {
      Authorization: config.yandexToken
    }
  })
  return downloadUrl.data.href
}

function generateFilename (task, pointName) {
  const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss')
  const prefix = task.destination || remote.app.getPath('userData') + '/' + 'backup-app'
  return prefix + '/' + task.name + '_' + pointName + '_' + timestamp + '.mbc'
}

async function getConfigFilter () {
  const fString = await db.config.find({})
  if (fString.length) {
    const filter = fString[0].filter.split(';')
    return filter
  } else {
    return null
  }
}

export { getFileHash, getKeyFilename, getYandexUploadUrl, getYandexDownloadUrl, generateFilename, getConfigFilter }
