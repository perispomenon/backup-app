'use strict'
import hasha from 'hasha'

export default {
  getFileHash (filename, attrs) {
    const indicator = filename + attrs.size + attrs.mtime
    return hasha(indicator, { algorithm: 'md5' })
  }
}
