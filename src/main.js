import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
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

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
