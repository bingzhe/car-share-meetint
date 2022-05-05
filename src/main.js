import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import wxAuth from "@/util/wxAuth";
import wxShare from "@/util/wxShare";
const qs = require("qs");

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import {
  Swipe,
  Lazyload,
  SwipeItem,
  Icon,
  RadioGroup,
  Radio,
  Tab,
  Tabs,
  Toast,
} from "vant";

Vue.use(ElementUI);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Icon);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Toast);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.query.inviteCode) {
    sessionStorage.setItem("inviteCode", to.query.inviteCode);
  }
  let token = localStorage.getItem("userInfo");
  token = JSON.parse(token);
  if (token && token.wx_id) {
    wxShare().then((res) => {
      next();
    });
  } else {
    wxAuth().then((res) => {
      localStorage.setItem("userInfo", JSON.stringify(res));
      const url = window.location.href;
      const parseUrl = qs.parse(url.split("?")[1]);
      const hasParse = JSON.stringify(qs) === "{}";
      const newUrl = `${url.split("?")[0]}${
        hasParse ? `?${qs.stringify(parseUrl)}` : ""
      }`;
      location.assign(newUrl);
    });
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
