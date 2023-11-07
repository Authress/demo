<template>
  <div class="App">      
      <h1>Authress Unauthorized Page</h1>

      <div style="border: 1px white solid; border-radius: 10px; padding: 2rem;">
        <div>This page is displayed when a user attempts to navigate a protected page and they are not logged in. When this happens, it makes sense to automatically redirect them to the login page.</div>

        <br>
        <button style="margin-right 1rem" @click="login">
          Login
        </button>

        <div v-if="state.errorMessage" style="color: #dc3545">
          <br>
          <div>Failed to navigate to log due to an error with your configuration in the <code>src/authress.ts</code> file.</div>
          {{ state.errorMessage }}
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { authressLoginClient } from "../authressClient";
import { reactive } from 'vue';

const state = reactive({ errorMessage: '' });


const login = async () => {
  console.log('User logging in');
  try {
    state.errorMessage = '';
    await authressLoginClient.authenticate({});
  } catch (error: any) {
    state.errorMessage = error.message;
  }
};

</script>