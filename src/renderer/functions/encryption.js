'use strict'

import crypto from 'crypto'
import fs from 'fs'
import config from '../../config'

export default {
  generateSalt () {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, salt) => {
        if (err) reject(err)
        else resolve(salt.toString('hex'))
      })
    })
  },
  deriveKey (password, salt, iterations, keylen, digest) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
        if (err) reject(err)
        else resolve(key)
      })
    })
  },
  do (archive, filename, key, iv) {
    return new Promise((resolve, reject) => {
      const cipher = crypto.createCipheriv(config.encryptionAlgorithm, key, iv)
      const output = fs.createWriteStream(filename)
      output.on('finish', () => { resolve() })
      output.on('error', err => { reject(err) })
      archive.pipe(cipher).pipe(output)
    })
  }
}
