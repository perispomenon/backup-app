import db from '../../datastore'
import backup from '../../functions/backup'

const state = {
  all: []
}

const mutations = {
  TASKS_ALL (state, data) {
    state.all = data
  }
}

const actions = {
  async getAllTasks ({ commit }) {
    const data = await db.find({})
    commit('TASKS_ALL', data)
  },
  async backup ({ commit }, id) {
    const task = await db.findOne({_id: id})
    await backup.do(task)
  }
}

export default {
  state,
  mutations,
  actions
}
