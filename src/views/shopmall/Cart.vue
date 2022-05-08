<template>
  <div class="cart-box">
    <div class="cart-body">
      <van-checkbox-group
        @change="groupChange"
        v-model="result"
        ref="checkboxGroup"
      >
        <van-swipe-cell
          :right-width="50"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="good-item">
            <van-checkbox :name="item.cart_id" />
            <div class="good-img">
              <img :src="prefix(item.goods_img)" alt="" />
            </div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{ item.goods_name }}</span>
                <span>x{{ item.goods_num }}</span>
              </div>
              <div class="good-btn">
                <div class="price">¥{{ item.goods_price }}</div>
                <van-stepper
                  integer
                  :min="1"
                  :value="item.goods_num"
                  :name="item.cart_id"
                  async-change
                  @change="onChange"
                />
              </div>
            </div>
          </div>
          <van-button
            slot="right"
            square
            icon="delete"
            type="danger"
            class="delete-button"
            @click="deleteGood(item.cart_id)"
          />
        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <van-submit-bar
      v-if="list.length > 0"
      class="submit-all"
      :price="total * 100"
      button-text="结算"
      @submit="onSubmit"
    >
      <van-checkbox @click="allCheck" v-model="checkAll">全选</van-checkbox>
    </van-submit-bar>
    <div class="empty" v-if="!list.length">
      <van-icon name="smile-o" />
      <div class="title">购物车空空空如也</div>
      <van-button color="#1baeae" type="primary" @click="goTo" block
        >前往选择</van-button
      >
    </div>
    <nav-bar></nav-bar>
  </div>
</template>

<script>
import { Toast } from "vant";
import navBar from "./components/NavBar";
import { fet } from "@/api/constants.js";

// import { getCart, deleteCartItem, modifyCart } from "../service/cart";
export default {
  data() {
    return {
      phone: "",

      checked: false,
      list: [],
      all: false,
      result: [],
      checkAll: true,
    };
  },
  components: {
    navBar,
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.phone = userInfo.phone;
    if (!this.phone) {
      Toast("请先登录");
    }

    this.init();
  },
  computed: {
    total: function () {
      let sum = 0;
      let _list = this.list.filter((item) =>
        this.result.includes(item.cart_id)
      );
      _list.forEach((item) => {
        sum += item.goods_num * item.goods_price;
      });
      return sum;
    },
  },
  methods: {
    async init() {
      Toast.loading({ message: "加载中...", forbidClick: true });
      const params = {
        action: "cart_list",
        phone: this.phone, // 用户账号
      };
      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;

      this.list = data.result;
      this.result = data.result.map((item) => item.cart_id);
      Toast.clear();
    },
    goBack() {
      this.$router.go(-1);
    },
    goTo() {
      this.$router.push({ path: "/mall/category" });
    },
    async onChange(value, detail) {
      const goods = this.list.filter((item) => item.cart_id == detail.name)[0];
      const num = goods.goods_num;
      if (num == value) return;

      Toast.loading({ message: "修改中...", forbidClick: true });

      const params = {
        action: "cart_save",
        phone: this.phone,
        goods_id: goods.goods_id,
        goods_num: value,
        cart_id: detail.name,
      };
      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;
      const code = data.code;

      if (code == 200) {
        this.list.forEach((item) => {
          if (item.cart_id == detail.name) {
            item.goods_num = value;
          }
        });
        this.$store.dispatch("updateCart");
      }

      Toast.clear();
    },
    //TODO 下订单 fix
    async onSubmit() {
      if (this.result.length == 0) {
        Toast.fail("请选择商品进行结算");
        return;
      }

      // const params = {
      //   action: "cart_save",
      //   phone: this.phone,
      //   cart_list: this.result,
      //   goods_price: this.total,
      // };
      // const result = await fet("/shopmall/web_route.php", params, "post");

      // const data = result.data;
      // const code = data.code;

      const cart_list = JSON.stringify(this.result);
      this.$router.push({
        path: `/mall/create-order?cart_list=${cart_list}&goods_price=${this.total}`,
      });
    },
    //TODO fix
    async deleteGood(id) {
      const params = {
        action: "cart_del",
        phone: this.phone,
        cart_idlist: [id],
        // cart_idlist: JSON.stringify([id, "3"]),
      };
      const result = await fet("/shopmall/web_route.php", params, "post");
      const data = result.data;
      const code = data.code;

      if (code == 200) {
        this.$store.dispatch("updateCart");
        this.init();
      }
    },
    groupChange(result) {
      if (result.length == this.list.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
      this.result = result;
    },
    allCheck() {
      if (this.checkAll) {
        this.result = this.list.map((item) => item.cart_id);
      } else {
        this.result = [];
      }
    },
  },
};
</script>

<style lang="less">
@import "../../styles/mixin.less";
.cart-box {
  .cart-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    .fj();
    .wh(100%, 44px);
    line-height: 44px;
    padding: 0 10px;
    .boxSizing();
    color: #252525;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    .cart-name {
      font-size: 14px;
    }
  }
  .cart-body {
    margin: 0 0 100px 0;
    padding-left: 10px;
    .good-item {
      display: flex;
      .good-img {
        padding: 10px;
        img {
          .wh(80px, 80px);
          vertical-align: bottom;
        }
      }
      .good-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding: 20px 20px 20px 10px;
        .good-title {
          font-size: 14px;
          display: flex;
          justify-content: space-between;
        }
        .good-btn {
          display: flex;
          justify-content: space-between;
          .price {
            font-size: 16px;
            color: red;
            line-height: 28px;
          }
          .van-icon-delete {
            font-size: 20px;
            margin-top: 4px;
          }
        }
      }
    }
    .delete-button {
      width: 50px;
      height: 100%;
    }
  }
  .empty {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    margin-top: 200px;
    .van-icon-smile-o {
      font-size: 50px;
    }
    .title {
      font-size: 16px;
      margin-bottom: 20px;
    }
  }
  .submit-all {
    margin-bottom: 50px;
    .van-checkbox {
      margin-left: 10px;
    }
    .van-submit-bar__text {
      margin-right: 10px;
    }
    .van-submit-bar__button {
      background: @primary;
    }
  }
  .van-checkbox__icon--checked .van-icon {
    background-color: @primary;
    border-color: @primary;
  }
}
</style>
