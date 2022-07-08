const getDefaultState = () => ({
  sites: []
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getValidSubmissions: (state) => {
    return state.sites
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  'PROCESS': (state, data) => {
    state.sites.push(data.siteId)
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
