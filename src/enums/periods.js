'use strict'

const periods = {
  everyDay: 1,
  everyWeek: 2,
  everyMonth: 3,
  manually: 4
}

function getPeriodName (id) {
  switch (Number(id)) {
    case 1:
      return 'каждый день'
    case 2:
      return 'каждую неделю'
    case 3:
      return 'каждый месяц'
    case 4:
      return 'вручную'
  }
}

// FOR TESTING YET
function getCron (id) {
  switch (Number(id)) {
    case 1:
      return '@daily'
    case 2:
      return '@weekly'
    case 3:
      return '@monthly'
  }
}

module.exports = {
  periods,
  getPeriodName,
  getCron
}
