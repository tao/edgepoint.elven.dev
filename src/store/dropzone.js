import {
  _reduceSurveyDetails,
  _reduceTableDetails,
  _reduceAllDetails, _reduceDropdown,
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
    let site = state.data[id];

    // Object.keys(site).forEach(sx => {
    //   let siteEl = site[sx]
    //
    //   if (siteEl.kind === 'yesNoCheckbox') {
    //     site[sx] = siteEl.checked
    //   }
    //
    // })

    return site
  },
  getSiteDetails: (state) => {
    let sites = state.data

    // Object.keys(sites).forEach(siteId => {
    //
    //   let site = sites[siteId]
    //
    //   Object.keys(site).forEach(sx => {
    //     let siteEl = site[sx]
    //
    //     if (siteEl && siteEl.kind === 'yesNoCheckbox') {
    //       sites[siteId][sx] = siteEl.checked
    //     }
    //
    //   })
    //
    // })

    return sites
  },
  getYellowDetails: (state, getters) => (id) => {
    let site = getters.getSiteDetailsById(id)

    return {
      site_name: site.site_name,
      latitude: site.latitude,
      longitude: site.longitude,
      site_type: site.site_type,
      building_height: site.building_height,
      structure_type: '', // TODO (where does this come from)
    }
  },
  getOrangeDetails: (state, getters) => (id) => {
    let site = getters.getSiteDetailsById(id)

    // quality acceptance signatures
    let date_quality_acceptance = site.reviewDetails.signatures.quality_reviewer_signoff.signedOn
    let date_final_acceptance = site.reviewDetails.signatures.final_reviewer_signoff.signedOn

    if (date_quality_acceptance) date_quality_acceptance = date_quality_acceptance.split('T')[0]
    if (date_final_acceptance) date_final_acceptance = date_final_acceptance.split('T')[0]

    // survey signature
    let signature = site.reviewDetails.form_signature.signatures[0]
    if (signature) signature = signature.signedOn
    if (signature) signature = signature.split('T')[0]

    return {
      site_name: site.site_name,
      survey_date: site.reviewDetails.survey_date, // Date of Survey
      date_survey_completed: signature, // TODO: Survey Completed Date (is this the date it was signed)
      quality_review_engineer: site.reviewDetails.quality_engineer, // Quality Engineer
      quality_review_status: site.reviewDetails.quality_review_status, // Quality Review Status
      date_quality_acceptance: date_quality_acceptance, // Quality Acceptance Date
      date_final_acceptance: date_final_acceptance, // Final Acceptance Date
    }
  },
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

