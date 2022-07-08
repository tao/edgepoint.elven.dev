import { _reduceAllDetails, _removeUnansweredDuplicates } from '../utils/utils'
import { isProxy, toRaw } from 'vue'

const getDefaultState = () => ({
  data: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  countAcus: (state) => (id) => {
    return state.data[id].acus.length
  },
  getAcus: (state) => {
    let obj = {}

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      let responseObj = {}

      el.acus.forEach((acu, idx) => {

        Object.keys(acu).forEach(acuKey => {
          responseObj[`acu_${idx+1}_${acuKey}`] = acu[acuKey]
        })

      })

      obj[site] = responseObj

    })

    return obj
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  'PROCESS': (state, data) => {

    let acu = data.acu

    // clean
    acu = acu.filter(el => el.kind !== 'category')
    acu = acu.filter(el => el.kind !== 'preFilledText')

    // remove empty duplicates
    acu = _removeUnansweredDuplicates(acu)
    acu = _reduceAllDetails(acu)

    state.data[data.siteId] = {
      acus: acu['acu_details'] ?? [],
      siteId: data.siteId,
    }

  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
