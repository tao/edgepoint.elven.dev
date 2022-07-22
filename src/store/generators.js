import { _reduceAllDetails, _removeUnansweredDuplicates } from '../utils/utils'
import { isProxy, toRaw } from 'vue'

const getDefaultState = () => ({
  data: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  countGenerators: (state) => (id) => {
    return state.data[id].generators.length
  },
  getGenerators: (state) => {
    let obj = {}

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      let responseObj = {}

      el.generators.forEach((gen, idx) => {

        Object.keys(gen).forEach(genKey => {
          responseObj[`generator_${idx+1}_${genKey}`] = gen[genKey]
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

    let generators = data.generators

    // clean
    generators = generators.filter(el => el.kind !== 'category')
    generators = generators.filter(el => !el.description.includes('Photos'))

    // remove empty duplicates
    generators = _removeUnansweredDuplicates(generators)
    generators = _reduceAllDetails(generators)

    let generatorObj = []
    let responseObj = Object.assign({}, generators)

    // group by battery #
    Object.keys(generators).map(key => {

      let match = key.match(/generator_(\d+)_details/i)
      if (match) {

        let genNum = match[1]
        generatorObj.push(generators[key][0])

        delete responseObj[key]
      }
    })

    state.data[data.siteId] = Object.assign({}, {
      ...responseObj,
      siteId: data.siteId,
      generators: generatorObj,
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
