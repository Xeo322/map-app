<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const languageOptions = [
  { value: 'ru' },
  { value: 'en' }
]
</script>

<template>
  <v-layout>
    <v-app-bar
      app
      flat
      theme="dark"
      :height="56"
      :extended="true"
      :extension-height="40"
      density="comfortable"
    >
      <template #prepend>
        <v-toolbar-title class="text-h6 text-md-h6">
          {{ t('nav.title') }}
        </v-toolbar-title>
      </template>
      <v-spacer />
      <template #append>
        <v-menu location="bottom end" offset="8">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="white"
            >
              <v-icon size="20">mdi-earth</v-icon>
            </v-btn>
          </template>
          <v-list density="comfortable">
            <v-list-item
              v-for="item in languageOptions"
              :key="item.value"
              @click="locale = item.value"
            >
              <v-list-item-title>{{ t('nav.languages.' + item.value) }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template #extension>
        <v-tabs
          bg-color="transparent"
          color="white"
          slider-color="white"
          density="compact"
        >
          <v-tab
            :to="{ name: 'task' }"
            rounded="lg"
            size="small"
            class="text-uppercase font-weight-bold mr-2"
          >
            {{ t('nav.task') }}
          </v-tab>
          <v-tab
            :to="{ name: 'map' }"
            rounded="lg"
            size="small"
            class="text-uppercase font-weight-bold"
          >
            {{ t('nav.map') }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>
