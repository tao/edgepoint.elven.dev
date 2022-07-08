const getDefaultState = () => ({
  data: [],
  incoming: '',
  isUploading: false,
})

// initial state
const state = () => getDefaultState()

// getters
const getters = {
  getProcessedFiles: (state) => {
    return state.data
  },
  getIncomingFile: (state) => {
    return state.incoming
  },
  isUploading: (state) => {
    return state.isUploading
  }
}

// actions
const actions = {}

// mutations
const mutations = {
  'FILE_LOADED': (state, data) => {
    state.data.push(state.incoming)
    state.incoming = ''
  },
  'FILE_PROCESSING': (state, data) => {
    state.incoming = data
    state.isUploading = true
  },
  'FINISHED': (state, data) => {
    state.isUploading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
