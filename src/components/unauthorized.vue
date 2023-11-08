<template>
  <div class="px-5 py-3">
      <h1>Authress Unauthorized Page</h1>

      <div style="border: 1px white solid; border-radius: 10px; padding: 2rem;">
        <div>Please log in.</div>

        <br>
        <div class="d-flex justify-content-center">
          <button style="margin-right 1rem" class="btn btn-primary" @click="login">
            Login
          </button>
        </div>

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
import { useRouter } from 'vue-router';
  
const router = useRouter();

const state = reactive({ errorMessage: '' });

const login = async () => {
  console.log('User logging in');
  try {
    state.errorMessage = '';
    await authressLoginClient.authenticate({
      redirectUrl: `${window.location.origin}/#/reports`
    });
  } catch (error: any) {
    state.errorMessage = error.message;
  }
};

authressLoginClient.userSessionExists().then(userIsLoggedIn => {
  if (userIsLoggedIn) {
    console.log('User is already logged in, redirect them to home.');
    router.push('/');
  }
});
</script>