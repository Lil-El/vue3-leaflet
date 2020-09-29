import { createRouter, createWebHistory } from "vue-router";
import Typhoon from "../views/typhoon/index.vue";
const routerHistory = createWebHistory();

let router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      redirect: "/TyphoonRoute",
    },
    {
      name: "台风轨迹",
      path: "/TyphoonRoute",
      component: Typhoon,
    },
  ],
});

export default router;
