import { _reduceTableDetails } from '../utils/utils'
import { isProxy, toRaw } from 'vue'

const getDefaultState = () => ({
  data: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getTableByFieldId: (state) => (siteId, id) => {
    let tables = state.data[siteId].filter(el => el.dependsOn.fieldId === id)
    return tables[0] ?? undefined
  },
  getTransmissionType: (state) => (siteId, transmission_type) => {
    let id = transmission_type['id']
    let tables = state.data[siteId].filter(el => el.dependsOn.fieldId === id)
    let table = tables[0] ?? undefined

    // console.log(table)


    if (table) {

      // if (isProxy(table)) {
      //   table = toRaw(table)
      // }

      table = _reduceTableDetails(table)
      // console.log(table)

      if (table[0]) {
        table = table[0]['transmission_type']
      }
    }

    return typeof table === 'string' ? table : undefined
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  'PROCESS': (state, data) => {

    let tables = data.tables
    state.data[data.siteId] = tables

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
