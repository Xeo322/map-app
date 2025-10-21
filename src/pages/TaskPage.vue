<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <v-container fluid class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <section class="text-body-1">
          <h1 class="text-h4 text-md-h3 font-weight-bold mb-4">
            {{ t('pages.taskPage.title') }}
          </h1>

          <i18n-t keypath="pages.taskPage.intro" tag="p" class="mb-6">
            <strong>{{ t('tech.vue') }}</strong>
            <strong>{{ t('tech.vuex') }}</strong>
            <strong>{{ t('tech.vueRouter') }}</strong>
            <strong>{{ t('tech.vuetify') }}</strong>
            <strong>{{ t('nav.task') }}</strong>
            <strong>{{ t('nav.map') }}</strong>
          </i18n-t>

          <v-divider class="mb-6" />

          <h2 class="text-h5 text-md-h4 font-weight-medium mb-3">
            {{ t('pages.taskPage.section.about') }}
          </h2>
          <p class="mb-8">
            {{ t('pages.taskPage.aboutText') }}
          </p>

          <h2 class="text-h5 text-md-h4 font-weight-medium mb-3">
            {{ t('pages.taskPage.section.map') }}
          </h2>
          <p class="mb-4">
            {{ t('pages.taskPage.mapIntro') }}
          </p>

          <v-list density="comfortable" class="pl-1">
            <v-list-item>
              <p class="mb-0">
                {{ t('pages.taskPage.items.1.main') }}
              </p>
              <v-list class="mt-2 ml-6" density="comfortable">
                <v-list-item>
                  <i18n-t keypath="pages.taskPage.items.1.a" tag="p" class="mb-0">
                    <a href="https://geocode.maps.co/" target="_blank" rel="noopener">https://geocode.maps.co/</a>
                  </i18n-t>
                </v-list-item>
                <v-list-item>
                  <p class="mb-0">
                    {{ t('pages.taskPage.items.1.b') }}
                  </p>
                </v-list-item>
              </v-list>
            </v-list-item>

            <v-list-item><p class="mb-0">{{ t('pages.taskPage.items.2') }}</p></v-list-item>
            <v-list-item><p class="mb-0">{{ t('pages.taskPage.items.3') }}</p></v-list-item>
            <v-list-item><p class="mb-0">{{ t('pages.taskPage.items.4') }}</p></v-list-item>
            <v-list-item><p class="mb-0">{{ t('pages.taskPage.items.5') }}</p></v-list-item>
          </v-list>

          <i18n-t keypath="pages.taskPage.storageNote" tag="p" class="mt-6 mb-0">
            <code>localStorage</code>
          </i18n-t>

          <h3 class="text-h6 text-md-h5 font-weight-medium mt-8 mb-2">
            {{ t('pages.taskPage.extra.title') }}
          </h3>
          <v-list density="comfortable" class="pl-1">
            <v-list-item><p class="mb-0">{{ t('pages.taskPage.extra.1') }}</p></v-list-item>
            <v-list-item><p class="mb-0">{{ t('pages.taskPage.extra.2') }}</p></v-list-item>
            <v-list-item>
              <i18n-t keypath="pages.taskPage.extra.3" tag="p" class="mb-0">
                <code>jest</code>
              </i18n-t>
            </v-list-item>
          </v-list>
        </section>
      </v-col>
    </v-row>
  </v-container>
</template>
