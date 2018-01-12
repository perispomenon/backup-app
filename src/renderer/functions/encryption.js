'use strict'

import crypto from 'crypto'

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
  }
}
