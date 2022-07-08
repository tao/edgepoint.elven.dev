import { isProxy, toRaw } from 'vue';
import {
  _reduceAllDetails, _removeUnansweredDuplicates,
} from '../utils/utils'

const getDefaultState = () => ({
  data: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getDefectsArrays: (state) => {
    let arrays = []

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      Object.keys(el).forEach(k2 => {
        if (!Array.isArray(el[k2])) return;

        if (k2.includes('record_structure')) {
          el[k2].map(defect => {

            let structureId = k2.match(/record_structure_(\d+).*/i)[1]

            arrays.push({
              ...defect,
              defect_type: 'Structure Defect',
              id: site,
              position_on_site: `Structure ${structureId}`,
            })
          })
        }

        if (k2.includes('unused_equipment')) {
          el[k2].map(defect => {
            arrays.push({
              id: site,
              defect_type: 'Unused Equipment in the Room/Shelter',
              unused_equipment: defect.unused_equpment_in_the_shelter,
              // defect_area: 'compound',
              // defect_grade: '4. Minor',
              position_on_site: defect.location_in_roomshelter,
              description: defect.equipment_description,
            })
          })
        }
      })

    })

    return arrays
  }
}

// actions
const actions = {

}

// mutations
const mutations = {
  'PROCESS': (state, data) => {

    let defects = data.defects

    defects = _removeUnansweredDuplicates(defects)
    defects = _reduceAllDetails(defects)


    state.data[data.siteId] = Object.assign({}, defects)

  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
