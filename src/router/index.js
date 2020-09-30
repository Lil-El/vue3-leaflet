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
    {
      name: "旅游相册",
      path: "/TravelAlbum",
      component: () => import("../views/travelAlbum"),
    },
  ],
});

export default router;
