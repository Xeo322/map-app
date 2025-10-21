import type { Ref, ComponentPublicInstance } from 'vue'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { Store } from 'vuex'
import L from 'leaflet'

type LeafletMarkerExpose = { leafletObject?: L.Marker }
type LeafletMarkerInstance = ComponentPublicInstance<LeafletMarkerExpose>

export function useMapInteractions(args: {
  store: Store<any>
  router: Router
  route: RouteLocationNormalizedLoaded
  mapInstance: Ref<L.Map | null>
  zoom: Ref<number>
  center: Ref<[number, number]>
  isAddingMarker: Ref<boolean>
  mapReady: Ref<boolean>
  activeMarkerId: Ref<number | null>
  markers: Ref<Array<{ id: number; lat: number; lng: number; address: string }>>
  markerRefs: Ref<Record<number, LeafletMarkerInstance | null>>
}) {
  const {
    router, route, mapInstance, zoom, center, isAddingMarker, mapReady, activeMarkerId,
    markers, markerRefs
  } = args

  const applyAddModeCursor = () => {
    const map = mapInstance.value
    if (!map) return
    map.getContainer().style.cursor = isAddingMarker.value ? 'crosshair' : ''
  }

  const mapReadyHandler = (map: L.Map) => {
    mapInstance.value = map
    mapReady.value = true
    applyAddModeCursor()
  }

  const setMarkerRef = (el: LeafletMarkerInstance | null, id: number) => {
    if (el) args.markerRefs.value[id] = el
    else delete args.markerRefs.value[id]
  }

  const focusOnMarker = (marker: { id: number; lat: number; lng: number }) => {
    const map = mapInstance.value
    if (!map) return

    const targetZoom = zoom.value < 15 ? 15 : zoom.value
    const refEl = markerRefs.value[marker.id]
    if (route.params.markerId !== String(marker.id)) {
      router.push(`/map/${marker.id}`)
    }
    activeMarkerId.value = marker.id

    const targetLatLng = L.latLng(marker.lat, marker.lng)
    const currentCenter = map.getCenter()
    const currentZoom = map.getZoom()
    const near = currentCenter.distanceTo(targetLatLng) < 1 && currentZoom >= targetZoom

    if (near) {
      center.value = [marker.lat, marker.lng]
      refEl?.leafletObject?.openPopup()
      return
    }

    map.flyTo(targetLatLng, targetZoom, { animate: true, duration: 0.6, easeLinearity: 0.25 })
    map.once('moveend', () => {
      center.value = [marker.lat, marker.lng]
      refEl?.leafletObject?.openPopup()
    })
  }

  const handleMarkerClick = (marker: { id: number; lat: number; lng: number }) => {
    if (route.params.markerId !== String(marker.id)) {
      router.push(`/map/${marker.id}`)
    }
  }

  const onPopupOpen = (marker: { id: number }) => {
    activeMarkerId.value = marker.id
  }
  const onPopupClose = () => {
    activeMarkerId.value = null
  }

  const focusOnMarkerById = (markerId: number) => {
    const marker = markers.value.find(m => m.id === markerId)
    if (marker) focusOnMarker(marker)
  }

  return {
    applyAddModeCursor,
    mapReadyHandler,
    setMarkerRef,
    focusOnMarker,
    handleMarkerClick,
    onPopupOpen,
    onPopupClose,
    focusOnMarkerById,
  }
}
