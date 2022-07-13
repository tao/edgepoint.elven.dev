import { createStore, createLogger } from 'vuex'
import dropzone from './dropzone'
import defects from './defects'
import batteries from './batteries'
import generators from './generators'
import structures from './structures'
import submissions from './submissions'
import rectifiers from './rectifiers'
import acu from './acu'
import sites from './sites'
import files from './files'
import tables from './tables'
import warnings from './warnings'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    dropzone,
    defects,
    batteries,
    generators,
    structures,
    submissions,
    rectifiers,
    sites,
    files,
    acu,
    tables,
    warnings,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})
