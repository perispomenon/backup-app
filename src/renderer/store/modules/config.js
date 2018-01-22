import db from '../../datastore'

const state = {
  settings: null
}

const mutations = {
  GET_SETTINGS (state, newSet) {
    state.settings = newSet
  }
}

const actions = {
  async getSettings ({ commit }) {
    const settings = await db.config.find({})
    if (settings) commit('GET_SETTINGS', settings[0])
  },
  async saveSettings ({ commit }, newSettings) {
    const prevSettings = await db.config.find({})
    if (!prevSettings.length) {
      await db.config.insert(newSettings)
    } else {
      await db.config.update({ _id: prevSettings[0]._id }, {
        $set: { filter: newSettings.filter }
      })
    }
  }
}

export default {
  state,
  mutations,
  actions
}
