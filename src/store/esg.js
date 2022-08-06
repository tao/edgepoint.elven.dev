import { isProxy, toRaw } from 'vue';
import {
  _reduceAllDetails, _reduceTableDetails, _removeUnansweredDuplicates,
} from '../utils/utils'

const getDefaultState = () => ({
  data: {},
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getEsgDetails: (state, getters) => {
    let arrays = []

    Object.keys(state.data).forEach(siteKey => {

      let siteEl = state.data[siteKey]
      let newSiteEl = {}

      let esg = Object.keys(siteEl).forEach(key => {
        let el = siteEl[key]
        newSiteEl[key] = el.checked ?? null
      })

      arrays.push({
        ...newSiteEl,
        id: siteKey,
      })
    })

    return arrays
  },
}

// actions
const actions = {

}

// mutations
const mutations = {
  'PROCESS': (state, data) => {

    let esg = data.esg

    // console.log('REDUCE ESG')

    // let assessments = defects['record_quality_engineer_assessment']
    // delete defects['record_quality_engineer_assessment']

    state.data[data.siteId] = Object.assign({}, esg)

  },
  'DELETE_DUPLICATE_SITE': (state, data) => {
    let newState = state
    delete newState.data[data.siteId]
    return newState
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
