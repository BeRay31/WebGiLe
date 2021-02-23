import Vue from "vue";
import VueRouter from "vue-router";
import WebGiLe from "../views/WebGiLe.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: WebGiLe
  }
];

const router = new VueRouter({
  routes
});

export default router;
