import { createStore } from 'vuex'
import  map from './modules/map.ts'

export default createStore({
  modules: {
    map
  }
})

export type { Marker } from './modules/map.ts'
