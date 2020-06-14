import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Play from "../views/Play.vue";
import Posts from "../views/Posts.vue";
import Profile from "../views/Profile.vue";
import Search from "../views/Search.vue";
import DayCover from "../views/DayCover.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import User from "../views/User.vue";
import History from "../views/History.vue";
import Like from "../views/Like.vue";

Vue.use(VueRouter);

const routes = [{
    path: "/",
    name: "Home",
    meta: {
      isKeep: true //需要缓存的路由
    },
    component: Home
  },
  {
    path: "/channel",
    name: "Channel",
    meta: {
      isKeep: true //需要缓存的路由
    },
    component: () =>
      import("../views/Channel.vue")
  },
  {
    path: "/profile",
    name: "Profile",
    // meta: {
    //   isKeep: true //需要缓存的路由
    // },
    component: Profile,
    children: [
    ],
  },
  {
    path: "/play",
    name: "Play",
    component: Play,
  },
  {
    path: "/posts",
    name: "Posts",
    component: Posts,
  },
  {
    path: "/search",
    name: "Search",
    meta: {
      isKeep: true //需要缓存的路由
    },
    component: Search,
  },
  {
    path: "/dayCover",
    name: "DayCover",
    meta: {
      isKeep: true //需要缓存的路由
    },
    component: DayCover,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,

  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/user",
    name: "User",
    component: User,
  },
  {
    path: "/like",
    name: "Like",
    component: Like,
  },
  {
    path: "/history",
    name: "History",
    component: History,
  },

];

const router = new VueRouter({
  routes
});

export default router;