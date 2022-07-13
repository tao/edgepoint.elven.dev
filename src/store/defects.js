import { isProxy, toRaw } from 'vue';
import {
  _reduceAllDetails, _reduceTableDetails, _removeUnansweredDuplicates,
} from '../utils/utils'

const getDefaultState = () => ({
  data: {},
  assessments: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getDefectAssessment: (state, getters) => {
    let arrays = []

    Object.keys(state.data).forEach(site => {
      let element = state.assessments[site]
      element = isProxy(element) ? toRaw(element) : element

      // console.log('-------- ' + site)

      // Object.keys(el).forEach(k2 => {

        // let element = el[k2]

        // console.log(element)

        // if (isProxy(element)) {
        //   element = toRaw(element)
        // }

        if (element.kind === 'yesNoCheckbox' && element.checked === 'yes') {
          let table = getters.getTableByFieldId(site, element.id)
          // console.log('---')
          // console.log(element)
          // console.log(table)

          if (table) {
            table = _reduceTableDetails(table)
            // console.log(table)
            table.forEach(tableEl => {
              // console.log(tableEl)

              Object.keys(tableEl).forEach(type => {
                let explanation = tableEl[type]
                let title = type.replaceAll('_', ' ').titleCase()

                arrays.push({
                  id: site,
                  type: title,
                  assessment: explanation
                })

              })


            })
          }
        }
    })

    return arrays
  },
  getDefectsArrays: (state, getters) => {
    let arrays = []

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      // console.log('-------- ' + site)

      Object.keys(el).forEach(k2 => {

        let element = el[k2]

        // console.log(element)

        if (isProxy(element)) {
          element = toRaw(element)
        }

        if (element.kind === 'yesNoCheckbox' && element.checked === 'yes') {
          try {
            let table = getters.getTableByFieldId(site, element.id)

            // console.log('---')
            // console.log(element)
            // console.log(table)

            if (table) {
            table = _reduceTableDetails(table)

            // console.log(table)

            table.forEach(tableEl => {
              arrays.push({
                id: site,
                defect_type: element.description.replace("Record ", ""),
                unused_equipment: tableEl.unused_equipment_in_compund ?? tableEl.unused_equipment_in_compound ?? '',
                position_on_site: tableEl.location_on_site,
                description: tableEl.equipment_description,
              })
            })
          }

          } catch (e) {
            console.log(site)
            console.log(element.id)
            throw new Error(e)
          }

        }

        if (!Array.isArray(element)) return;

        if (k2.includes('record_structure')) {


          // filter an empty object
          element = element.filter(obj => {
            return Object.values(obj).filter(el => el !== undefined).filter(el => el !== "").length > 0
          })

          element.map(defect => {

            // console.log(defect)

            let structureId = k2.match(/record_structure_(\d+).*/i)[1]

            arrays.push({
              ...defect,
              defect_type: 'Structure Defect',
              id: site,
              position_on_site: `Structure ${structureId}`,
            })
          })
        }

        if (k2.includes('unused_equipment_in_the_roomshelter')) {
          // filter an empty object
          element = element.filter(obj => {
            return Object.values(obj).filter(el => el !== undefined).filter(el => el !== "").length > 0
          })

          element.map(defect => {
            arrays.push({
              id: site,
              defect_type: 'Unused Equipment in the Room/Shelter',
              unused_equipment: defect.equipment_description,
              // defect_area: 'compound',
              // defect_grade: '4. Minor',
              position_on_site: defect.location_in_roomshelter,
              description: defect.unused_equipment_in_the_shelter,
            })
          })
        }

        if (k2.includes('record_defect')) {

          // filter an empty object
          element = element.filter(obj => {
            return Object.values(obj).filter(el => el !== undefined).filter(el => el !== "").length > 0
          })

          element.map(defect => {
            let type = 'Room / Shelter & Rectifier / Battery / ACU Defects'
            let pos = defect.position_in_roomshelter

            if (defect.defect_area === 'Compound') {
              type = 'Compound & External Defects'
              pos = defect.position_on_site
            }

            arrays.push({
              id: site,
              defect_type: type,
              defect_area: defect.defect_area,
              defect_grade: defect.defect_grade,
              position_on_site: pos,
              description: [defect.defect_description, defect.defect_photo]
                    .filter(el => el !== undefined)
                    .filter(el => el !== '')
                    .join('; '),
            })
          })
        }

      })

      // console.log('--------')

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

    // console.log('PROCESS BEFORE')
    // console.log(defects)

    // console.log('PROCESS DEFECTS')
    defects = _removeUnansweredDuplicates(defects)
    // console.log(defects)

    // console.log('REDUCE DEFECTS')
    defects = _reduceAllDetails(defects)
    // console.log(defects)

    let assessments = defects['record_quality_engineer_assessment']
    delete defects['record_quality_engineer_assessment']

    state.data[data.siteId] = Object.assign({}, defects)
    state.assessments[data.siteId] = Object.assign({}, assessments)

  },
  'DELETE_DUPLICATE_SITE': (state, data) => {
    let newState = state
    delete newState.data[data.siteId]
    delete newState.assessments[data.siteId]
    return newState
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
