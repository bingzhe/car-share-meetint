import Vue from "vue";
import VueRouter from "vue-router";

import publish from "@/components/publish.vue";
import jyorder from "@/components/jyorder.vue"; //加油订单
import xcorder from "@/components/xcorder.vue"; //洗车订单
import xcorder1 from "@/components/xcorder1.vue"; //洗车订单
import order_details from "@/components/order_details.vue"; //订单详情
import jyorder1 from "@/components/jyorder1.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/index/index.vue"),
    meta: {
      title: "悦车会",
    },
  },
  {
    path: "/mine",
    name: "mine",
    component: () => import("@/views/mine/index.vue"),
    meta: {
      title: "个人中心",
    },
  },
  {
    path: "/xufei",
    name: "xufei",
    component: () => import("@/views/member/xufei/index.vue"),
    meta: {
      title: "会员续费",
    },
  },
  {
    path: "/info",
    name: "info",
    component: () => import("@/views/member/info/index.vue"),
    meta: {
      title: "会员信息",
    },
  },
  {
    path: "/jylist",
    name: "jylist",
    component: () => import("@/views/jiayou/list/index.vue"),
    meta: {
      title: "加油",
    },
  },
  {
    path: "/jyDetail",
    name: "jyDetail",
    component: () => import("@/views/jiayou/detail/index.vue"),
    meta: {
      title: "加油详情",
    },
  },
  {
    path: "/promote",
    name: "promote",
    component: () => import("@/views/mine/promote/index.vue"),
    meta: {
      title: "我的推广",
    },
  },
  {
    path: "/teamStats",
    name: "teamStats",
    component: () => import("@/views/mine/teamStats/index.vue"),
    meta: {
      title: "团队统计",
    },
  },
  {
    path: "/nextMember",
    name: "nextMember",
    component: () => import("@/views/mine/nextMember/index.vue"),
    meta: {
      title: "下级会员",
    },
  },
  {
    path: "/xcList",
    name: "xcList",
    component: () => import("@/views/xiche/list/index.vue"),
    meta: {
      title: "洗车保养",
    },
  },
  {
    path: "/xcdetails",
    name: "xcdetails",
    component: () => import("@/views/xiche/detail/index.vue"),
    meta: {
      title: "洗车保养",
    },
  },
  {
    path: "/recharge",
    name: "recharge",
    component: () => import("@/views/mine/recharge/index.vue"),
    meta: {
      title: "充值",
    },
  },
  {
    path: "/publish",
    name: "publish",
    component: publish,
  },
  {
    path: "/jyorder",
    name: "加油订单列表",
    component: jyorder,
  },
  {
    path: "/xcorder",
    name: "洗车订单列表",
    component: xcorder,
  },
  {
    path: "/xcorder1",
    name: "xcorder1",
    component: xcorder1,
  },
  {
    path: "/order_details",
    name: "订单详情",
    component: order_details,
  },
  {
    path: "/jyorder1",
    name: "jyorder1",
    component: jyorder1,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
