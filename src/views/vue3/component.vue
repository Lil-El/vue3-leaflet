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
    const state = reactive({ name: "TEST" });
    const parent = inject("parent");
    return {
      handleClick() {
        console.log(parent());
      },
    };
  },
};
</script>

<style>
</style>