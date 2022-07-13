const getDefaultState = () => ({
  sites: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getValidSubmissions: (state) => {
    return Object.values(state.sites).map(el => el.siteId)
  },
  siteAlreadyExists: (state, getters) => (id) => {
    return getters.getValidSubmissions.includes(id)
  },
  siteFormVersion: (state) => (id) => {
    return parseInt(state.sites[id].formVersion)
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  'PROCESS': (state, data) => {
    state.sites[data.siteId] = {
      siteId: data.siteId,
      formVersion: data.formVersion,
    }
  },
  'DELETE_DUPLICATE_SITE': (state, data) => {
    let newState = state
    delete newState[data.siteId]
    return newState
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
