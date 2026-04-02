<template>
  <div class="unauthorized-container">
      <div class="unauthorized-card">
        <i class="fa-solid fa-user-lock fa-3x text-primary mb-3"></i>
        <h1 class="unauthorized-title">Access Required</h1>
        <p class="unauthorized-subtitle">You need to sign in to access this application.</p>

        <div class="d-flex justify-content-center mt-4">
          <ActivityButton class="btn btn-primary btn-lg login-btn" :action="() => login()">
            <i class="fa-solid fa-right-to-bracket me-2"></i> Sign In
          </ActivityButton>
        </div>

        <div v-if="state.errorMessage" class="error-box mt-4">
          <i class="fa-solid fa-circle-exclamation me-2"></i>
          <div>
            <div>Failed to navigate to login due to a configuration error in <code>src/authress.ts</code>.</div>
            <small class="mt-1 d-block">{{ state.errorMessage }}</small>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { authressLoginClient } from "../authressClient";
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import ActivityButton from "./activityButton.vue";
  
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

<style scoped lang="scss">
@import "../assets/styles/colors.scss";

.unauthorized-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
}
.unauthorized-card {
  background: linear-gradient(135deg, rgba(61, 74, 82, 0.4) 0%, rgba(26, 26, 46, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 460px;
  width: 100%;
}
.unauthorized-title {
  font-weight: 700;
  font-size: 2em;
  margin-bottom: 0.25rem;
}
.unauthorized-subtitle {
  color: #9ca3af;
  font-size: 1.05em;
}
.login-btn {
  padding: 0.75rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1em;
  transition: transform 200ms, box-shadow 200ms;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba($primary, 0.4);
  }
}
.error-box {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 10px;
  padding: 1rem;
  color: #f87171;
  display: flex;
  align-items: flex-start;
  text-align: left;
}
</style>