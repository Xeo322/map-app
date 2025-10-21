import { backendService } from '@/services/backend.service'

export type Marker = { id: string; lat: number; lng: number; address: string }

export interface MapState {
  zoom: number
  center: [number, number]
  isAddingMarker: boolean
  markers: Marker[]
  mapReady: boolean
  activeMarkerId: number | null
}

const state = (): MapState => ({
  zoom: 2,
  center: [0, 0],
  isAddingMarker: false,
  markers: [],
  mapReady: false,
  activeMarkerId: null
})

const mutations = {
  SET_ZOOM(state: MapState, v: number) { state.zoom = v },
  SET_CENTER(state: MapState, v: [number, number]) { state.center = v },
  SET_ADD_MODE(state: MapState, v: boolean) { state.isAddingMarker = v },
  TOGGLE_ADD_MODE(state: MapState) { state.isAddingMarker = !state.isAddingMarker },
  SET_MARKERS(state: MapState, v: Marker[]) { state.markers = v },
  ADD_MARKER(state: MapState, m: Marker) { state.markers.push(m) },
  UPDATE_MARKER_ADDRESS(state: MapState, p: { id: number; address: string }) {
    const i = state.markers.findIndex(m => m.id === p.id)
    if (i !== -1) state.markers[i].address = p.address
  },
  REMOVE_MARKER(state: MapState, id: number) {
    state.markers = state.markers.filter(m => m.id !== id)
    if (state.activeMarkerId === id) state.activeMarkerId = null
  },
  SET_MAP_READY(state: MapState, v: boolean) { state.mapReady = v },
  SET_ACTIVE_MARKER_ID(state: MapState, v: number | null) { state.activeMarkerId = v },
}

const actions = {
  async loadMarkers({ commit }: unknown) {
    const markers = await backendService.getMarkers()
    commit('SET_MARKERS', markers)
  },

  async addMarker(
    { commit, state }: any,
    p: { lat: number; lng: number; service: { getAddress: (c: { lat: number; lng: number }) => Promise<string> } }
  ) {
    const m: Marker = { id: crypto.randomUUID(), lat: p.lat, lng: p.lng, address: 'Loading address...' }
    commit('ADD_MARKER', m)
    await backendService.saveMarkers(state.markers)

    try {
      const address = await p.service.getAddress({ lat: p.lat, lng: p.lng })
      commit('UPDATE_MARKER_ADDRESS', { id: m.id, address })
    } catch {
      commit('UPDATE_MARKER_ADDRESS', { id: m.id, address: 'Address not found' })
    } finally {
      await backendService.saveMarkers(state.markers)
    }
  },

  async removeMarker({ commit, state }: unknown, id: number) {
    commit('REMOVE_MARKER', id)
    await backendService.saveMarkers(state.markers)
  }
}

const map = {
  namespaced: true,
  state,
  mutations,
  actions
}

export default map
