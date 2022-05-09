<template>
  <div class="address-box">
    <div class="address-item">
      <van-address-list
        v-if="from != 'mine'"
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="select"
      />
      <van-address-list
        v-else
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      />
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
// import sHeader from "./components/SimpleHeader";
// import { getAddressList } from "../service/address";
import { fet } from "@/api/constants.js";

export default {
  components: {},
  data() {
    return {
      phone: "",

      chosenAddressId: "1",
      list: [],
      from: this.$route.query.from,
      goods_price: this.$route.query.goods_price,
    };
  },
  mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.phone = userInfo.phone;
    if (!this.phone) {
      Toast("请先登录");
    }

    this.getAddressList();
    // const { data } = await getAddressList();
    // this.list = data.map((item) => {
    //   return {
    //     id: item.addressId,
    //     name: item.userName,
    //     tel: item.userPhone,
    //     address: `${item.provinceName} ${item.cityName} ${item.regionName} ${item.detailAddress}`,
    //     isDefault: !!item.defaultFlag,
    //   };
    // });
  },
  methods: {
    async getAddressList() {
      const params = {
        action: "get_address_list",
        phone: this.phone,
      };

      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;
      const list = data.result;
      this.list = list.map((item) => {
        return {
          id: item.address_id,
          name: item.addressee,
          tel: item.phone,
          address: `${item.province} ${item.city} ${item.county} ${item.address}`,
          isDefault: item.is_default === "1",
        };
      });

      console.log(data);
    },
    onAdd() {
      this.$router.push({
        path: `/mall/address-edit?type=add&from=${this.from}`,
      });
    },
    onEdit(item, index) {
      this.$router.push({
        path: `/mall/address-edit?type=edit&addressId=${item.id}&from=${this.from}`,
      });
    },
    select(item, index) {
      this.$router.push({
        path: `/mall/create-order?addressId=${item.id}&from=${this.from}&goods_price=${this.goods_price}`,
      });
    },
  },
};
</script>

<style lang="less">
@import "../../styles/mixin.less";
.address-box {
  .van-radio__icon {
    display: none;
  }
  .address-item {
    // margin-top: 44px;
    .van-button {
      background: @primary;
      border-color: @primary;
    }
  }
}
</style>
