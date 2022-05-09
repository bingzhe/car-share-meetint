<template>
  <div class="order-detail-box">
    <!-- <s-header :name="'订单详情'" @callback="close"></s-header> -->
    <div class="order-status">
      <div class="status-item">
        <label>订单状态：</label>
        <span>{{ detail.orderStatusString }}</span>
      </div>
      <div class="status-item">
        <label>订单编号：</label>
        <span>{{ detail.order_no }}</span>
      </div>
      <div class="status-item">
        <label>下单时间：</label>
        <span>{{ detail.ctime }}</span>
      </div>
      <van-button
        v-if="detail.status == 3"
        style="margin-bottom: 10px"
        color="#1baeae"
        block
        @click="handleConfirmOrder(detail.order_id)"
        >确认收货</van-button
      >
      <van-button
        v-if="detail.status == 1"
        style="margin-bottom: 10px"
        color="#1baeae"
        block
        @click="showPayFn"
        >去支付</van-button
      >
      <!-- <van-button
        v-if="!(detail.orderStatus < 0 || detail.orderStatus == 4)"
        block
        @click="cancelOrder(detail.orderNo)"
        >取消订单</van-button
      > -->
    </div>
    <div class="order-price">
      <div class="price-item">
        <label>商品金额：</label>
        <span>¥ {{ detail.price }}</span>
      </div>
      <div class="price-item" v-if="detail.status == 3 || detail.status == 4">
        <label>配送方式：</label>
        <span>{{ detail.logistics_company }}</span>
      </div>
      <div class="price-item" v-if="detail.status == 3 || detail.status == 4">
        <label>快递单号：</label>
        <span>{{ detail.logistics_no }}</span>
      </div>
    </div>
    <van-card
      v-for="item in detail.goods_list"
      :key="item.goods_id"
      style="background: #fff"
      :num="item.goods_num"
      :price="item.goods_price"
      :title="item.goods_name"
      :thumb="prefix(item.goods_img)"
    />
    <!-- desc="全场包邮" -->

    <van-popup v-model="showPay" position="bottom" :style="{ height: '24%' }">
      <div :style="{ width: '90%', margin: '0 auto', padding: '20px 0' }">
        <!-- <van-button
          :style="{ marginBottom: '10px' }"
          color="#1989fa"
          block
          @click="payOrder(detail.orderNo, 1)"
          >支付宝支付</van-button
        > -->
        <van-button color="#4fc08d" block @click="payOrder"
          >微信支付</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script>
import { fet } from "@/api/constants.js";
import { WXinvoke } from "@/util/wxUtil";
// import sHeader from "./components/SimpleHeader";
// import {
//   getOrderDetail,
//   cancelOrder,
//   confirmOrder,
//   payOrder,
// } from "../service/order";
import { Dialog, Toast } from "vant";
export default {
  components: {
    // sHeader,
  },
  data() {
    return {
      phone: "",

      detail: {},
      showPay: false,
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
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      const { id } = this.$route.query;

      const params = {
        action: "order_info",
        order_id: id,
      };
      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;
      this.detail = data.result || {};

      if (this.detail.status == 1) {
        this.detail.orderStatusString = "待付款";
      } else if (this.detail.status == 2) {
        this.detail.orderStatusString = "待发货";
      } else if (this.detail.status == 3) {
        this.detail.orderStatusString = "已发货";
      } else if (this.detail.status == 4) {
        this.detail.orderStatusString = "交易完成";
      }

      //   const { data } = await getOrderDetail(id);
      //   this.detail = data;
      Toast.clear();
    },
    cancelOrder(id) {
      Dialog.confirm({
        title: "确认取消订单？",
      })
        .then(() => {
          //   cancelOrder(id).then((res) => {
          //     if (res.resultCode == 200) {
          //       Toast("删除成功");
          //       this.init();
          //     }
          //   });
        })
        .catch(() => {
          // on cancel
        });
    },
    handleConfirmOrder(id) {
      Dialog.confirm({
        title: "是否确认收货？",
      })
        .then(async () => {
          const params = {
            action: "order_receipt",
            phone: this.phone,
            order_id: id,
          };
          const result = await fet("/shopmall/web_route.php", params, "post");

          const { data } = result;
          const { code } = data;

          if (code == 200) {
            Toast("确认成功");
            this.init();
          }

          // confirmOrder(id).then((res) => {
          //   if (res.resultCode == 200) {
          //     Toast("确认成功");
          //     this.init();
          //   }
          // });
        })
        .catch(() => {
          // on cancel
        });
    },
    showPayFn() {
      this.showPay = true;
    },
    async payOrder() {
      Toast.loading;

      const params = {
        order_id: this.detail.order_id,
        user_id: this.detail.user_id,
      };

      const result = await fet("public/wx/order_wxpay.php", params, "post");

      WXinvoke(result, (response) => {
        if (response.err_msg == "get_brand_wcpay_request:ok") {
          this.$toast.success("支付成功");
          this.$router.push("/mall/category");
        }
      });
      //   await payOrder({ orderNo: id, payType: type });
      //   this.showPay = false;
      //   this.init();
    },
    close() {
      Dialog.close();
    },
  },
};
</script>

<style lang="less" scoped>
.order-detail-box {
  background: #f7f7f7;
  .order-status {
    background: #fff;
    // margin-top: 44px;
    padding: 20px;
    font-size: 15px;
    .status-item {
      margin-bottom: 10px;
      label {
        color: #999;
      }
      span {
      }
    }
  }
  .order-price {
    background: #fff;
    margin: 20px 0;
    padding: 20px;
    font-size: 15px;
    .price-item {
      margin-bottom: 10px;
      label {
        color: #999;
      }
      span {
      }
    }
  }
  .van-card {
    margin-top: 0;
  }
  .van-card__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
