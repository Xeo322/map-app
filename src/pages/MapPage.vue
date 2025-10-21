<script lang="ts" setup>
import { ref, watch, onMounted, computed, type ComponentPublicInstance } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import 'leaflet/dist/leaflet.css'
import { GeocodingService } from '@/services/geocoding.service'
import MapMarkerList from '@/components/map/MapMarkerList.vue'
import { useMapInteractions } from '@/composables/useMapInteractions'
import { useMarkerRouteSync } from '@/composables/useMarkerRouteSync'

type LeafletMarkerExpose = { leafletObject?: L.Marker }
type LeafletMarkerInstance = ComponentPublicInstance<LeafletMarkerExpose>

const store = useStore()
const geocodingService = new GeocodingService()
const router = useRouter()
const route = useRoute()

const zoom = computed({
  get: (): number => store.state.map.zoom,
  set: (v: number) => store.commit('map/SET_ZOOM', v)
})
const center = computed({
  get: (): [number, number] => store.state.map.center,
  set: (v: [number, number]) => store.commit('map/SET_CENTER', v)
})
const isAddingMarker = computed({
  get: (): boolean => store.state.map.isAddingMarker,
  set: (v: boolean) => store.commit('map/SET_ADD_MODE', v)
})
const markers = computed(() => store.state.map.markers as Array<{ id: number; lat: number; lng: number; address: string }>)
const mapReady = computed({
  get: (): boolean => store.state.map.mapReady,
  set: (v: boolean) => store.commit('map/SET_MAP_READY', v)
})
const activeMarkerId = computed({
  get: (): number | null => store.state.map.activeMarkerId,
  set: (v: number | null) => store.commit('map/SET_ACTIVE_MARKER_ID', v)
})

const mapInstance = ref<L.Map | null>(null)
const markerRefs = ref<Record<number, LeafletMarkerInstance | null>>({})

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
})

const {
  applyAddModeCursor,
  mapReadyHandler: mapReadyHandlerBase,
  setMarkerRef: setMarkerRefBase,
  focusOnMarker: focusOnMarkerBase,
  handleMarkerClick: handleMarkerClickBase,
  onPopupOpen: onPopupOpenBase,
  onPopupClose: onPopupCloseBase,
  focusOnMarkerById
} = useMapInteractions({
  store, router, route,
  mapInstance, zoom, center, isAddingMarker, mapReady, activeMarkerId,
  markers, markerRefs
})

const mapReadyHandler = (map: L.Map) => { mapReadyHandlerBase(map); getLocation() }
const setMarkerRef = (el: LeafletMarkerInstance | null, markerId: number) => setMarkerRefBase(el, markerId)
const focusOnMarker = (marker: { id: number; lat: number; lng: number }) => focusOnMarkerBase(marker)
const handleMarkerClick = (marker: { id: number; lat: number; lng: number }) => handleMarkerClickBase(marker)
const onPopupOpen = (marker: { id: number }) => onPopupOpenBase(marker)
const onPopupClose = () => onPopupCloseBase()

watch(isAddingMarker, () => applyAddModeCursor())
watch(mapReady, (ready) => { if (ready) applyAddModeCursor() })

const toggleAddMarkerMode = () => { store.commit('map/TOGGLE_ADD_MODE') }

const addMarker = async (event: L.LeafletMouseEvent) => {
  if (!isAddingMarker.value || !mapReady.value) return
  const { latlng } = event
  await store.dispatch('map/addMarker', { lat: latlng.lat, lng: latlng.lng, service: geocodingService })
  isAddingMarker.value = false
  activeMarkerId.value = null
}

const deleteMarker = async (id: number) => {
  if (route.params.markerId === String(id)) router.push({ name: 'map' })
  delete markerRefs.value[id]
  if (activeMarkerId.value === id) activeMarkerId.value = null
  await store.dispatch('map/removeMarker', id)
}

const getLocation = () => {
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [position.coords.latitude, position.coords.longitude]
        zoom.value = 13
      },
      () => {
        center.value = [55.7558, 37.6173]
        zoom.value = 10
      }
    )
  } else {
    center.value = [55.7558, 37.6173]
  }
}

