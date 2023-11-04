<script setup>
import { defineAsyncComponent } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue';

  const MapComponent = import('./components/Map.vue')

  const Map = defineAsyncComponent(() => {
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        resolve(MapComponent)
      }, 3000)
    })
  })
  
</script>


<template>
  <Suspense>
    <template #fallback class="absolute z-10">
      <LoadingScreen/>
    </template>
    <Map/>
  </Suspense>
</template>


<style>

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

</style>