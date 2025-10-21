<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

type Marker = { id: number; lat: number; lng: number; address: string }

const props = defineProps<{
  markers: Marker[]
  activeMarkerId: number | null
}>()

const emit = defineEmits<{
  (e: 'focus', marker: Marker): void
  (e: 'delete', id: number): void
}>()

const { t } = useI18n()
const hasMarkers = computed(() => props.markers.length > 0)

const listRef = ref<HTMLElement | null>(null)
const itemRefs = ref<Record<number, HTMLElement | null>>({})

function setItemRef(el: HTMLElement | null, id: number) {
  if (!el) return
  itemRefs.value[id] = el
}

function scrollToActive() {
  const id = props.activeMarkerId
  const container = listRef.value
  if (!id || !container) return
  const el = itemRefs.value[id]
  if (!el) return

  const elTop = el.offsetTop
  const elBottom = elTop + el.offsetHeight
  const cTop = container.scrollTop
  const cBottom = cTop + container.clientHeight

  if (elTop < cTop) {
    container.scrollTo({ top: elTop - 8, behavior: 'smooth' })
  } else if (elBottom > cBottom) {
    container.scrollTo({ top: elBottom - container.clientHeight + 8, behavior: 'smooth' })
  }
}

watch(() => props.activeMarkerId, async () => {
  await nextTick()
  scrollToActive()
})
</script>

<template>
  <div class="d-flex flex-column h-100 pa-6">
    <div class="position-sticky top-0 py-2">
      <h3 class="text-h6 my-0">{{ t('pages.map.markers') }}</h3>
    </div>
    <div class="flex-1-1-auto d-flex flex-column" style="min-height: 0">
      <span v-if="!hasMarkers" class="text-medium-emphasis py-2">
        {{ t('pages.map.noMarkers') }}
      </span>
      <v-list
        v-else
        ref="listRef"
        class="h-100 overflow-y-auto pt-0"
        density="comfortable"
      >
        <v-divider />
        <v-list-item
          v-for="(marker, i) in markers"
          :key="marker.id"
          class="px-0"
          :class="[{ 'bg-blue-lighten-5': activeMarkerId === marker.id }]"
          @click="emit('focus', marker)"
          :ref="(el: unknown) => setItemRef(el?.$el ?? el, marker.id)"
        >
          <v-list-item-title>
            {{ t('pages.map.marker', { number: i + 1 }) }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-no-wrap">
            {{ marker.address }}
          </v-list-item-subtitle>
          <template #append>
            <v-btn
              icon="mdi-delete"
              variant="text"
              density="comfortable"
              @click.stop="emit('delete', marker.id)"
              :aria-label="t('common.delete')"
            />
          </template>
          <v-divider />
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>
