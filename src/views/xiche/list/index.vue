<template>
  <div class="pro_box">
    <!-- 头部搜索 -->
    <div class="sear_head">
      <img src="@/assets/images/xc-banner.png" class="xc-index" />
      <div class="sear_list flexbox">
        <div
          class="sr_item"
          :class="phoneShow == 2 ? 'active' : ''"
          @click="choosetype(2)"
        >
          <span>全部服务</span>
          <van-icon name="play" />
        </div>
        <div
          class="sr_item"
          :class="phoneShow == 3 ? 'active' : ''"
          @click="choosetype(3)"
        >
          <span>{{ searchInfo.orderByName }}</span>
          <van-icon name="play" />
        </div>
      </div>
      <div class="draw_item" v-if="phoneShow == 2">
        <div class="dw_titme">洗车</div>
        <div class="dw_box">
          <div class="dw_list" @click="changeService(81)">普通洗车(小车)</div>
          <div class="dw_list" @click="changeService(3000)">普通洗车(大车)</div>
          <div class="dw_list" @click="changeService(5264)">精致洗车</div>
        </div>
        <div class="dw_titme">美容</div>
        <div class="dw_box">
          <div class="dw_list" @click="changeService(82)">
            手工打蜡（小车型）
          </div>
          <div class="dw_list" @click="changeService(3020)">
            手工打蜡（大车型）
          </div>
          <div class="dw_list" @click="changeService(3023)">
            抛光打蜡（小车型）
          </div>
          <div class="dw_list" @click="changeService(3024)">
            抛光打蜡（大车型）
          </div>
          <div class="dw_list" @click="changeService(5017)">
            全套打蜡（小车型）
          </div>
          <div class="dw_list" @click="changeService(5018)">
            全套打蜡（大车型）
          </div>
          <div class="dw_list" @click="changeService(5261)">内饰清洗</div>
          <div class="dw_list" @click="changeService(4080)">空调清洗</div>
          <div class="dw_list" @click="changeService(4102)">
            臭氧杀菌（含洗车）
          </div>
          <div class="dw_list" @click="changeService(3001)">玻璃水</div>
        </div>
      </div>
      <div class="draw_item" v-if="phoneShow == 3">
        <div class="dw_item" @click="reloadList(1)">距离优先</div>
        <div class="dw_item" @click="reloadList(3)">好评优先</div>
        <div class="dw_item" @click="reloadList(2)">销量优先</div>
      </div>
    </div>
    <!-- 地址搜索 -->
    <div class="sear_adress flexbox" :class="mapShow ? 'show' : ''">
      <div class="adr_input flexbox">
        <input type="text" placeholder="搜索地点" />
        <div class="close_box" @click="closemapShow">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="adr_map">
        <img src="@/assets/images/map.png" alt style="width: 100%" />
      </div>
      <div class="adr_title">选择坐标图标所指位置</div>
      <div class="adr_list">
        <div class="scroll_box">
          <div class="adr_item">
            <div class="adr_name">上步工业区</div>
            <div class="adr_text">红荔路3007号</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="list_box">
      <div class="list_item" v-for="(item, key) in xclist" :key="key">
        <router-link
          :to="{
            path: '/xcdetails',
            query: {
              shopId: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
            },
          }"
          class="ls_go"
        ></router-link>
        <div class="ls_top flexbox">
          <div class="ls_l">
            <img :src="item.shop_img" alt class="ls_img" />
            <!-- 如果休息中显示 -->
            <div class="if_stop" v-show="!xclist[0].is_open">
              <span>休息中</span>
              <span>营业时间</span>
              <span>{{ item.start_opentime }}--{{ item.end_opentime }}</span>
            </div>
          </div>
          <div class="ls_m">
            <div class="flexbox f_jc_sb">
              <span class="p_name">{{ item.shop_name }}</span>
              <span class="c-blue">{{ $_toDistance(item.juli) }}</span>
            </div>
            <div class="p_cord flexbox">
              <div class="rank">{{ item.score }}</div>
              <div class="sale">已售 {{ item.total_num }}</div>
            </div>
            <div class="ls_bot flexbox">
              <van-icon name="location-o" />
              <div class="d_name">{{ item.shop_address }}</div>
              <img src="@/assets/images/icon-add.png" alt class="map_img" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let qs = require("qs");
