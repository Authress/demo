<template>
  <div>
    <a class="link-horizon" style="margin-right 1rem" @click="goBackToList">
      <i class="fa-solid fa-left-long" /> Back To TPS Reports
    </a>
    
    <div class="py-4">
      <h1><i class="fa-solid fa-scroll"></i> Report {{ $route.params.reportId }}</h1>

      <div style="border: 1px white solid; border-radius: 10px; padding: 2rem;">
        <div class="mb-4 d-flex justify-content-between">
          <div><h5>Report Name:</h5><span>{{ props.report.name }}</span></div>
          <div class="d-flex align-items-center"><span>Status:</span> <i class="ms-2 fa fa-bars-progress fa-2x" :class="props.report.status" /> </div>
        </div>
        <div class="my-4">
          <h5>Report ID:</h5><span>{{ props.report.reportId }}</span>
        </div>
        <div class="my-4">
          <h5>Report:</h5><span>{{ props.report.text }}</span>
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

.FAILED {
  color: red;
}

.IN_PROGRESS {
  color: blue;
}

.COMPLETED {
  color: green;
}

</style>