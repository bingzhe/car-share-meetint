<template>
  <div class="order_box">
    <div class="order_item" v-for="(item, index) in payData" :key="index">
      <div class="order_top flexbox">
        <div class="od_t">加油订单</div>
        <div class="od_t yellow_text">{{ item.statusName }}</div>
      </div>
      <div class="order_pay flexbox">
        支付金额：
        <div class="od_m">{{ item.amount_pay }}</div>
        元 <del>{{ item.amount_gun }}元</del>
      </div>
      <div class="order_adress flexbox">
        <img src="../assets/images/dz_icon.png" alt="" class="od_img" />
        <div class="od_name">加油店</div>
        <div class="od_line"></div>
        <div class="od_cp">{{ item.gas_name }}</div>
      </div>
      <div class="order_btn flexbox">
        <!-- <div class="btn_go yellow_btn" v-if="item.status==1" @click="toPay(item)">继续支付</div> -->
        <!-- <router-link to="order_details" class="btn_go">查看</router-link> -->
      </div>
    </div>
  </div>
</template>
<script>
import { api } from "@/api/api";
import { WXinvoke } from "@/util/wxUtil";
export default {
  components: {},
  data() {
    return {
      payData: [],
      userInfo: null,
    };
  },
  created() {
    let userInfo = localStorage.getItem("userInfo");
    this.userInfo = JSON.parse(userInfo);
    this.getorders();
  },
  methods: {
    toPay(item) {
      let data = {
        action: "order_save",
        phone: this.userInfo.phone,
        gasId: item.gas_id,
        oilId: this.selectInfo.oil_id,
        oilName: item.oil_no,
        oilNo: item.gun_no,
        price: item.amount_pay,
        origin_price: item.amount_gun,
        discount_price: item.amount_discounts,
        station_price: this.selectInfo.discount_price,
        oil_type: this.selectInfo.oilType,
        units: parseFloat(this.amount),
      };
    },
    async getorders() {
      let res = await api.getorder({
        action: "order_list",
        phone: this.userInfo.phone,
      });
      if (res.data.code == 200) {
        this.payData = res.data.result;
        this.payData.forEach((item, index) => {
          if (item.status == 1) {
            item.statusName = "未支付";
          } else if (item.status == 2) {
            item.statusName = "已支付";
          } else if (item.status == 3) {
            item.statusName = "退款中";
          } else if (item.status == 4) {
            item.statusName = "退款成功";
          }
          // else if (item.status == 4) {
          //   item.statusName = "退款失败";
          // }
        });
      }
    },
  },
  mounted() {},
};
</script>
<style scoped>
.flexbox {
  display: flex;
}
.order_box {
  padding: 4% 3%;
}
.order_item {
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  padding: 4% 3%;
}
.order_top {
  justify-content: space-between;
}
.od_t {
  font-size: 2.4vh;
  color: #000;
}
.order_pay {
  padding: 15px 0;
  border-bottom: 1px solid #ececec;
  font-size: 2.2vh;
}
.od_m {
  font-weight: bold;
  color: red;
  font-size: 2.2vh;
}
.order_pay del {
  color: #999;
  margin-left: 10px;
  font-size: 2.2vh;
}
.order_adress {
  margin-top: 15px;
  align-items: center;
  font-size: 2.2vh;
}
.od_img {
  width: 3.5vh;
}
.od_name {
  font-size: 2.2vh;
}
.od_line {
  margin: 0 10px;
  border-left: 1px solid #ececec;
  height: 14px;
}
.od_cp {
  font-size: 2.2vh;
  color: #999;
}
.order_btn {
  justify-content: flex-end;
  margin-top: 15px;
  width: 100%;
}
.btn_go {
  border: 1px solid #c2c2c2;
  font-size: 2.2vh;
  padding: 10px;
  margin-left: 10px;
}
.yellow_btn {
  border: 1px solid #e1c558;
  color: #e1c558;
}
.yellow_text {
  color: #e1c558;
}
</style>
