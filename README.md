# map-app

A small test application built for **SquareGPS**.  
The app is written with **Vue 3**, **Vue Router**, **Vuex**, **Vuetify 3**, and **Leaflet** via **@vue-leaflet/vue-leaflet** for fast map integration. Total build time: ~2 days.

## Tech Stack

- **Vue 3 (Vite)**
- **Vuex 4** — centralized state for map state and markers
- **Vue Router 4** — routes `/task` and `/map` (marker id synced in URL)
- **Vuetify 3** — UI components and responsive layout
- **Leaflet + @vue-leaflet/vue-leaflet** — map & markers
- **vue-i18n** — localization (RU/EN)

## Features

- **Two sections**: “About” (the spec text) and **Map**
- **Add marker mode**: click the “+” button, then tap on the map to add
- **Reverse geocoding** using `geocode.maps.co` (free API)
- **Local persistence**: markers are saved in `localStorage` via a pseudo-async `BackendService`
- **URL sync**: active marker id is reflected in the address bar (`/map/:markerId`)
- **Clickable list ↔ map**: focusing a list item centers/open popup on the map; clicking a marker highlights the list
- **Deletion**: remove markers from the list and from popup
- **Mobile layout**:
  - Portrait: **Map 60%** (top) / **List 40%** (bottom)
  - Landscape/desktop: list left, map right
- **Quality of life**:
  - Sticky list header, internal list scroll
  - Snackbar hint when add mode is active

## Project Setup

> Node version per `engines`:
> ```
> ^20.19.0 || >=22.12.0
> ```

Install:

```sh
npm install
# or
yarn
