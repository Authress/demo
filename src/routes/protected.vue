<template>
  <div class="App">      
      <h1>Authress Protected Page</h1>

      <div style="border: 1px white solid; border-radius: 10px; padding: 2rem;">
        <div>This page is protected with a route guard. The route guard checks for a valid user session before allowing the user to enter it. If the user has a valid session they will enter. Without a valid session the guard will redirect the user to log in with their selected provider.</div>

        <br>
        <button style="margin-right 1rem" @click="goHome">
          Back To Home
        </button>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
  

</script>