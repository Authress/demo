<template>
  <div>
    <a class="back-link" @click="goBackToList">
      <i class="fa-solid fa-left-long me-1" /> Back To TPS Reports
    </a>

    <div class="py-4">
      <h1 class="page-title"><i class="fa-solid fa-scroll me-2 text-primary"></i> Report {{ $route.params.reportId }}</h1>

      <div class="report-detail-card">
        <div class="detail-header mb-4">
          <div>
            <label class="detail-label">Report Name</label>
            <div class="detail-value">{{ props.report.name }}</div>
          </div>
          <div class="d-flex align-items-center status-badge" :class="props.report.status">
            <i class="fa fa-bars-progress fa-lg me-2" />
            <span>{{ props.report.status }}</span>
          </div>
        </div>
        <hr class="detail-divider">
        <div class="my-4">
          <label class="detail-label">Report ID</label>
          <div class="detail-value"><code>{{ props.report.reportId }}</code></div>
        </div>
        <hr class="detail-divider">
        <div class="my-4">
          <label class="detail-label">Report Content</label>
          <div class="report-content-box" v-html="props.report.text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps(['report'])


const router = useRouter();

const goBackToList = () => {
  router.push('/reports');
};
  

</script>

<style scoped lang="scss">
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
.report-detail-card {
  background: linear-gradient(135deg, rgba(61, 74, 82, 0.3) 0%, rgba(26, 26, 46, 0.6) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.detail-label {
  color: #9ca3af;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  display: block;
}
.detail-value {
  font-size: 1.1em;
  font-weight: 500;
}
.detail-divider {
  border-color: rgba(255, 255, 255, 0.1);
}
.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9em;
  text-transform: uppercase;
}
.status-badge.FAILED {
  color: #f87171;
  background: rgba(220, 53, 69, 0.15);
}
.status-badge.IN_PROGRESS {
  color: #60a5fa;
  background: rgba(59, 130, 246, 0.15);
}
.status-badge.COMPLETED {
  color: #4ade80;
  background: rgba(34, 197, 94, 0.15);
}
.report-content-box {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1.25rem;
  line-height: 1.6;
  color: #e5e7eb;
  white-space: pre-wrap;
}
</style>