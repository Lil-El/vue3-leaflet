<template>
  <div id="app">
    <ul>
      <li
        v-for="route in state.routes"
        :key="route.name"
        @click="handleClick(route.name)"
      >
        {{ route.name }}
      </li>
    </ul>
    <router-view v-model:title="state.parTitle" @parFn="parFn" />
  </div>
</template>
<script>
import { reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  setup() {
    let routes = useRouter().getRoutes();
    const state = reactive({
      routes,
      parTitle: "Vue3 Props",
    });
    // 父组件修改props，子组件变化
    // setTimeout(() => {
    //   state.parTitle = "setTimeout";
    // }, 2000);
    watch(
      () => state.parTitle,
      (n, o) => {
        // console.log(state);
      }
    );
    return { state };
  },
  methods: {
    handleClick(name) {
      this.$router.push({ name });
    },
    parFn(str) {
      // console.log(str);
    },
  },
};
</script>