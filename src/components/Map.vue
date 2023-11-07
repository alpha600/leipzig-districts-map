<template>
  <div>
    <h1 class="absolute text-4xl text-white top-4 right-12 z-[500]">{{ activeDistrict }}</h1>
    <h2 class="absolute text-4xl text-white top-16 right-12 z-[500]">{{ activeLayer ? activeLayer.feature.properties.Name : '' }}</h2>
    <h2 class="absolute text-4xl text-white top-28 right-12 z-[500]">{{ activeIncome }}</h2>
    <div class="absolute top-0 left-44 z-[500]">
      <Select
        :options="topics.length ? topics : null"
        @set-topic="handleSetTopic"
      />
      <div class="mt-8 text-xl text-white">
        {{ activeTopic }}
      </div>
    </div>
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
import { ref,onMounted,computed } from 'vue'
import { useFetch } from '@vueuse/core'
import LoadingScreen from "./LoadingScreen.vue";
import Select from "./Select.vue";

const pathToGeoJson = './data/merged/districts-07-11-23-11-51-35.geo.json'
const isLoading = ref(true)
const key = API_KEY;

const map = ref({})
const zoom = ref(12)
const startLatLng = ref([51.34390975335249,12.376785278320312])

const activeDistrict = ref('')
const topics = ref([])
let activeLayer = null
const geoJson = ref({})
const features = ref([])
const activeTopic = ref('')




async function setupMap(map) {
  const { data } = await useFetch(pathToGeoJson).get().json()
  geoJson.value = data.value
  features.value = geoJson.value.features

  topics.value = Object.keys(features.value[0].properties.data)
    .filter(prop => prop !== 'id' && prop !== 'name')
    .map(prop => (features.value[0].properties.data[prop]))
  
  const mtLayer = L.maptilerLayer({
    apiKey: key,
    style: "basic-v2-dark",
  }).addTo(map);
  
  L.geoJSON(geoJson.value, {
    style: setInitialFeatureStyle,
    onEachFeature: onEachFeature
  }).addTo(map)
  
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}

function handleSetTopic(topicKey) {
  activeTopic.value = topicKey
  
  generateDataIntervals()

  map.value.eachLayer((l) => {
    if (l.setStyle && l.feature) {
      l.setStyle({
        fillColor: setFeatureStyle(l.feature),
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
        opacity: 0.3,
      })
    }
  })
  
  layer.setStyle({
    color: 'white',
    opacity: 1
  })
}

function highlightLayer(event) {
  const layer = event.target
  activeDistrict.value = layer.feature.properties.Name
  
  // other logic
  
  if (layer === activeLayer) return
  
  layer.setStyle({
    color: 'white',
    opacity: 1,
  })
}

function resetHighlightLayer(event) {
  const layer = event.target
  if (activeLayer && layer === activeLayer) return
  
  layer.setStyle({
    // fillColor: 'transparent',
    opacity: 0.5,
  })
}

function setInitialFeatureStyle(feature) {
  return {
    fillColor: 'transparent',
    color: 'white',
    opacity: 0.3,
    weight: 1
    // fillColor: 'transparent',
    // color: 'transparent',
  }
}

function setFeatureStyle(feature) {
  return (feature.properties.data[activeTopic.value].meta._color_start)
}

function generateDataIntervals() {
  const values = features.value.map(feature => parseFloat(feature.properties.data[activeTopic.value].value))
  const min = Math.min(...values)
  const max = Math.max(...values)

  const stream = new geostats(values)
  // stream.getClassJenks(6)
  // stream.getClassQuantile(6)
  stream.getClassEqInterval(6)
  const ranges = stream.getRanges()

  console.log(values,min,max);
  console.log(ranges);
}

function getColor(activeTopic) {
  console.log(activeTopic);

    if (activeTopic === 'crimes') return 'red'
    if (activeTopic === 'schools') return 'blue'

    return 'gray'
  // return feature.properties.income.value > 3000 ? '#004b54' :
  //        feature.properties.income.value > 2900 && feature.properties.income.value <= 3000 ? '#00585b' :
  //        feature.properties.income.value > 2800 && feature.properties.income.value <= 2900 ? '#0c6560' :
  //        feature.properties.income.value > 2700 && feature.properties.income.value <= 2800 ? '#217262' :
  //        feature.properties.income.value > 2600 && feature.properties.income.value <= 2700 ? '#367e62' :
  //        feature.properties.income.value > 2500 && feature.properties.income.value <= 2600 ? '#4d8a61' :
  //        feature.properties.income.value > 2400 && feature.properties.income.value <= 2500 ? '#65965f' :
  //        feature.properties.income.value > 2300 && feature.properties.income.value <= 2400 ? '#80a05d' :
  //        feature.properties.income.value > 2200 && feature.properties.income.value <= 2300 ? '#9caa5c' :
  //        feature.properties.income.value > 2100 && feature.properties.income.value <= 2200 ? '#bab35e' :
  //        feature.properties.income.value > 2000 && feature.properties.income.value <= 2100 ? '#daba64' :
  //        '#fac06e'

}

onMounted(() => {
  map.value = L.map('map').setView(startLatLng.value, zoom.value);
  setupMap(map.value)
  
  // map.on({
  //   click: setCenter,
  // })

})

</script>
