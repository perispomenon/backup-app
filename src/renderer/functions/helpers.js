'use strict'
import hasha from 'hasha'

function getFileHash (filename, attrs) {
  const indicator = filename + attrs.size + attrs.mtime
  return hasha(indicator, { algorithm: 'md5' })
}

function getKeyFilename (pointName) {
  const parts = pointName.split('/')
  const lastPart = parts[parts.length - 1]
  return `${lastPart.slice(0, lastPart.length - 4)}.mky`
}

export { getFileHash, getKeyFilename }
