<template>
  <div class="center-container">
      <div>
        <a href="https://authress.io" target="_blank">
          <img src="../assets/logo.svg" class="logo" alt="Authress logo" />
        </a>
      </div>
      
      <h1 class="">Welcome to the Authress Demo</h1>

      <div style="border: 1px white solid; border-radius: 10px; padding: 2rem;">
        <div>
          <div style="color: white">
            This demo walks through adding Login and Access Control to your App.
            <br /><br />
            <button style="margin-right: 1rem;" @click="start" class="btn btn-primary">
              Start
            </button>
            
          </div>
        </div>
      </div>
      <p class="text-primary">Click on the Authress logo to learn more</p>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
  
const router = useRouter();

const start = () => {
  router.push('/reports');
}
</script>

<style lang="scss" scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 1em white);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 1em white);
}
</style>