<template>
  <Navbar />
  <div class="page-container px-5 py-3">
    <template v-if="state.loading">
      <div class="d-flex align-items-center justify-content-center" style="height: 80vh">
        <i class="fa fa-spinner fa-3x fa-spin text-primary" />
      </div>
    </template>
    <template v-else-if="!$route.params.reportId">
      <a class="back-link" @click="goHome">
        <i class="fa-solid fa-left-long me-1" /> Demo Home
      </a>

      <div class="py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h1 class="page-title"><i class="fa-solid fa-file-lines me-2 text-primary"></i>TPS Reports</h1>
          <div>
            <button class="btn btn-outline-primary"><i class="fa fa-plus-circle me-1" /> New Report</button>
          </div>
        </div>

        <template v-if="state.displayError === 'Unauthorized'">
          <div class="error-card">
            <i class="fa-solid fa-lock fa-2x mb-3"></i>
            <h5>Authentication Required</h5>
            <p>You do not have access to view the reports. Please log in.</p>
            <template v-if="userId">
              <div class="error-detail mt-3">
                <small><strong>User ID:</strong> {{ userId }}</small>
              </div>
            </template>
          </div>
        </template>

        <template v-else-if="state.displayError === 'Forbidden'">
          <div class="error-card">
            <i class="fa-solid fa-ban fa-2x mb-3"></i>
            <h5>Insufficient Permissions</h5>
            <p>You do not have sufficient access to view reports.</p>
            <template v-if="userId">
              <div class="error-detail mt-3">
                <small>
                  <strong>User ID:</strong> {{ userId }}<br>
                  <strong>Missing Permission:</strong> <code>reports:get</code><br>
                  <strong>Resource:</strong> Reports
                </small>
              </div>
            </template>
          </div>
        </template>

        <template v-else-if="!state.reports.length">
          <div class="empty-state-card">
            <i class="fa-regular fa-folder-open fa-3x mb-3 text-primary"></i>
            <h5>No Reports Available</h5>
            <p class="text-muted">You do not have access to any reports yet.</p>
          </div>
        </template>

        <template v-else>
          <div class="reports-card">
            <div v-for="(report, index) in state.reports" :key="report.reportId">
              <div class="report-item" @click="goToReport(report.reportId)">
                <div class="d-flex align-items-center">
                  <i class="fa-solid fa-file-alt fa-lg me-3 text-primary"></i>
                  <div>
                    <div class="report-name">{{ report.name }}</div>
                    <div class="report-id"><small>ID: {{ report.reportId }}</small></div>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-muted"></i>
              </div>
              <hr v-if="index < state.reports.length - 1" class="report-divider">
            </div>
          </div>
        </template>

      </div>
    </template>
    <template v-else-if="!selectedReport">
      <div class="error-card">
        <i class="fa-solid fa-triangle-exclamation fa-2x mb-3"></i>
        <h5>Report Not Found</h5>
        <p>You do not have access to report with ID: <code>{{ $route.params.reportId }}</code></p>
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

.back-link {
  color: #9ca3af;
  cursor: pointer;
  transition: color 200ms;
  &:hover { color: $primary; }
}
.page-title {
  font-weight: 700;
}
.error-card {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(26, 26, 46, 0.8) 100%);
  border: 1px solid rgba(220, 53, 69, 0.4);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  color: #f87171;
}
.error-detail {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: inline-block;
  text-align: left;
  color: #fca5a5;
}
.empty-state-card {
  background: linear-gradient(135deg, rgba(61, 74, 82, 0.4) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
}
.reports-card {
  background: linear-gradient(135deg, rgba(61, 74, 82, 0.3) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1rem;
}
.report-item {
  padding: 1rem 1.25rem;
  cursor: pointer;
  border-radius: 12px;
  transition: background-color 200ms, transform 100ms;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: rgba($primary, 0.15);
    transform: translateX(4px);
  }
}
.report-name {
  font-weight: 600;
  font-size: 1.05em;
}
.report-id {
  color: #9ca3af;
}
.report-divider {
  margin: 0 1rem;
  border-color: rgba(255, 255, 255, 0.1);
}
</style>