<template>
  <Navbar />
  <div class="page-container px-5 py-3">
    <template v-if="state.loading">
      <div class="d-flex align-items-center justify-content-center" style="height: 80vh">
        <i class="fa fa-spinner fa-3x fa-spin" />
      </div>
    </template>
    <template v-else-if="!$route.params.reportId">
      <a class="link-horizon" style="margin-right 1rem" @click="goHome">
        <i class="fa-solid fa-left-long" /> Demo Home
      </a>
      
      <div class="py-4">
        <div class="d-flex justify-content-between">
          <h1>TPS Reports</h1>
          <div>
            <button class="btn btn-outline-info"><i class="fa fa-plus-circle" /> Report</button>
          </div>
        </div>

        <template v-if="state.displayError === 'Unauthorized'">
          <div style="border: 1px var(--bs-danger) solid; border-radius: 10px; padding: 2rem; color: var(--bs-danger)">
            You do not have access to view the reports, please log in.
            <br>
            <template v-if="userId">
              <br>
              User ID: {{ userId }}
            </template>
          </div>
        </template>

        <template v-else-if="state.displayError === 'Forbidden'">
          <div style="border: 1px var(--bs-danger) solid; border-radius: 10px; padding: 2rem; color: var(--bs-danger)">
            You do not have sufficient access to view reports.
            <br>
            <template v-if="userId">
              <br>
              User ID: {{ userId }}
              <br>
              Missing Permission: <strong>reports:get</strong>
              <br>
              Resource: <strong>Reports</strong>
            </template>
          </div>
        </template>

        <template v-else-if="!state.reports.length">
          <div style="border: 1px white solid; border-radius: 10px; padding: 2rem;">
            <h5 class="mb-2 text-info">You do not have access to any reports yet.</h5>
          </div>
        </template>

        <template v-else>
          <div style="border: 1px white solid; border-radius: 10px; padding: 2rem;">
            <div v-for="report in state.reports" :key="report.reportId">
              <div class="hover-select" @click="goToReport(report.reportId)">
                <div>{{ report.name }}</div>
                <div>ID: {{  report.reportId }}</div>
              </div>
              <hr>
            </div>
          </div>
        </template>

      </div>
    </template>
    <template v-else-if="!selectedReport">
      <div style="border: 1px var(--bs-danger) solid; border-radius: 10px; padding: 2rem; color: var(--bs-danger)">
        You do not have access to report with ID: {{ $route.params.reportId }}
      </div>
    </template>
    <report-screen v-else :report="selectedReport" />
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { reactive, computed } from 'vue';
import Navbar from '../components/navbar.vue';
import reportScreen from './reportScreen.vue';
import reportsService, { Report } from './reportsService';
import { authressLoginClient } from '../authressClient';

const route = useRoute();

interface State {
  reports: Array<Report>;
  displayError: String;
  loading: boolean;
};

const state = reactive<State>({ loading: true, reports: [], displayError: '' });

const selectedReport = computed(() => {
  const foundReport = state.reports.find(r => r.reportId === route.params.reportId);
  return foundReport;
});

const userId = computed(() => {
  const userIdentity = authressLoginClient.getUserIdentity();
  return userIdentity?.sub;
});

reportsService.getReports().then(reports => {
  state.reports = reports;
  state.loading = false;
}).catch(error => {
  state.displayError = error.message;
  state.loading = false;
});


const router = useRouter();
const goHome = () => {
  router.push('/');
};
const goToReport = (reportId: string): void => {
  router.push(`/reports/${reportId}`);
};
  

</script>

<style scoped lang="scss">
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "../assets/styles/colors.scss";

.hover-select {
  padding: 1rem;
  cursor: pointer;
}
  .hover-select:hover {
    background-color: $primary;
    border-radius: 10px;
  }
</style>