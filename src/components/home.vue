<template>
  <div class="center-container">
      <div class="logo-container">
        <a :href="brand.companyWebsite" target="_blank">
          <img src="../assets/logo.svg" class="logo" :alt="brand.companyName + ' logo'" />
        </a>
      </div>

      <h1 class="hero-title">Welcome to the <span class="text-primary">{{ brand.companyName }}</span> Demo</h1>
      <p class="subtitle">Secure access management for your enterprise applications</p>

      <div class="hero-card">
        <div class="hero-card-inner">
          <i class="fa-solid fa-shield-halved hero-icon"></i>
          <p class="hero-description">
            This demo walks through adding <strong>Login</strong> and <strong>Access Control</strong> to your App using <strong class="authress-brand">Authress</strong>.
          </p>
          <button @click="start" class="btn btn-outline-primary btn-lg start-btn">
            <i class="fa-solid fa-rocket me-2"></i> Get Started
          </button>
        </div>
      </div>
      <p class="text-primary mt-3"><small><i class="fa-solid fa-arrow-up-right-from-square me-1"></i>Click on the {{ brand.companyName }} logo to learn more.</small></p>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { demoBrand as brand } from '../demo-config';

const router = useRouter();

const start = () => {
  router.push('/reports');
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/colors.scss";

.logo-container {
  margin-bottom: 1.5rem;
}
.logo {
  height: 8em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms, transform 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 1.5em rgba($primary, 0.5));
  transform: scale(1.05);
}
.hero-title {
  font-size: 2.5em;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.subtitle {
  color: #9ca3af;
  font-size: 1.1em;
  margin-bottom: 2rem;
}
.hero-card {
  background: linear-gradient(135deg, rgba(61, 74, 82, 0.6) 0%, rgba(26, 26, 46, 0.8) 100%);
  border: 1px solid rgba($primary, 0.3);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 500px;
  margin: 0 auto;
  backdrop-filter: blur(10px);
}
.hero-card-inner {
  text-align: center;
}
.hero-icon {
  font-size: 3em;
  color: $primary;
  margin-bottom: 1rem;
}
.hero-description {
  color: #e5e7eb;
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
.authress-brand {
  color: #FBAF0B;
}
.start-btn {
  padding: 0.75rem 2.5rem;
  font-size: 1.1em;
  border-radius: 12px;
  transition: transform 200ms, box-shadow 200ms;
}
.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba($primary, 0.4);
}
</style>