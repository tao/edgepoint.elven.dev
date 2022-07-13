import { _reduceAllDetails, _removeUnansweredDuplicates } from '../utils/utils'
import { isProxy, toRaw } from 'vue'

const getDefaultState = () => ({
  data: []
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getWarnings: (state) => {
    return state.data
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  'ADD_NEW_WARNING': (state, data) => {
    state.data.push(data.msg)
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
