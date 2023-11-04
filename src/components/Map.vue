<template>
  <div>
    <h1 class="absolute text-4xl text-white top-12 right-12 z-[500]">{{ activeDistrict }}</h1>
    <h1 class="absolute text-4xl text-white top-24 right-12 z-[500]">{{ activeLayer ? activeLayer.feature.properties.Name : '' }}</h1>
    <div 
      id="map"
      class="w-full min-h-screen"
    ></div>
    <Transition name="fade">
      <LoadingScreen
        v-if="isLoading"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useFetch } from '@vueuse/core'
import LoadingScreen from "./LoadingScreen.vue";

const url = '../../db.json'
const isLoading = ref(true)
const key = API_KEY;
const zoom = ref(12)
const startLatLng = ref([51.34390975335249,12.376785278320312])
const activeDistrict = ref('')

let activeLayer = null
let isHovered = false

async function setupMap(map) {
  const { data } = await useFetch(url).get().json()
  const geoJsonData = data.value.geojson[0]

  const mtLayer = L.maptilerLayer({
    apiKey: key,
    style: "basic-v2-dark",
  }).addTo(map);
  
  L.geoJSON(geoJsonData, {
    style: setStyle,
    onEachFeature: onEachFeature
  }).addTo(map)
  
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

function setCenter(event) {
  const map = event.target
  const { latlng } = event
  map.panTo(latlng)

  map.eachLayer((l) => {
    if (activeLayer && l !== activeLayer && l.setStyle && l.feature) {
      l.setStyle({
        fillColor: 'transparent',
      })
    }
  })
}

function onEachFeature(feature,layer) {
  layer.on({
    click: setActiveLayer,
    mouseover: highlightLayer,
    mouseout: resetHighlightLayer,
  })
}

function setActiveLayer(event) {
  const map = event.target._map
  const layer = event.target
  const { latlng } = event
  activeLayer = layer
  
  map.panTo(latlng)

  map.eachLayer((l) => {
    if (activeLayer && l !== activeLayer && l.setStyle && l.feature) {
      l.setStyle({
        fillColor: 'transparent',
      })
    }
  })

  layer.setStyle({
    fillColor: 'white',
    fillOpacity: 0.3
  })
}

function highlightLayer(event) {
  const layer = event.target
  activeDistrict.value = layer.feature.properties.Name
  
  // other logic
  
  if (layer === activeLayer) return
  
  layer.setStyle({
    fillColor: 'white',
    fillOpacity: 0.1
  })
}

function resetHighlightLayer(event) {
  const layer = event.target
  
  if (activeLayer && layer === activeLayer) return
  
  layer.setStyle({
    fillColor: 'transparent',
  })

  
}

function setStyle(feature) {
  return {
    fillColor: 'transparent',
    color: 'white',
    weight: 1
  }
}

onMounted(() => {
  const map = L.map('map').setView(startLatLng.value, zoom.value);
  
  setupMap(map)
  
  // map.on({
  //   click: setCenter,
  // })

})

</script>
