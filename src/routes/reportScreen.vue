<template>
  <Navbar />
  <div class="px-5 py-3">
    <a class="link-horizon" style="margin-right 1rem" @click="goBackToList">
      <i class="fa-solid fa-left-long" /> Back To TPS Reports
    </a>
    
    <div class="py-4">
      <h1>Report {{ $route.params.reportId }}</h1>

      <div style="border: 1px white solid; border-radius: 10px; padding: 2rem;">
        <div>Report display page</div>

        <br>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Navbar from './navbar.vue';

const router = useRouter();

const goBackToList = () => {
  router.push('/reports');
};
  

</script>

<style scoped lang="scss">
@import "../styles/colors.scss";

</style>