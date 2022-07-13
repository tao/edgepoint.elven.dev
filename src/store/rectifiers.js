import { _reduceAllDetails, _removeUnansweredDuplicates } from '../utils/utils'
import { isProxy, toRaw } from 'vue'

const getDefaultState = () => ({
  data: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  countRectifiers: (state) => (id) => {
    return state.data[id].rectifiers.length
  },
  getRectifiers: (state) => {
    let obj = {}

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      let responseObj = {}

      el.rectifiers.forEach((rec, idx) => {

        Object.keys(rec).forEach(recKey => {
          responseObj[`rectifier_${idx+1}_${recKey}`] = rec[recKey]
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

    let rectifiers = data.rectifiers

    // clean
    rectifiers = rectifiers.filter(el => el.kind !== 'category')
    rectifiers = rectifiers.filter(el => el.kind !== 'yesNoCheckbox')

    // remove photos
    rectifiers = rectifiers.filter(el => {
      if (el.columns[0].heading.includes('Photo')) return false;
      else return el;
    })

    // remove empty duplicates
    rectifiers = _removeUnansweredDuplicates(rectifiers)
    rectifiers = _reduceAllDetails(rectifiers)

    let rectifiersObj = []
    let responseObj = Object.assign({}, rectifiers)

    // group by #
    Object.keys(rectifiers).map(key => {

      let match = key.match(/rectifier_(\d+).+/i)
      if (match) {

        let recNum = match[1]
        rectifiersObj.push(rectifiers[key][0])

        delete responseObj[key]
      }

    })

    state.data[data.siteId] = Object.assign({}, {
      ...responseObj,
      siteId: data.siteId,
      rectifiers: rectifiersObj,
    })

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
