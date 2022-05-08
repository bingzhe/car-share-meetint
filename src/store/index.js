import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import ubi from "./modules/ubi";
import { fet } from "@/api/constants.js";
import { Toast } from "vant";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartCount: 0,
  },
  getters,
  mutations: {
    addCart(state, payload) {
      state.cartCount = payload.count;
    },
  },
  actions: {
    async updateCart(ctx) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      const phone = userInfo.phone;
      if (!phone) {
        Toast("请先登录");
      }

      const params = {
        action: "cart_list",
        phone: phone, // 用户账号
      };
      const result = await fet("/shopmall/web_route.php", params, "post");

      const { data } = result;
      const list = data.result || [];

      let sum = 0;
      list.forEach((item) => {
        sum += Number(item.goods_num);
      });

      ctx.commit("addCart", {
        count: sum || 0,
      });
    },
  },
  modules: {
    ubi,
  },
});
