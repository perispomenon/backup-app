'use strict'
import hasha from 'hasha'
import axios from 'axios'
import config from '../../config'

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
  console.log(`https://cloud-api.yandex.net/v1/disk/resources/download?path=${config.yandexAppPrefix}${filename}`)
  const downloadUrl = await axios.request({
    url: `https://cloud-api.yandex.net/v1/disk/resources/download?path=${config.yandexAppPrefix}${filename}`,
    method: 'get',
    headers: {
      Authorization: config.yandexToken
    }
  })
  return downloadUrl.data.href
}

export { getFileHash, getKeyFilename, getYandexUploadUrl, getYandexDownloadUrl }