import axios from "axios";
import { api } from "@/api/api";
export default {
  components: {},
  data() {
    return {
      // 打开搜索下拉
      phoneShow: 0,
      price: Infinity,
      discount: Infinity,
      // 打开搜索地址
      mapShow: false,
      xclist: [],
      searchInfo: {
        orderBy: 1,
        orderByName: "距离优先",
        serviceCode: "",
      },
    };
  },
  created() {
    this.getxclist();
  },
  methods: {
    changeService(num) {
      this.phoneShow = 0;
      this.searchInfo.serviceCode = num;
      this.getxclist();
    },
    reloadList(type) {
      this.phoneShow = 0;
      this.searchInfo.orderBy = type;
      if (type == 1) {
        this.searchInfo.orderByName = "距离优先";
      } else if (type == 2) {
        this.searchInfo.orderByName = "销量优先";
      } else if (type == 3) {
        this.searchInfo.orderByName = "好评优先";
      }
      this.getxclist();
    },
    async getxclist() {
      let latlon = JSON.parse(localStorage.getItem("latlon"));
      let res = await api.storesList({
        action: "get_shoplist",
        cityName: "深圳市",
        // lat:latlon.latitude,
        // lng:latlon.longitude,
        latitude: latlon.latitude,
        longitude: latlon.longitude,
        orderBy: this.searchInfo.orderBy,
        service_code: this.searchInfo.serviceCode,
        page: 1,
        pagesize: 100,
      });
      if (res.data.code == 200) {
        this.xclist = res.data.result;
      }
    },
    $_toDistance(distance) {
      if (!distance) {
        return "一键导航";
      }
      if (distance > 1) {
        let num = distance / 1000;
        return num.toFixed(2) + "km";
      } else {
        let num = distance / 1000;
        return num + "m";
      }
    },
    // 下拉筛选
    choosetype(e) {
      if (this.phoneShow == e) {
        this.phoneShow = 0;
      } else {
        this.phoneShow = e;
      }
      console.log(this.phoneShow);
    },

    // 关闭搜索地址
    closemapShow() {
      this.mapShow = false;
    },
    async getLogin() {
      let data = {
        action: "user_login",
        phone: 13631620136,
      };
      let res = axios.post(
        "http://car.shouchuangtx.cn/station/web_route.php",
        qs.stringify(data),
        "post"
      );
      if (res) {
        this.$message.warning("注册成功");
      } else {
        this.$message.warning(res.data.msg);
      }
    },
  },
  mounted() {
    // this.getLogin()
  },
};
</script>
<style scoped lang="less">
.xc-index {
  margin: 0 15px 15px;
  width: 345px;
  height: 75px;
  border-radius: 8px;
}
.flexbox {
  display: flex;
}

