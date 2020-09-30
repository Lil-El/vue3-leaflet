<template>
  <div id="app">
    <ul>
      <li
        v-for="route in routes"
        :key="route.name"
        @click="handleClick(route.name)"
      >
        {{ route.name }}
      </li>
    </ul>
    <router-view />
  </div>
</template>
<script>
import { reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  setup() {
    let routes = useRouter().getRoutes();
    const state = reactive({
      routes,
    });
    return { routes };
  },
  methods: {
    handleClick(name) {
      this.$router.push({ name });
    },
  },
};
</script>