useMarkerRouteSync({ route, mapReady, focusOnMarkerById })

onMounted(async () => {
  await store.dispatch('map/loadMarkers')
})
</script>

<template>
  <div class="map-page d-flex flex-column">
    <v-row class="ma-0 flex-grow-1" style="min-height: 0" no-gutters>
      <v-col class="list-col d-flex flex-column min-h-0 overflow-hidden" cols="12" md="4">
        <MapMarkerList
          class="flex-grow-1"
          :markers="markers"
          :active-marker-id="activeMarkerId"
          @focus="focusOnMarker"
          @delete="deleteMarker"
        />
      </v-col>
      <v-col class="map-col pa-0 position-relative d-flex flex-column min-h-0" cols="12" md="8">
        <l-map
          ref="map"
          v-model:zoom="zoom"
          v-model:center="center"
          :use-global-leaflet="false"
          class="h-100 w-100"
          @ready="mapReadyHandler"
          @click="addMarker"
        >
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" />
          <l-marker
            v-for="(marker, i) in markers"
            :key="marker.id"
            :lat-lng="[marker.lat, marker.lng]"
            :icon="defaultIcon"
            :ref="(el) => setMarkerRef(el, marker.id)"
            @click="handleMarkerClick(marker)"
            @popupopen="onPopupOpen(marker)"
            @popupclose="onPopupClose()"
          >
            <l-popup :options="{ autoPan: true, autoPanPadding: [50, 50] }">
              <div class="d-flex flex-column ga-2">
                <div class="d-flex align-center ga-2">
                  <h3 class="text-subtitle-1 font-weight-bold my-0">
                    {{ $t('pages.map.marker', { number: i + 1 }) }}
                  </h3>
                  <v-spacer />
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    density="comfortable"
                    @click.stop="deleteMarker(marker.id)"
                  />
                </div>
                <p class="font-weight-medium my-0">{{ marker.address }}</p>
                <div class="d-flex flex-column">
                  <span>{{ $t('pages.map.coordinates') }}</span>
                  <span>{{ $t('pages.map.lat', { lat: marker.lat.toFixed(6) }) }}</span>
                  <span>{{ $t('pages.map.lng', { lng: marker.lng.toFixed(6) }) }}</span>
                </div>
              </div>
            </l-popup>
          </l-marker>
        </l-map>

        <v-btn
          class="position-absolute"
          style="bottom: 16px; right: 16px; z-index: 1000;"
          :icon="isAddingMarker ? 'mdi-close' : 'mdi-plus'"
          size="large"
          @click="toggleAddMarkerMode"
          :color="isAddingMarker ? 'error' : 'primary'"
        />

        <v-snackbar
          v-model="isAddingMarker"
          location="top"
          absolute
          contained
          :offset="[2, 0]"
          :timeout="-1"
          content-class="snackbar-center"
        >
          {{ $t('pages.map.markerNotifications.notification') }}
        </v-snackbar>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.map-page { height: calc(100dvh - var(--v-layout-top, 64px)); }
.list-col, .map-col { height: 100%; min-height: 0; }
:deep(.leaflet-container) { height: 100% !important; }

:deep(.snackbar-center) {
  left: 50%;
  transform: translateX(-50%);
  max-width: min(560px, 90%);
}

@media (max-width: 960px) and (orientation: portrait) {
  .map-page > .v-row {
    display: flex !important;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }
  .map-col  { order: 1; flex: 0 0 60%; max-height: 60%; }
  .list-col { order: 2; flex: 0 0 40%; max-height: 40%; overflow: hidden; }
  .list-col > * { min-height: 0; }
}

@media (max-width: 960px) and (orientation: landscape) {
  .map-page > .v-row {
    display: flex !important;
    flex-direction: row;
    height: 100%;
    min-height: 0;
  }
  .list-col { flex: 0 0 40% !important; max-width: 40% !important; overflow: hidden; }
  .map-col  { flex: 0 0 60% !important; max-width: 60% !important; }
}
</style>
