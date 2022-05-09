<template>
  <div class="order-box">
    <van-tabs
      @change="onChangeTab"
      :color="'#1baeae'"
      :title-active-color="'#1baeae'"
      class="order-tab"
      v-model="status"
    >
      <van-tab title="全部" name=""></van-tab>
      <van-tab title="待付款" name="1"></van-tab>
      <van-tab title="待发货" name="2"></van-tab>
      <van-tab title="已发货" name="3"></van-tab>
      <van-tab title="交易完成" name="4"></van-tab>
    </van-tabs>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      class="order-list-refresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        @offset="300"
      >
        <div
          v-for="(item, index) in list"
          :key="index"
          class="order-item-box"
          @click="goTo(item.orderNo)"
        >
          <div class="order-item-header">
            <span>订单时间：{{ item.ctime }}</span>
            <span>{{ item.orderStatusString }}</span>
          </div>
          <van-card
            v-for="one in item.goods_list"
            :key="one.goods_id"
            :num="one.goods_num"
            :price="one.goods_price"
            :title="one.goods_name"
            :thumb="prefix(one.goods_img)"
          />
          <!-- desc="全场包邮" -->
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// import sHeader from "./components/SimpleHeader";
// import { getOrderList } from "../service/order";
import { fet } from "@/api/constants.js";
import { Toast } from "vant";

export default {
  data() {
    return {
      phone: "",

      status: "",
      loading: false,
      finished: false,
      refreshing: false,
      list: [],
      page: 1,
    };
  },
  components: {},
  async mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.phone = userInfo.phone;
    if (!this.phone) {
      Toast("请先登录");
    }
    // this.loadData()
  },
  methods: {
    async loadData() {
      const params = {
        action: "order_list",
        phone: this.phone,
        status: this.status,
      };

      if (this.status) {
        params.status = this.status;
      }

      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;
      this.list = data.result.map((item) => {
        if (item.status == 1) {
          item.orderStatusString = "待付款";
        } else if (item.status == 2) {
          item.orderStatusString = "待发货";
        } else if (item.status == 3) {
          item.orderStatusString = "已发货";
        } else if (item.status == 4) {
          item.orderStatusString = "交易完成";
        }
        return item;
      });
      this.loading = false;
      this.finished = true;

      //   const {
      //     data,
      //     data: { list },
      //   } = await getOrderList({ pageNumber: this.page, status: this.status });
      //   this.list = this.list.concat(list);
      //   this.totalPage = data.totalPage;
      //   this.loading = false;
      //   if (this.page >= data.totalPage) this.finished = true;
    },
    onChangeTab(name, title) {
      this.status = name;
      this.onRefresh();
    },
    goTo(id) {
      this.$router.push({ path: `/mall/order-detail?id=${id}` });
    },
    goBack() {
      this.$router.go(-1);
    },
    onLoad() {
      if (!this.refreshing && this.page < this.totalPage) {
        this.page = this.page + 1;
      }
      if (this.refreshing) {
        this.list = [];
        this.refreshing = false;
      }
      this.loadData();
    },
    onRefresh() {
      this.refreshing = true;
      this.finished = false;
      this.loading = true;
      this.page = 1;
      this.onLoad();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../styles/mixin.less";
.order-box {
  .order-header {
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
    .order-name {
      font-size: 14px;
    }
  }
  .order-tab {
    // margin-top: 44px;
    top: 0;
    position: fixed;
    left: 0;
    z-index: 1000;
    width: 100%;
  }
  .order-list-refresh {
    margin-top: 44px;
    .van-card__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .van-pull-refresh__head {
      background: #f9f9f9;
    }
    .van-list {
      min-height: calc(100vh);
      background: #f9f9f9;
      margin-top: 20px;
    }
    .order-item-box {
      margin: 20px 10px;
      background-color: #fff;
      .order-item-header {
        padding: 10px 20px 0 20px;
        display: flex;
        justify-content: space-between;
      }
      .van-card {
        background-color: #fff;
        margin-top: 0;
      }
    }
  }
}
</style>
