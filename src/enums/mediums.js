'use strict'

const mediums = {
  local: 1,
  cloud: 2
}

function getMediumName (id) {
  switch (Number(id)) {
    case 1:
      return 'Локальный диск или устройство'
    case 2:
      return 'Облачное хранилище'
  }
}

module.exports = {
  mediums,
  getMediumName
}
