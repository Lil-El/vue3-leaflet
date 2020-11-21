<template>
  <div>
    {{modelValue}}
    <span @click="handleClick">Button</span>
  </div>
</template>

<script>
import { inject, reactive, getCurrentInstance } from "vue";
export default {
  props: ["modelValue"], // 使用modelValue获取v-model的值（固定的属性名）
  setup(props, ctx) {
    console.log(props, getCurrentInstance(), ctx);
    const parent = inject("parent3");
    return {
      handleClick() {
        console.log(parent);
        ctx.emit("update:modelValue", "update:title");
      },
    };
  },
};
</script>

<style>
</style>