import db from '../../datastore'
import sortBy from 'lodash/sortBy'

const state = {
  taskPoints: [],
  taskPointsForManage: []
}

const mutations = {
  POINTS_BY_TASK (state, points) {
    state.taskPoints = sortBy(points, 'createdAt')
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