String.prototype.titleCase = function () {
  return this.toString()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// actions
const actions = {
  'PROCESS_SITE': (context, payload) => {
    let data = payload.items

    // extract site id
    let siteId = data.filter(
      el => el.description.includes('Site ID'))[0].content
    data = data.filter(el => !el.description.includes('Site ID'))

    // clean blank spaces
    siteId = siteId.trim()

      // if site already exists
    let siteAlreadyExists = context.getters.siteAlreadyExists(siteId)
    if (siteAlreadyExists) {
      // console.log('site ' + siteId + ' already exists')
      // console.log(payload.formVersion + ' > ' + context.getters.siteFormVersion(siteId))

      // compare which version is greater
      let previousSiteAppVersion = context.getters.siteAppVersion(siteId)
      let previousSiteFormVersion = context.getters.siteFormVersion(siteId)

      if (payload.appVersion === previousSiteAppVersion) {
        // console.log('same version')
        if (payload.formVersion > previousSiteFormVersion) {
          // console.log(payload.formVersion + ' > ' + previousSiteFormVersion)

          // console.log('delete previous')
          // if the current one is greater (delete other and continue processing this site)
          context.commit('DELETE_DUPLICATE_SITE', {
            siteId: siteId,
          })
          // then continue below
          context.commit('ADD_NEW_WARNING', {
            msg: `Site ID "${siteId}" exists with the same version (${previousSiteAppVersion}), replacing form version (${previousSiteFormVersion}) with (${payload.formVersion}).`
          })

        } else {
          // console.log(payload.formVersion + ' < ' + previousSiteFormVersion)

        }
      } else {

        if (payload.appVersion > previousSiteAppVersion) {
          // console.log('delete previous')
          // if the current one is greater (delete other and continue processing this site)
          context.commit('DELETE_DUPLICATE_SITE', {
            siteId: siteId,
          })
          // then continue below
          context.commit('ADD_NEW_WARNING', {
            msg: `Site ID "${siteId}" exists with an older version (${previousSiteAppVersion}), replacing with (${payload.appVersion}).`
          })
        } else {
          // if the one in the store is greater (ignore this site)
          context.commit('ADD_NEW_WARNING', {
            msg: `Site ID "${siteId}" already exists with a newer version (${previousSiteAppVersion}), skipping.`
          })
          return true;
        }
      }
    }

    if (_validSite(siteId)) {
      context.dispatch('HANDLE_SITE', {
        ...payload,
        items: data,
        siteId: siteId,
      })
    } else {
      context.commit('ADD_NEW_WARNING', {
        msg: `Site ID "${siteId}" is not in the valid sites list: ignoring submission.`
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
    // console.log(buildingDetails)
    let building_height = buildingDetails['building_height_m']

    // extract Survey Details
    let surveyDetails = data.filter(
      el => el.description.includes('Survey Details'))[0]
    data = data.filter(el => !el.description.includes('Survey Details'))

    // tower works
    let towerWorks = data.filter(el => el.description.includes('Tower Works Completed or Ongoing'))[0]
    data = data.filter(el => !el.description.includes('Tower Works Completed or Ongoing'))
    towerWorks = _reduceDropdown(towerWorks)

    // console.log(surveyDetails)

    // get defects
    let defects = data.filter(el => el.description.includes('Defects')
      || el.description.includes('ACU defects')
      || el.description.includes('Unused Equipment')
      || el.description.includes('Unused equipment')
      // || el.description.includes('Record Defect')
      || el.description.includes('Record Quality Engineer Assessment'))
    data = data.filter(el => !el.description.includes('Defects'))
    data = data.filter(el => !el.description.includes('ACU defects'))
    data = data.filter(el => !el.description.includes('Unused Equipment'))
    data = data.filter(el => !el.description.includes('Unused equipment'))
    // data = data.filter(el => !el.description.includes('Record Defect'))
    data = data.filter(el => !el.description.includes('Record Quality Engineer Assessment'))

    let checkboxTables = data.filter(el => el.description.includes('Table name')
    || el.description.includes('Record Defect'))
    data = data.filter(el => !el.description.includes('Table name'))
    data = data.filter(el => !el.description.includes('Record Defect'))

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

    // signatures
    let signatures = data.filter(el => el.kind === 'signature')
    signatures = _reduceAllDetails(signatures)
    // console.log(signatures)
    data = data.filter(el => el.kind !== 'signature')

    // other = other.filter(el => !el.description.includes('Signature'))

    // console.log(other)
    let transmissionDetails = data.filter(el => el.description.includes('Record Transmission Type'))
    data = data.filter(el => !el.description.includes('Record Transmission Type'))

    if (Array.isArray(transmissionDetails)) {
      transmissionDetails = transmissionDetails[0]
    }


    // let gridDetails = data.filter(el => el.description.includes('Grid Connection Details'))
    // data = data.filter(el => !el.description.includes('Grid Connection Details'))
    //
    // gridDetails = _reduceAllDetails(gridDetails)
    //
    // console.log(gridDetails)


    // everything else
    let other = data
    other = other.filter(el => el.kind !== 'preFilledText')
    other = other.filter(el => !el.description.includes('Photos'))
    other = _reduceAllDetails(other)

    // console.log(other)

    // survey details
    let _surveyDetails = _reduceSurveyDetails(surveyDetails)

    let gridConnectionDetails = {}

    if (other['grid_connection_details'][0]) {
      gridConnectionDetails = {
        grid_connection: other['grid_connection_details'][0]['grid_connection'] ?? undefined,
        no_of_phases: other['grid_connection_details'][0]['no_of_phases'] ?? undefined,
        transformer_count: other['grid_connection_details'][0]['transformer_count'] ?? undefined,
        transformer_1_size: other['grid_connection_details'][0]['transformer_1_size'] ?? undefined,
        transformer_2_size: other['grid_connection_details'][0]['transformer_2_size'] ?? undefined,
        transformer_3_size: (other['grid_connection_details'][0]['transformer_3_size'] || other['grid_connection_details'][0]['ttransformer_3_size']) ?? undefined, // spelling mistake
      }
    }

    // review details
    let _processedReviewDetails = {
      quality_engineer: (typeof other['quality_engineer'] == 'string' ? other['quality_engineer'] : undefined),
      quality_review_status: (typeof other['quality_review_status'] == 'string' ? other['quality_review_status'] : undefined),
      survey_date: _surveyDetails['date'].split('T')[0],
      signatures,
      form_signature: other['signature'],
    }

    let recordTowerWorks = other['record_tower_works']
    // console.log(recordTowerWorks)
    recordTowerWorks = recordTowerWorks.map(el => {
      return el['describe_recentongoing_work']
    }).join('; ')


    // console.log(recordTowerWorks)
    // console.log(other)
    // console.log(_surveyDetails)

    let _processedSurveyDetails = {
      id: siteId,
      site_name: _surveyDetails.site_name,
      latitude: _surveyDetails.latitude,
      longitude: _surveyDetails.longitude,
      building_height: building_height,
      site_type: (typeof other.site_type === "string" ? other.site_type : undefined),
      ...gridConnectionDetails,
      other_sitestowers_within_500m: other['are_there_any_other_sitestowers_within_500m'],
      within_0_to_100m: (other['nearby_sitestowers'][0] ? other['nearby_sitestowers'][0]['within_0_to_100m'] : undefined),
      within_100m_to_200m: (other['nearby_sitestowers'][0] ? other['nearby_sitestowers'][0]['within_100m_to_200m'] : undefined),
      within_200m_to_300m: (other['nearby_sitestowers'][0] ? other['nearby_sitestowers'][0]['within_200m_to_300m'] : undefined),
      within_300m_to_500m: (other['nearby_sitestowers'][0] ? other['nearby_sitestowers'][0]['within_300m_to_500m'] : undefined),
      record_compound_and_fence_details: other['record_compound_and_fence_details'],
      compound_length_m: (other['compound_details'][0] ? other['compound_details'][0]['length_m'] : undefined),
      compound_width_m: (other['compound_details'][0] ? other['compound_details'][0]['width_m'] : undefined),
      record_site_earthing_details: other['record_site_earthing_details'],
      site_earthing_status: (other['site_earthing_details'][0] ? other['site_earthing_details'][0]['site_earthing_status'] : undefined),
      record_site_ac_distribution_details: other['record_site_ac_distribution_details'],
      transfer_switch_on_site: other['transfer_switch_on_site'],
      transfer_switch_1_type: (other['transfer_switch_details'][0] ? other['transfer_switch_details'][0]['transfer_switch_type_type'] : undefined),
      transfer_switch_2_type: (other['transfer_switch_details'][1] ? other['transfer_switch_details'][1]['transfer_switch_type_type'] : undefined),
      // defects: other['record_defect'],
      surge_suppression_installed: other['surge_suppression_installed'],
      reviewDetails: _processedReviewDetails,
      record_transmission_type: transmissionDetails,
      transmission_type: transmissionDetails,
      location_of_equipment_base_pads: other['location_of_equipment_base_pads'],
      automatic_voltage_regulator_installed: other['automatic_voltage_regulator_installed'],
      recent_ongoing_tower_works: towerWorks,
      record_tower_works: recordTowerWorks,
    }

    delete other['site_type']
    delete other['battery_bank_count']
    delete other['grid_connection_details']
    delete other['are_there_any_other_sitestowers_within_500m']
    delete other['nearby_sitestowers']
    delete other['compound_details']
    delete other['record_compound_and_fence_details']
    delete other['record_site_earthing_details']
    // delete other['site_earthing_details']
    delete other['record_transmission_type']
    delete other['record_site_ac_distribution_details']
    delete other['transfer_switch_on_site']
    delete other['transfer_switch_details']
    delete other['view_the_instructions_for_tower_leg_designation_and_recording_of_tower_and_equipment_details']
    // delete other['record_defect']
    delete other['surge_suppression_installed']
    delete other['location_of_equipment_base_pads']
    delete other['signoff_by_smart_representative']
    delete other['signoff_by_survey_contractor']
    delete other['number_of_roomsshelters']
    delete other['survey_completion_date']
    delete other['reasons_for_referral_back_to_survey_team']
    delete other['automatic_voltage_regulator_installed']
    delete other['record_tower_works']

    delete other['quality_engineer']
    delete other['quality_review_status']
    delete other['signature']
    delete other['assign_quality_engineer']

    let basepads = {}
    switch (_processedSurveyDetails['location_of_equipment_base_pads']) {
      case 'Indoor + Outdoor':
      case 'Outdoor': {
        if (other['all_outdoor_base_pads'][0]) {
          let outdoor_basepads = other['all_outdoor_base_pads'][0]
          Object.keys(outdoor_basepads).forEach(key => {
            let newKey = `basepads_` + key
            basepads[newKey] = outdoor_basepads[key]
          })
        }
        break;
      }
      case 'Indoor Only': {
        // none
        break;
      }
    }

    // if using basepads_height_abobe_ground_mm on old forms
    if (basepads['basepads_height_abobe_ground_mm']) {
      basepads['basepads_height_above_ground_mm'] = basepads['basepads_height_abobe_ground_mm']
      delete basepads['basepads_height_abobe_ground_mm']
    }

    let response = {
      formVersion,
      appVersion,
      formId,
      siteId,
      surveyDetails: {
        ..._processedSurveyDetails,
        ...basepads,
      },
      reviewDetails: _processedReviewDetails,
      structures,
      generators,
      batteries,
      rectifiers,
      shelters,
      defects,
      acu,
      other,
      tables: checkboxTables,
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
    let surveyDetails = data.surveyDetails

    Object.keys(surveyDetails).forEach(sx => {
      let siteEl = surveyDetails[sx]

      if (siteEl && siteEl.kind === 'yesNoCheckbox' && sx !== 'transmission_type') {
        surveyDetails[sx] = siteEl.checked
      }

    })


    state.data[data.siteId] = surveyDetails
  },
  'DELETE_DUPLICATE_SITE': (state, data) => {
    let newState = Object.assign({}, state)
    delete newState.data[data.siteId]
    state = newState
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
