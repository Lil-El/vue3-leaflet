<template>
  <div>
    Children:
    <span @click="handleClick">Button</span>
  </div>
</template>

<script>
import { inject, reactive } from "vue";
export default {
  setup() {
    const parent = inject("parent3");
    return {
      handleClick() {
        console.log(parent);
      },
    };
  },
};
</script>

<style>
</style>