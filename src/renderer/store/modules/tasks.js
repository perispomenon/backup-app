import db from '../../datastore'
import backup from '../../functions/backup'
import restore from '../../functions/restore'

const state = {
  all: [],
  chosen: null,
  running: { id: null, now: 0 }
}

const mutations = {
  TASKS_ALL (state, data) {
    state.all = data
  },
  TASK_CHOOSE (state, id) {
    state.chosen = id
  },
  TASK_RUN (state, id) {
    state.running.id = id
  },
  RUNNING_TASK_SET (state, value) {
    if (value >= 100) { return }
    state.running.now = value
  }
}

const actions = {
  async getAllTasks ({ commit }) {
    const data = await db.tasks.find({})
    commit('TASKS_ALL', data)
  },
  async backup ({ commit }, params) {
    await backup.do(params)
  },
  async restore ({ commit }, pointId) {
    await restore.do(pointId)
  }
}

export default {
  state,
  mutations,
  actions
}
