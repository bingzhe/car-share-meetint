<template>
  <div class="nav-bar">
    <ul class="nav-list">
      <router-link tag="li" class="nav-list-item active" to="/mall/category">
        <i class="nbicon nblvsefenkaicankaoxianban-1"></i>
        <span>首页</span>
      </router-link>
      <!-- <router-link tag="li" class="nav-list-item" to="/mall/category">
        <i class="nbicon nbfenlei"></i>
        <span>分类</span>
      </router-link> -->
      <router-link tag="li" class="nav-list-item" to="/mall/cart">
        <van-icon name="shopping-cart-o" :info="!count ? '' : count" />
        <span>购物车</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="/mall/user">
        <i class="nbicon nblvsefenkaicankaoxianban-"></i>
        <span>我的</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { getLocal } from "@/util/util";
export default {
  mounted() {
    const token = getLocal("userInfo");
    const path = this.$route.path;
    if (token && path != "/home") {
      this.$store.dispatch("updateCart");
    }
  },
  data() {
    return {};
  },
  computed: {
    count() {
      return this.$store.state.cartCount;
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../styles/mixin.less";

.nav-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 5px 0;
  z-index: 1000;
  background: #fff;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  .nav-list {
    width: 100%;
    .fj();
    flex-direction: row;
    padding: 0;
    .nav-list-item {
      display: flex;
      flex: 1;
      flex-direction: column;
      text-align: center;
      color: #666;
      &.router-link-active {
        color: @primary;
      }
      i {
        text-align: center;
        font-size: 26px;
      }
      span {
        font-size: 14px;
      }
      .van-icon-shopping-cart-o {
        margin: 0 auto;
        margin-bottom: 2px;
      }
    }
  }
}
</style>
