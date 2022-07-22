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
    let total = state.data[id].total
    let before7Count = state.data[id].before7Count
    let after7Count = state.data[id].after7Count

    // if (total === undefined) {
    //   total = Object.keys(state.data[id].structures).length
    // }

    return {
      amount_structures: total,
      amount_structures_before_7: before7Count,
      amount_structures_above_7: after7Count,
    }
  },
  getTowerDetails: (state) => (id) => {
    let firstStructure = state.data[id].structures[1]
    let secondStructure = state.data[id].structures[2]

    let res = {}
    if (firstStructure) {
      res['tower_1_type'] = ((firstStructure.details[0]
          ? firstStructure.details[0].structure_type
          : undefined) ?? undefined)

      res['tower_1_height'] = ((firstStructure.height[0]
          ? firstStructure.height[0].structure_height
          : undefined) ?? undefined)
    }

    if (secondStructure) {
      res['tower_2_type'] = ((secondStructure.details[0]
        ? secondStructure.details[0].structure_type
        : undefined) ?? undefined)

      res['tower_2_height'] = ((secondStructure.height[0]
        ? secondStructure.height[0].structure_height
        : undefined) ?? undefined)
    }

    return res;
  },
  getEquipmentArrays: (state) => {
    let arrays = []

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      Object.keys(el.structures).forEach(structureId => {
        let elx = el.structures[structureId]
        elx = isProxy(elx) ? toRaw(elx) : elx

        // console.log(elx)
        // console.log(`structure_${structureId}_type`)

        elx.equipment_details.forEach(ed => {
          arrays.push({
            id: el.siteId,
            structureId: `Structure ${structureId}`,
            structure_type: elx.details[0][`structure_type`],
            fall_arrest: elx.details[0][`fall_arrest_system`],
            structure_height: elx.height[0]['structure_height'],
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

    // console.log(structures)


    // clean
    structures = structures.filter(el => el.kind !== 'preFilledText')


    // console.log('total')
    // console.log(total)

    // console.log(structures)

    // console.log('before & after')
    let before7Count, after7Count
    let before7 = structures.filter(el => el.description.includes('up to 7'))
    structures = structures.filter(el => !el.description.includes('Up to 7'))

    let after7 = structures.filter(el => el.description.includes('in excess of 7'))
    structures = structures.filter(el => !el.description.includes('in excess of 7'))


    // numbers before and after 7
    if (before7[0] && before7[0]['selectedItems'] && before7[0]['selectedItems'][0]) {
      before7Count = before7[0]['selectedItems'][0]['value'] ?? undefined
    }

    if (after7[0] && after7[0]['selectedItems'] && after7[0]['selectedItems'][0]) {
      after7Count = after7[0]['selectedItems'][0]['value'] ?? undefined
    }

    // console.log('before ' + before7Count)
    // console.log('after ' + after7Count)

    // get total
    let totalField = structures.filter(el => el.description.includes('Number of Separate Structures'))
    let total = undefined
    structures = structures.filter(el => !el.description.includes('Number of Separate Structures'))

    if (Array.isArray(totalField) && totalField.length > 0) {
      try {
        let selectedItems = totalField[0]['selectedItems']
        if (Array.isArray(selectedItems) && selectedItems.length > 0) {
          total = selectedItems[0]['value'] ?? undefined
        }
        if (total !== undefined) {
          total = parseInt(total)
        }
      } catch(e) {
        console.log('error getting total')
        console.log(totalField)
      }
    }




    // clean
    structures = structures.filter(el => el.kind !== 'category')

    // console.log(structures)

    // remove empty duplicates
    structures = _removeUnansweredDuplicates(structures)

    // console.log('remove unanswered')
    // console.log(structures)

    structures = _reduceAllDetails(structures)

    // console.log('reduced')
    // console.log(structures)

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

        // console.log(shortKey)
        // console.log(structures[key])
        // console.log(structureObj[structureNum])

        delete responseObj[key]
      }

    })

    // remap structure keys to remove number in keyname
    let newStructureObj = {}
    Object.keys(structureObj).map(key => {
      let structureEl = structureObj[key]

      let details = structureEl['details']
      details = details.map(el => {
        return {
          ...el,
          structure_type: el[`structure_${key}_type`],
        }
      })


      let equipment_details = structureEl['equipment_details']
      let faces = structureEl['faces']
      faces = faces.map(el => {
        return {
          ...el,
          structure_faces_1_to_4: el[`structure_${key}_faces_1_to_4`],
        }
      })


      let height = structureEl['height']
      // console.log('height')
      // console.log(height)

      height = height.map(el => {
        // console.log(el)

        let unNumberedHeight = el['structure_height']
        let numberedHeight = el[`structure_${key}_height`]

        // console.log(unNumberedHeight)
        // console.log(numberedHeight)

        return {
          structure_height: (
            unNumberedHeight ?? numberedHeight ?? undefined
          )
        }
      })

      // console.log(height)

      newStructureObj[key] = {
        details,
        equipment_details,
        faces,
        height,
      }
    })

    structureObj = newStructureObj

    // reorganise structures
    let structureFirstKey = Object.keys(structureObj).sort()[0]
    let structuresStartsAt8 = (parseInt(structureFirstKey) === 8)

    if ((!total || total < 7) && structuresStartsAt8) {
      let renumberedStructureObj = {}
      Object.keys(structureObj).sort().forEach(key => {
        let count = (key - 7)

        let structureEl = structureObj[key]

        let details = structureEl['details']
        details = details.map(el => {
          let res = {
            ...el,
            [`structure_${count}_type`]: el[`structure_${key}_type`],
          }
          delete res[`structure_${key}_type`]
          return res
        })


        let equipment_details = structureEl['equipment_details']
        let faces = structureEl['faces']
        faces = faces.map(el => {
          let res = {
            ...el,
            [`structure_${count}_faces_1_to_4`]: el[`structure_${key}_faces_1_to_4`],
          }
          delete res[`structure_${key}_faces_1_to_4`]
          return res
        })


        let height = structureEl['height']
        // height = height.map(el => {
        //   let res = {
        //     ...el,
        //     [`structure_${count}_height`]: el[`structure_${key}_height`],
        //     [`structure_${count}_height`]: el[`structure_${key}_height`],
        //   }
        //   delete res[`structure_${key}_height`]
        //   return res
        // })


        renumberedStructureObj[count] = {
          details,
          equipment_details,
          faces,
          height,
        }
      })

      structureObj = Object.assign({}, renumberedStructureObj)
    }


    // console.log(structureObj)

    state.data[data.siteId] = Object.assign({}, {
      ...responseObj,
      siteId: data.siteId,
      structures: structureObj,
      total: total,
      before7Count,
      after7Count,
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
