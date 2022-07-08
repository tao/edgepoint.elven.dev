import {
  _reduceSurveyDetails,
  _reduceTableDetails,
  _reduceAllDetails,
} from '../utils/utils'

import {
  _validSite,
} from '../constants/sites'
import { isProxy, toRaw } from 'vue'

const getDefaultState = () => ({
  data: {}
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getSiteDetailsById: (state) => (id) => {
    return state.data[id];
  },
  getSiteDetails: (state) => {
    return state.data
  },
  getSurveyDetailDefects: (state) => {
    let arrays = []

    Object.keys(state.data).forEach(site => {
      let el = state.data[site]
      el = isProxy(el) ? toRaw(el) : el

      el.defects.forEach(def => {
        arrays.push({
          ...def,
          id: site,
          defect_type: 'Other',
          description: def['defect_description'],
        })
      })

    })

    return arrays
  }
}

String.prototype.slugify = function (separator = '_') {
  return this.toString().
    normalize(
      'NFD')                   // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
    .toLowerCase().
    trim().
    replace(/[^a-z0-9 ]/g,
      '')   // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, separator)
}

// actions
const actions = {
  'PROCESS_FILE': (context, payload) => {
    let data = payload.items

    // extract site id
    let siteId = data.filter(
      el => el.description.includes('Site ID'))[0].content
    data = data.filter(el => !el.description.includes('Site ID'))

    // if the site ID is valid, continue
    if (_validSite(siteId)) {
      context.dispatch('HANDLE_SITE', {
        ...payload,
        items: data,
        siteId: siteId,
      })
    }
  },
  'HANDLE_SITE': (context, payload) => {
    let data = payload.items

    // console.log(data)

    // form version
    let siteId = payload.siteId
    let formVersion = payload.formVersion
    let appVersion = payload.appVersion
    let formId = payload._id

    // extract Building Details
    let buildingDetails = data.filter(
      el => el.description.includes('Building Details'))[0]
    data = data.filter(el => !el.description.includes('Building Details'))

    buildingDetails = _reduceSurveyDetails(buildingDetails)
    let building_height = buildingDetails['building_height_m']

    // extract Survey Details
    let surveyDetails = data.filter(
      el => el.description.includes('Survey Details'))[0]
    data = data.filter(el => !el.description.includes('Survey Details'))

    // get defects
    let defects = data.filter(el => el.description.includes('Defects')
      || el.description.includes('Unused Equipment')
      || el.description.includes('Unused equipment'))
    data = data.filter(el => !el.description.includes('Defects'))
    data = data.filter(el => !el.description.includes('Unused Equipment'))
    data = data.filter(el => !el.description.includes('Unused equipment'))

    // get structures
    // Project Stratosphere Tower Equipment Audit Sheet_V3.1
    let structures = data.filter(el => el.description.includes('Structure'))
    data = data.filter(el => !el.description.includes('Structure'))

    // get generators
    let generators = data.filter(el => el.description.includes('Generator'))
    data = data.filter(el => !el.description.includes('Generator'))

    // get batteries
    let batteries = data.filter(el => el.description.includes('Battery Bank'))
    data = data.filter(el => !el.description.includes('Battery Bank'))

    // rectifiers
    let rectifiers = data.filter(el => el.description.includes('Rectifier'))
    data = data.filter(el => !el.description.includes('Rectifier'))

    // get shelters
    let shelters = data.filter(el => el.description.includes('Room/Shelter #'))
    data = data.filter(el => !el.description.includes('Room/Shelter #'))

    // acu
    let acu = data.filter(el => el.description.includes('ACU'))
    data = data.filter(el => !el.description.includes('ACU'))

    // everything else
    let other = data
    other = other.filter(el => el.kind !== 'preFilledText')
    other = other.filter(el => el.kind !== 'signature')
    other = other.filter(el => !el.description.includes('Signature'))
    other = other.filter(el => !el.description.includes('Photos'))
    other = _reduceAllDetails(other)

    // survey details
    let _surveyDetails = _reduceSurveyDetails(surveyDetails)
    let _processedSurveyDetails = {
      id: siteId,
      site_name: _surveyDetails.site_name,
      latitude: _surveyDetails.latitude,
      longitude: _surveyDetails.longitude,
      building_height: building_height,
      site_type: other.site_type,
      grid_connection: other['grid_connection_details']['grid_connection'],
      no_of_phases: other['grid_connection_details']['no_of_phases'],
      transformer_count: other['grid_connection_details']['transformer_count'],
      transformer_1_size: other['grid_connection_details']['transformer_1_size'],
      transformer_2_size: other['grid_connection_details']['transformer_2_size'],
      transformer_3_size: (other['grid_connection_details']['transformer_3_size'] || other['grid_connection_details']['ttransformer_3_size']), // spelling mistake
      other_sitestowers_within_500m: other['are_there_any_other_sitestowers_within_500m'],
      within_0_to_100m: other['nearby_sitestowers']['within_0_to_100m'],
      within_100m_to_200m: other['nearby_sitestowers']['within_100m_to_200m'],
      within_200m_to_300m: other['nearby_sitestowers']['within_200m_to_300m'],
      within_300m_to_500m: other['nearby_sitestowers']['within_300m_to_500m'],
      record_compound_and_fence_details: other['record_compound_and_fence_details'],
      compound_length_m: other['compound_details']['length_m'],
      compound_width_m: other['compound_details']['width_m'],
      compound_external_photos: other['compound_details']['external_photos'],
      record_site_earthing_details: other['record_site_earthing_details'],
      site_earthing_status: other['site_earthing_details']['site_earthing_status'],
      record_transmission_type: other['record_transmission_type'],
      record_site_ac_distribution_details: other['record_site_ac_distribution_details'],
      transfer_switch_on_site: other['transfer_switch_on_site'],
      transfer_switch_type_type: other['transfer_switch_details']['transfer_switch_type_type'],
      defects: other['record_defect'],
      surge_suppression_installed: other['surge_suppression_installed'],
    }

    delete other['site_type']
    delete other['battery_bank_count']
    delete other['grid_connection_details']
    delete other['are_there_any_other_sitestowers_within_500m']
    delete other['nearby_sitestowers']
    delete other['compound_details']
    delete other['record_compound_and_fence_details']
    delete other['record_site_earthing_details']
    delete other['site_earthing_details']
    delete other['record_transmission_type']
    delete other['record_site_ac_distribution_details']
    delete other['transfer_switch_on_site']
    delete other['transfer_switch_details']
    delete other['view_the_instructions_for_tower_leg_designation_and_recording_of_tower_and_equipment_details']
    delete other['record_defect']
    delete other['surge_suppression_installed']

    let response = {
      formVersion,
      appVersion,
      formId,
      siteId,
      surveyDetails: _processedSurveyDetails,
      structures,
      generators,
      batteries,
      rectifiers,
      shelters,
      defects,
      acu,
      other,
    }

    // console.log(response)

    // console.log({
    //   ...other,
    // })

    context.commit('PROCESS', response)
  }
}

// mutations
const mutations = {
  'PROCESS': (state, data) => {
    // TODO add a warning if the same siteId exists twice in the upload
    state.data[data.siteId] = data.surveyDetails
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
