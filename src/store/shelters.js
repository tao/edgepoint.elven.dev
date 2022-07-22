import {
  _reduceAllDetails,
  _removeUnansweredDuplicates,
} from '../utils/utils'
import { isProxy, toRaw } from 'vue'

const getDefaultState = () => ({
  data: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  countShelters: (state) => (id) => {
    return Object.keys(state.data[id].shelters).length
  },
  getShelters: (state) => {
    let obj = {}

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      let responseObj = {}

      Object.keys(el.shelters).forEach((shelterKey, idx) => {

        let shelter = el.shelters[shelterKey]

        Object.keys(shelter.type).forEach(shelterKey2 => {
          responseObj[`shelter_${idx+1}_${shelterKey2}`] = shelter.type[shelterKey2]
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

    let shelters = data.shelters

    // clean
    shelters = shelters.filter(el => el.kind !== 'preFilledText')
    shelters = shelters.filter(el => el.kind !== 'category')

    // console.log(shelters)

    // remove empty duplicates
    shelters = _removeUnansweredDuplicates(shelters)

    // console.log('remove unanswered')
    // console.log(shelters)

    shelters = _reduceAllDetails(shelters)

    // console.log('reduced')
    // console.log(shelters)

    let structureObj = {}
    let responseObj = Object.assign({}, shelters)


    // group by shelters #
    Object.keys(shelters).map(key => {

      let match = key.match(/roomshelter_(\d+).+/i)
      if (match) {
        let structureNum = match[1]
        let shortKey = key.match(/roomshelter_(\d+)_(.+)/i)[2]
        structureObj[structureNum] = {
          ...structureObj[structureNum],
          [shortKey]: shelters[key][0]
        }

        delete responseObj[key]
      }

    })


    state.data[data.siteId] = Object.assign({}, {
      // ...responseObj,
      siteId: data.siteId,
      shelters: structureObj,
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
