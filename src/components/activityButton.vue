<template>
  <button @click="onClick" :tabindex="tabindex" :disabled="innerDisabled">
    <div ref="button" v-if="!state.inProgress">
        <slot v-if="!state.completed" />
        <div v-else :style="{ 'width': computedWidth, 'height': computedHeight }" class="text-secondary">
        <i class="fas fa-check" />
        </div>
    </div>
    <div v-else :style="{ 'width': computedWidth, 'height': computedHeight }">
        <i class="fas fa-spinner fa-spin" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';

const { action = () => {}, disabled = false, tabindex = undefined, forcedWaitTime = 0 } = defineProps<{
  action: Function<Promise<Boolean>>, disabled?: Boolean, tabindex?: Number, forcedWaitTime?: Number
}>();

interface State {
  inProgress: Boolean;
  completed: Boolean;
  width?: Number;
  height?: Number;
};

const state = reactive<State>({ inProgress: false, completed: false, width: null, height: null });

const innerDisabled = computed(() => {
  return state.inProgress || state.disabled;
});
const computedHeight = computed(() => {
  return state.height && `${state.height}px`;
});
const computedWidth = computed(() => {
  return state.width && `${state.width}px`;
});


const button = ref(null);
const onClick = async () => {
  state.width = button.value.clientWidth;
  state.height = button.value.clientHeight;
  const inProgressAsync = new Promise(resolve => setTimeout(resolve, 10)).then(() => 'RACE');

  let actionCompletedSuccessFully = false;

  if (action) {
    try {
      const awaiter = new Promise(resolve => setTimeout(resolve, state.forcedWaitTime || 0));
      const actionAsync = action();
      const raceResult = await Promise.race([inProgressAsync, actionAsync]);
      if (raceResult === 'RACE' || state.forcedWaitTime) {
        state.inProgress = true;
      }
      await awaiter;
      actionCompletedSuccessFully = await actionAsync;
    } catch (error) {
      console.error({ title: 'Button action error', error, buttonName: action.name?.replace(/^bound\s+/i, ''), props: state.$data });
    }
  }
  state.inProgress = false;
  if (actionCompletedSuccessFully) {
    state.completed = true;
    setTimeout(() => { state.completed = false; }, 1000);
  }
};
</script>
