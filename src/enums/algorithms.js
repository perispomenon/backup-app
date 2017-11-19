'use strict'

const algorithms = {
  full: 1,
  incremental: 2,
  differential: 3
}

function getAlgorithmName (id) {
  switch (Number(id)) {
    case 1:
      return 'Полное копирование'
    case 2:
      return 'Инкрементное копирование'
    case 3:
      return 'Дифференциальное копирование'
  }
}

module.exports = {
  algorithms,
  getAlgorithmName
}
