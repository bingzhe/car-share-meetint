<template>
  <div class="address-edit-box">
    <van-address-edit
      class="edit"
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="type == 'edit'"
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
// import sHeader from "./components/SimpleHeader";
import { fet } from "@/api/constants.js";

// import {
//   addAddress,
//   EditAddress,
//   DeleteAddress,
//   getAddressDetail,
// } from "../service/address";
import { tdist } from "@/util/util";

export default {
  components: {},
  data() {
    return {
      phone: "",

      areaList: {
        province_list: {},
        city_list: {},
        county_list: {},
      },
      searchResult: [],
      type: "add",
      addressId: "",
      addressInfo: {},
      from: "",
    };
  },
  async mounted() {
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    this.phone = userInfo.phone;
    if (!this.phone) {
      Toast("请先登录");
    }

    // 省市区列表构造
    let _province_list = {};
    let _city_list = {};
    let _county_list = {};
    tdist.getLev1().forEach((p) => {
      _province_list[p.id] = p.text;
      tdist.getLev2(p.id).forEach((c) => {
        _city_list[c.id] = c.text;
        tdist.getLev3(c.id).forEach((q) => (_county_list[q.id] = q.text));
      });
    });
    this.areaList.province_list = _province_list;
    this.areaList.city_list = _city_list;
    this.areaList.county_list = _county_list;

    const { addressId, type, from } = this.$route.query;
    this.addressId = addressId;
    this.type = type;
    this.from = from || "";

    if (type == "edit") {
      const params = {
        action: "get_default_address",
        phone: this.phone,
        address_id: addressId,
      };

      const result = await fet("/shopmall/web_route.php", params, "post");
      const data = result.data;
      const addressDetail = data.result;

      // const { data: addressDetail } = await getAddressDetail(addressId);

      let _areaCode = "";
      const province = tdist.getLev1();
      Object.entries(this.areaList.county_list).forEach(([id, text]) => {
        // 先找出当前对应的区
        if (text == addressDetail.county) {
          // 找到区对应的几个省份
          const provinceIndex = province.findIndex(
            (item) => item.id.substr(0, 2) == id.substr(0, 2)
          );
          // 找到区对应的几个市区
          const cityItem = Object.entries(this.areaList.city_list).filter(
            ([cityId, cityName]) => cityId.substr(0, 4) == id.substr(0, 4)
          )[0];
          // 对比找到的省份和接口返回的省份是否相等，因为有一些区会重名
          if (
            province[provinceIndex].text == addressDetail.province &&
            cityItem[1] == addressDetail.city
          ) {
            _areaCode = id;
          }
        }
      });
      this.addressInfo = {
        id: addressDetail.address_id,
        name: addressDetail.addressee,
        tel: addressDetail.phone,
        province: addressDetail.province,
        city: addressDetail.city,
        county: addressDetail.county,
        addressDetail: addressDetail.address,
        areaCode: _areaCode,
        isDefault: addressDetail.is_default == "1",
      };
    }
  },
  methods: {
    async onSave(content) {
      const params = {
        action: "address_save",
        phone: this.phone,
        addressee: content.name,
        telephone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        address: content.addressDetail,
        is_default: content.isDefault ? 1 : 0,
      };
      if (this.type == "edit") {
        params["address_id"] = this.addressId;
      }
      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;

      const code = data.code;

      if (code == 200) {
        Toast("保存成功");
        setTimeout(() => {
          this.$router.push({ path: `/mall/address?from=${this.from}` });
        }, 1000);
      }

      //   const { message } =
      //     (await this.type) == "add" ? addAddress(params) : EditAddress(params);
      //   Toast("保存成功");
      //   setTimeout(() => {
      //     this.$router.push({ path: `address?from=${this.from}` });
      //   }, 1000);
    },
    async onDelete() {
      const params = {
        action: "del_address",
        phone: this.phone,
        address_id: this.addressId,
      };

      const result = await fet("/shopmall/web_route.php", params, "post");
      const { data } = result;

      const code = data.code;

      if (code == 200) {
        Toast("删除成功");
        setTimeout(() => {
          this.$router.push({ path: `/mall/address` });
        }, 1000);
      }
      //   const { data } = await DeleteAddress(this.addressId);
      //   Toast("删除成功");
      //   setTimeout(() => {
      //     this.$router.push({ path: "address" });
      //   }, 1000);
    },
  },
};
</script>

<style lang="less">
@import "../../styles/mixin.less";
.address-edit-box {
  // margin-top: 44px;
  .van-address-edit {
    .van-button--danger {
      background: @primary;
      border-color: @primary;
    }
    .van-switch--on {
      background: @primary;
    }
  }
}
</style>
