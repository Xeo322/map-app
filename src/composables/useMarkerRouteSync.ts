import { onMounted, watch } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { WritableComputedRef } from 'vue'

export function useMarkerRouteSync(opts: {
  route: RouteLocationNormalizedLoaded
  mapReady: WritableComputedRef<boolean>
  focusOnMarkerById: (id: number) => void
}) {
  const { route, mapReady, focusOnMarkerById } = opts

  watch(() => route.params.markerId, (newMarkerId) => {
    if (newMarkerId && mapReady.value) {
      const markerId = parseInt(newMarkerId as string)
      if (!isNaN(markerId)) {
        setTimeout(() => { focusOnMarkerById(markerId) }, 100)
      }
    }
  })

  onMounted(() => {
    if (route.params.markerId && mapReady.value) {
      const markerId = parseInt(route.params.markerId as string)
      if (!isNaN(markerId)) {
        setTimeout(() => { focusOnMarkerById(markerId) }, 500)
      }
    }
  })
}
