import db from '../../datastore'

const state = {
  taskPoints: []
}

const mutations = {
  POINTS_BY_TASK (state, points) {
    state.taskPoints = points
  }
}

const actions = {
  async getTaskPoints ({ commit }, taskId) {
    const data = await db.points.find({ taskId })
    commit('POINTS_BY_TASK', data)
  }
}

export default {
  state,
  mutations,
  actions
}