/* 搜索头部 */
.sear_list {
  height: 48px;
  display: flex;
  padding: 0 15px;
  align-items: center;
  z-index: 10;
}
.sear_head {
  position: fixed;
  width: 100%;
  background: #fff;
  z-index: 9;
  top: 0;
  left: 0;
}
.sr_item {
  flex: 1;
  display: flex;
  align-items: center;
  height: 33px;
  justify-content: center;
  background: #fafafa;
  color: #999;
  margin-right: 15px;
  font-size: 14px;
  border-radius: 5px;
}
.sr_item.active {
  color: #fff;
  background: #46b2ff;
  .van-icon-play {
    transform: rotate(-90deg);
  }
}
.sr_item:last-child {
  margin-right: 0;
}
.van-icon-play {
  transform: rotate(90deg);
}
.f_jc_sb {
  justify-content: space-between;
  align-items: center;
}
.c-blue {
  color: #46b2ff;
}
.draw_item {
  position: absolute;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #ececec;
  top: 100%;
  left: 0;
  box-sizing: border-box;
  padding: 4%;
}
.dw_item {
  padding-left: 5%;
  font-size: 2vh;
  line-height: 10vw;
}
.dw_item.on {
  color: #ff8d0a;
}
.dw_titme {
  font-size: 2.2vh;
  color: #999;
  margin-bottom: 3vw;
}
.dw_box {
  overflow: hidden;
}
.dw_list {
  float: left;
  width: 48%;
  margin-right: 2%;
  margin-bottom: 3vw;
  height: 8vw;
  line-height: 8vw;
  border-radius: 3px;
  background: #f6f6f6;
  text-align: center;
  font-size: 12px;
}
.dw_list.on {
  background: #ff8d0a;
  color: #fff;
}
/* 搜索头部 */

/* 地址搜索 */
.sear_adress {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 100%;
  left: 0;
  z-index: 10;
  background: #fff;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
}
.sear_adress.show {
  top: 0;
}
.adr_input {
  height: 10vw;
}
.adr_input input {
  width: 100%;
  height: 10vw;
  border: 0;
  background: #f2f2f2;
  text-align: center;
}
.adr_input .close_box {
  height: 10vw;
  width: 10vw;
  background: #ffbc00;
  color: #fff;
  text-align: center;
}
.adr_input .close_box i {
  font-size: 3vh;
  margin-top: 2vw;
}
.adr_title {
  font-size: 2.2vh;
  color: #747474;
  padding: 3% 0;
  margin: 0 3%;
  border-bottom: 1px solid #ececec;
}
.adr_list {
  -webkit-flex: 1;
  flex: 1;
  position: relative;
}
.scroll_box {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
}
.adr_item {
  margin: 0 3%;
  padding: 10px;
  border-bottom: 1px solid #ececec;
}
.adr_name {
  font-size: 2.2vh;
  color: #747474;
}
.adr_text {
  font-size: 1.6vh;
  color: #aaa;
  margin-top: 10px;
}
/* 地址搜索 */

/* 产品列表 */
.list_box {
  margin-top: 138px;
}
.list_item {
  margin: 15px 15px 0;
  position: relative;
  padding: 15px;
  box-shadow: 0 1.5px 4.5px 0 rgba(107, 215, 241, 0.19);
  border-radius: 10px;
}
.ls_go {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.ls_img {
  width: 40px;
  height: 40px;
  margin-right: 11px;
}
.if_stop {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-display: flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  justify-content: center;
  line-height: 1.2;
  align-items: center;
}
.if_stop span {
  font-size: 12px;
}
.ls_m {
  flex: 1;
}
.p_name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.p_cord {
  margin-top: 10px;
  -webkit-align-items: center;
  align-items: center;
}
.rank {
  font-size: 12px;
  color: #fff;
  padding: 3px 6px;
  border-radius: 3px;
  background: #ffbc00;
}
.sale {
  font-size: 12px;
  color: #747474;
  margin-left: 5px;
}
.dz {
  font-size: 12px;
  color: #aaa;
  padding: 3px 6px;
  border-radius: 3px;
  border: 1px solid #aaa;
}
.pay_num {
  font-size: 2vh;
  color: red;
  margin-top: 10px;
  text-align: right;
}
.ls_bot {
  margin-top: 10px;
  -webkit-align-items: center;
  align-items: center;
}
.d_name {
  font-size: 12px;
  color: #747474;
  margin-left: 10px;
  margin-right: 20px;
}
.map_img {
  width: 16px;
  height: 16px;
}
/* 产品列表 */
</style>
