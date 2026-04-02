<template>
  <nav id="navbar" class="navbar navbar-expand-lg navbar-light bg-secondary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="../assets/logo.svg" class="navbar-logo" alt="Logo" height="36" />
      </a>
      <div class="" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        </ul>
        <form v-if="!state.userIdentity" class="d-flex">
          <ActivityButton class="btn btn-primary" type="button" :action="() => login()">Login</ActivityButton>
        </form>

        <template v-else class="btn btn-outline-primary" type="submit">
          <ul class="nav nav-tabs" style="border: none !important;">
            <li class="nav-item dropdown" style="border: none !important; ">
              <a class="nav-link text-primary" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">
                <i v-if="!state.userIdentity.picture" class="fa fa-user-circle fa-2x" />
                <img v-else :src="state.userIdentity.picture" referrerpolicy="no-referrer" style="border-radius: 100%; width: 40px">
              </a>
              <ul class="dropdown-menu" style="width: 250px; overflow: hidden" @click.prevent="() => {}">
                <li><span class="dropdown-item text-secondary">{{ state.userIdentity.name }}</span></li>
                <li><small class="dropdown-item text-secondary" @click="copySub()">{{ state.userIdentity.sub }}</small></li>
                <li><hr class="dropdown-divider text-dark"></li>
                <li><a class="dropdown-item text-dark" @click.prevent="logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useClipboard } from '@vueuse/core'

import { starterKitIsConfiguredCorrectly, authressLoginClient } from '../authressClient';
import ActivityButton from './activityButton.vue';

const copyTarget = ref('copyTarget');
const { text, copy, copied, isSupported } = useClipboard({ copyTarget });

const copySub = () => {
  copy(state.userIdentity.sub);
};

interface State {
  userIdentity: any
};

const state = reactive<State>({ userIdentity: null });

const login = async () => {
  console.log('User logging in');
  await authressLoginClient.authenticate({});
};

const logout = async () => {
  console.log('User logging out');
  await authressLoginClient.logout(new URL(window.location.href).origin);
  state.userIdentity = null;
};

if (starterKitIsConfiguredCorrectly) {
  authressLoginClient.userSessionExists().then((userIsLoggedIn: any) => {
    state.userIdentity = authressLoginClient.getUserIdentity();
    console.log('User is Logged In', userIsLoggedIn, state.userIdentity);
  });
}

</script>

<style lang="scss">
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "../assets/styles/colors.scss";

  .navbar-logo {
    height: 36px;
  }
  .dropdown-menu.show {
    left: -183px;
    a:hover {
      background-color: $primary;
    }
  }
</style>