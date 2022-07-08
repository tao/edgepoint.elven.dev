import { SITES } from '../constants/sites'

const getDefaultState = () => ({
  data: SITES
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getValidSites: (state) => (id) => {
    return state.data
  },
}

// actions
const actions = {}

// mutations
const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations,
}
