<template>
  <div class="create-order">
    <div class="address-wrap">
      <div class="name" @click="goTo">
        <span>{{ address.addressee }} </span>
        <span>{{ address.phone }}</span>
      </div>
      <div class="address">
        {{ address.province }} {{ address.city }} {{ address.county }}
        {{ address.address }}
      </div>
      <van-icon class="arrow" name="arrow" />
    </div>
    <div class="good">
      <div class="good-item" v-for="(item, index) in cartList" :key="index">
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
          </div>
        </div>
      </div>
    </div>
    <div class="pay-wrap">
      <div class="price">
        <span>商品金额</span>
        <span>¥{{ total }}</span>
      </div>
      <van-button
        @click="createOrder"
        class="pay-btn"
        color="#1baeae"
        type="primary"
        block
        >生成订单</van-button
      >
    </div>
    <van-popup
      closeable
      :close-on-click-overlay="false"
      v-model="showPay"
      position="bottom"
      :style="{ height: '30%' }"
      @close="close"
    >
      <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
        <!-- <van-button
          :style="{ marginBottom: '10px' }"
          color="#1989fa"
          block
          @click="payOrder(1)"
          >支付宝支付</van-button
        > -->
        <van-button color="#4fc08d" block @click="payOrder(2)"
          >微信支付</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script>
// import { getCart, getByCartItemIds } from "../service/cart";
// import { getDefaultAddress, getAddressDetail } from "../service/address";
// import { createOrder, payOrder } from "../service/order";
import { setLocal, getLocal } from "@/util/util";
import { Toast } from "vant";
import { fet } from "@/api/constants.js";
import { WXinvoke } from "@/util/wxUtil";

export default {
  components: {},
  data() {
    return {
      phone: "",

      cartList: [],
      address: {},
      showPay: false,
      orderNo: "",
      user_id: "",
      cartItemIds: [],

      total: "",
    };
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.phone = userInfo.phone;
    if (!this.phone) {
      Toast("请先登录");
    }

    this.init();
  },
  methods: {
    async init() {
      Toast.loading({ message: "加载中...", forbidClick: true });
      const { addressId, cart_list, goods_price } = this.$route.query;

      this.total = goods_price;

      const _cartItemIds = cart_list
        ? JSON.parse(cart_list)
        : JSON.parse(getLocal("cartItemIds"));

      setLocal("cartItemIds", JSON.stringify(_cartItemIds));

      const cartIdList = _cartItemIds.join(",");
      const params = {
        action: "cart_list",
        phone: this.phone, // 用户账号
      };
      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;
      const cartList = data.result;

      const goodslist = cartList.filter((item) => {
        return cartIdList.indexOf(item.cart_id) > -1;
      });

      //   const { data: list } = await getByCartItemIds({
      //     cartItemIds: _cartItemIds.join(","),
      //   });
      const address = addressId
        ? await this.getAddress(addressId)
        : await this.getAddress();
      if (!address) {
        this.$router.push({ path: "/mall/address" });
        return;
      }

      this.cartList = goodslist;
      this.address = address;
      Toast.clear();
    },
    async getAddress(id) {
      const params = {
        action: "get_default_address",
        phone: this.phone,
      };
      if (id) {
        params.address_id = id;
      }

      const result = await fet("/shopmall/web_route.php", params, "post");
      const data = result.data;
      return data.result;
    },
    goTo() {
      this.$router.push({
        path: `/mall/address?cartItemIds=${JSON.stringify(
          this.cartItemIds
        )}&goods_price=${this.total}`,
      });
    },
    deleteLocal() {
      setLocal("cartItemIds", "");
    },
    async createOrder() {
      const params = {
        action: "order_save",
        phone: this.phone,
        address_id: this.address.address_id,
        goods_price: this.total,
        cart_list: this.cartList.map((item) => item.cart_id),
      };

      const result = await fet("/shopmall/web_route.php", params, "post");

      const data = result.data;
      const code = data.code;

      if (code == 200) {
        setLocal("cartItemIds", "");
        this.orderNo = data.result.order_id;
        this.user_id = data.result.user_id;
        this.showPay = true;
      }
      //   const { data, resultCode } = await createOrder(params);
      //   setLocal("cartItemIds", "");
      //   this.orderNo = data;
      //   this.showPay = true;
    },
    close() {
      this.$router.push({ path: "/mall/category" });
    },
    async payOrder(type) {
      Toast.loading;

      const params = {
        order_id: this.orderNo,
        user_id: this.user_id,
      };

      const result = await fet("public/wx/order_wxpay.php", params, "post");

      WXinvoke(result, (response) => {
        if (response.err_msg == "get_brand_wcpay_request:ok") {
          this.$toast.success("支付成功");
          this.$router.push("/mall/category");
        }
      });
      //   await payOrder({ orderNo: this.orderNo, payType: type });
      //   this.$router.push({ path: "order" });
    },
  },
  // computed: {
  //   total: function () {
  //     let sum = 0;
  //     this.cartList.forEach((item) => {
  //       sum += item.goodsCount * item.sellingPrice;
  //     });
  //     return sum;
  //   },
  // },
};
</script>

<style lang="less" scoped>
@import "../../styles/mixin.less";
.create-order {
  background: #f9f9f9;
  .address-wrap {
    margin-bottom: 20px;
    background: #fff;
    position: relative;
    // margin-top: 44px;
    font-size: 14px;
    padding: 15px;
    color: #222333;
    .name,
    .address {
      margin: 10px 0;
    }
    .arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(
        135deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
      );
      background: repeating-linear-gradient(
        -45deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
      );
      background-size: 80px;
      content: "";
    }
  }
  .good {
    margin-bottom: 120px;
  }
  .good-item {
    padding: 10px;
    background: #fff;
    display: flex;
    .good-img {
      img {
        .wh(80px, 80px);
      }
    }
    .good-desc {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      padding: 20px;
      .good-title {
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
  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 10px 0;
    padding-bottom: 50px;
    border-top: 1px solid #e9e9e9;
    > div {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin: 10px 0;
      font-size: 14px;
      span:nth-child(2) {
        color: red;
        font-size: 18px;
      }
    }
    .pay-btn {
      position: fixed;
      bottom: 7px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>
