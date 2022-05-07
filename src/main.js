import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import wxAuth from "@/util/wxAuth";
import wxShare from "@/util/wxShare";
const qs = require("qs");

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import { prefix } from "@/util/util";
Vue.prototype.prefix = prefix;

import "vant/lib/index.css";
import {
  Divider,
  Popup,
  Overlay,
  Loading,
  Dialog,
  ContactCard,
  Form,
  AddressEdit,
  AddressList,
  Field,
  CellGroup,
  Cell,
  SwipeCell,
  Icon,
  Stepper,
  Card,
  Checkbox,
  CheckboxGroup,
  Button,
  Swipe,
  SwipeItem,
  PullRefresh,
  List,
  Tab,
  Tabs,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  SubmitBar,
  Toast,
  Lazyload,
  RadioGroup,
  Radio,
} from "vant";

Vue.use(Divider)
  .use(Popup)
  .use(Overlay)
  .use(Loading)
  .use(Dialog)
  .use(Toast)
  .use(ContactCard)
  .use(Form)
  .use(AddressEdit)
  .use(AddressList)
  .use(Field)
  .use(CellGroup)
  .use(Cell)
  .use(SwipeCell)
  .use(Icon)
  .use(Stepper)
  .use(Card)
  .use(Button)
  .use(Swipe)
  .use(SwipeItem)
  .use(PullRefresh)
  .use(List)
  .use(Tab)
  .use(Tabs)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(SubmitBar)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Lazyload)
  .use(RadioGroup)
  .use(Radio);

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
