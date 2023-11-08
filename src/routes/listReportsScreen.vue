<template>
  <Navbar />
  <div class="px-5 py-3">
    <template v-if="!selectedReport">
      <a class="link-horizon" style="margin-right 1rem" @click="goHome">
        <i class="fa-solid fa-left-long" /> Demo Home
      </a>
      
      <div class="py-4">
        <h1>TPS Reports</h1>

        <div style="border: 1px white solid; border-radius: 10px; padding: 2rem;">
          <h5 class="mb-2">Here are your reports:</h5>

          <div v-for="report in state.reports" :key="report.reportId">
            <div class="hover-select" @click="goToReport(report.reportId)">
              <div>Report: {{ report.name }}</div>
              <div>ID: {{  report.reportId }}</div>
            </div>
            <hr>
          </div>
        </div>
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

const route = useRoute();

interface State {
  reports: Array<Report>;
};

const state = reactive<State>({ reports: [] });

const selectedReport = computed(() => {
  return state.reports.find(r => r.reportId === route.params.reportId);
});

reportsService.getReports().then(reports => {
  state.reports = reports;
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