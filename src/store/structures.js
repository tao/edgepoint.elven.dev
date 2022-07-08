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
  countStructures: (state) => (id) => {
    return state.data[id].structures.length
  },
  getEquipmentArrays: (state) => {
    let arrays = []

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      Object.keys(el.structures).forEach(structureId => {
        let elx = el.structures[structureId]
        elx = isProxy(elx) ? toRaw(elx) : elx

        elx.equipment_details.forEach(ed => {
          arrays.push({
            id: el.siteId,
            structureId: `Structure ${structureId}`,
            ...ed,
          })
        })

      })

    })

    return arrays
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  'PROCESS': (state, data) => {

    let structures = data.structures

    // clean
    structures = structures.filter(el => el.kind !== 'preFilledText')
    structures = structures.filter(el => el.kind !== 'category')

    // remove empty duplicates
    structures = _removeUnansweredDuplicates(structures)
    structures = _reduceAllDetails(structures)

    let structureObj = {}
    let responseObj = Object.assign({}, structures)

    // group by structure #
    Object.keys(structures).map(key => {

      let match = key.match(/structure_(\d+).+/i)
      if (match) {
        let structureNum = match[1]
        let shortKey = key.match(/structure_(\d+)_(.+)/i)[2]
        structureObj[structureNum] = {
          ...structureObj[structureNum],
          [shortKey]: structures[key]
        }
        delete responseObj[key]
      }

    })

    state.data[data.siteId] = Object.assign({}, {
      ...responseObj,
      siteId: data.siteId,
      structures: structureObj,
    })

  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
