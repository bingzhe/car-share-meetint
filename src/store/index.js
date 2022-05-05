import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import ubi from "./modules/ubi";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters,
  mutations: {},
  actions: {},
  modules: {
    ubi,
  },
});
