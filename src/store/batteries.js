import { _reduceAllDetails, _removeUnansweredDuplicates } from '../utils/utils'
import { isProxy, toRaw } from 'vue'

const getDefaultState = () => ({
  data: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  countBatteries: (state) => (id) => {
    return state.data[id].batteries.length
  },
  getBatteries: (state) => {
    let obj = {}

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      let responseObj = {}

      el.batteries.forEach((bat, idx) => {

        Object.keys(bat).forEach(batKey => {
          responseObj[`battery_${idx+1}_${batKey}`] = bat[batKey]
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

    let batteries = data.batteries

    // clean
    batteries = batteries.filter(el => el.kind !== 'yesNoCheckbox')

    // remove empty duplicates
    batteries = _removeUnansweredDuplicates(batteries)
    batteries = _reduceAllDetails(batteries)


    let batteryObj = []
    let responseObj = Object.assign({}, batteries)

    // group by battery #
    Object.keys(batteries).map(key => {

      // remove unnecessary _details2 key with photos
      let photos = key.match(/_details2/i)
      if (photos) {
        delete responseObj[key]
        return false;
      }

      let match = key.match(/battery_bank_(\d+).+/i)
      if (match) {

        let batteryNum = match[1]
        batteryObj.push(batteries[key][0])
        // batteryObj[batteryNum] = batteries[key][0]

        delete responseObj[key]
      }

    })


    state.data[data.siteId] = Object.assign({}, {
      ...responseObj,
      siteId: data.siteId,
      batteries: batteryObj,
    })

  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
