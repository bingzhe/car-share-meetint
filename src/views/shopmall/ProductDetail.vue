<template>
  <div class="product-detail">
    <div class="detail-content">
      <div class="detail-swipe-wrap">
        <van-swipe class="my-swipe" indicator-color="#1baeae">
          <!-- v-for="(item, index) in detail.goodsCarouselList" -->
          <!-- :key="index" -->
          <van-swipe-item>
            <img :src="prefix(goodsInfo.goods_img)" alt="" />
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="product-info">
        <div class="product-title">
          {{ goodsInfo.goods_name }}
        </div>
        <div class="product-desc">
          {{ goodsInfo.goods_remarks }}
        </div>
        <!-- <div class="product-desc">包邮</div> -->
        <div class="product-price">
          <span>¥{{ goodsInfo.goods_price }}</span>
          <span>库存{{ goodsInfo.goods_stock }}</span>
        </div>
      </div>
      <!-- <div class="product-intro">
        <ul>
          <li>概述</li>
          <li>参数</li>
          <li>安装服务</li>
          <li>常见问题</li>
        </ul>
        <div class="product-content" v-html="detail.goodsDetailContent"></div>
      </div> -->
    </div>
    <van-goods-action>
      <!-- <van-goods-action-icon icon="chat-o" text="客服" /> -->
      <van-goods-action-icon
        icon="cart-o"
        :info="!count ? '' : count"
        @click="goTo()"
        text="购物车"
      />
      <van-goods-action-button
        type="warning"
        @click="addCart"
        text="加入购物车"
      />
      <van-goods-action-button
        type="danger"
        @click="goToCart"
        text="立即购买"
      />
    </van-goods-action>
  </div>
</template>

<script>
// import { getDetail } from "../service/good";
// import { addCart } from "../service/cart";
import { Toast } from "vant";
import { fet } from "@/api/constants.js";

export default {
  data() {
    return {
      // detail: {
      //   goodsCarouselList: [],
      // },

      phone: "",

      goodsInfo: {},
    };
  },
  async mounted() {
    const { id } = this.$route.params;
    console.log(id);
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.phone = userInfo.phone;
    if (!this.phone) {
      Toast("请先登录");
    }

    const params = {
      action: "get_goods",
      goods_id: id,
    };
    const result = await fet("/shopmall/web_route.php", params, "post");
    const { data } = result;
    this.goodsInfo = data.result;

    // const { data } = await getDetail(id);
    // this.detail = data;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goTo() {
      this.$router.push({ path: "/mall/cart" });
    },
    async addCart() {
      const params = {
        action: "cart_save",
        phone: this.phone,
        goods_id: this.goodsInfo.goods_id,
        goods_num: 1,
      };

      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;
      const { code } = data;

      if (code == 200) {
        Toast.success("添加成功");
        this.$store.dispatch("updateCart");
      }
    },
    async goToCart() {
      const params = {
        action: "cart_save",
        phone: this.phone,
        goods_id: this.goodsInfo.goods_id,
        goods_num: 1,
      };

      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;
      const { code } = data;
      if (code == 200) {
        this.$store.dispatch("updateCart");
        this.$router.push({ path: "/mall/cart" });
      }
    },
  },
  computed: {
    count() {
      return this.$store.state.cartCount;
    },
  },
};
</script>

<style lang="less">
@import "../../styles/mixin.less";
.product-detail {
  .detail-header {
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
    .product-name {
      font-size: 14px;
    }
  }
  .detail-content {
    // margin-top: 44px;
    .detail-swipe-wrap {
      .my-swipe .van-swipe-item {
        img {
          width: 100%;
          // height: 300px;
        }
      }
    }
    .product-info {
      padding: 0 10px;
      .product-title {
        font-size: 18px;
        text-align: left;
        color: #333;
      }
      .product-desc {
        font-size: 16px;
        text-align: left;
        color: #666;
      }
      .product-desc {
        font-size: 14px;
        text-align: left;
        color: #999;
        padding: 5px 0;
      }
      .product-price {
        .fj();
        span:nth-child(1) {
          color: #f63515;
          font-size: 22px;
        }
        span:nth-child(2) {
          color: #999;
          font-size: 16px;
        }
      }
    }
    .product-intro {
      width: 100%;
      ul {
        .fj();
        width: 100%;
        margin: 10px 0;
        li {
          flex: 1;
          padding: 5px 0;
          text-align: center;
          font-size: 15px;
          border-right: 1px solid #999;
          box-sizing: border-box;
          &:last-child {
            border-right: none;
          }
        }
      }
      .product-content {
        padding: 0 20px;
        img {
          width: 100%;
        }
      }
    }
  }
  .van-goods-action-button--warning {
    background: linear-gradient(to right, #6bd8d8, @primary);
  }
  .van-goods-action-button--danger {
    background: linear-gradient(to right, #0dc3c3, #098888);
  }
}
</style>
