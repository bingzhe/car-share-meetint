<template>
  <div>
    <!-- <header class="home-header wrap" :class="{ active: headerScroll }">
      <router-link tag="i" to="./category"
        ><i class="nbicon nbmenu2"></i
      ></router-link>
      <div class="header-search">
        <span class="app-name">新蜂商城</span>
        <i class="iconfont icon-search"></i>
        <router-link
          tag="span"
          class="search-title"
          to="./product-list?from=home"
          >山河无恙，人间皆安</router-link
        >
      </div>
      <router-link class="login" tag="span" to="./login" v-if="!isLogin"
        >登录</router-link
      >
      <router-link class="login" tag="span" to="./user" v-else>
        <van-icon name="manager-o" />
      </router-link>
    </header> -->
    <nav-bar></nav-bar>
    <swiper :list="swiperList"></swiper>
    <!-- <div class="category-list">
      <div v-for="item in categoryList" v-bind:key="item.categoryId">
        <img :src="item.imgUrl" />
        <span>{{ item.name }}</span>
      </div>
    </div> -->
    <div class="good">
      <header class="good-header">新品上线</header>
      <div class="good-box">
        <div
          class="good-item"
          v-for="item in newGoodses"
          :key="item.goodsId"
          @click="goToDetail(item)"
        >
          <img :src="prefix(item.goodsCoverImg)" alt="" />
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="good">
      <header class="good-header">热门商品</header>
      <div class="good-box">
        <div
          class="good-item"
          v-for="item in hots"
          :key="item.goodsId"
          @click="goToDetail(item)"
        >
          <img :src="prefix(item.goodsCoverImg)" alt="" />
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="good" :style="{ paddingBottom: '100px' }">
      <header class="good-header">最新推荐</header>
      <div class="good-box">
        <div
          class="good-item"
          v-for="item in recommends"
          :key="item.goodsId"
          @click="goToDetail(item)"
        >
          <img :src="prefix(item.goodsCoverImg)" alt="" />
          <div class="good-desc">
            <div class="title">{{ item.goodsName }}</div>
            <div class="price">¥ {{ item.sellingPrice }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "./components/NavBar";
import swiper from "./components/Swiper";
// import { getHome } from "../service/home";
// import { getUserInfo } from "../service/user";
import { getLocal } from "@/util/util";
import { Toast } from "vant";
export default {
  name: "home",
  data() {
    return {
      //TODO
      swiperList: [
        {
          carouselUrl:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/banner-p50-pocket.png",
          redirectUrl: "https://juejin.im/book/6844733826191589390",
        },
        {
          carouselUrl:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/banner-iphone13.png",
          redirectUrl: "https://juejin.im/book/6844733826191589390",
        },
        {
          carouselUrl:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/banner-mate40.png",
          redirectUrl: "https://juejin.im/book/6844733826191589390",
        },
      ],
      isLogin: false,
      headerScroll: false,
      hots: [
        {
          goodsId: 10918,
          goodsName: "Apple AirPods (第三代)",
          goodsIntro: "AirPods第三代搭载空间音频和自适应均衡...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/MME73_AV4_GEO_CN.jpeg",
          sellingPrice: 1399,
          tag: "美妙新声",
        },
        {
          goodsId: 10908,
          goodsName: "HUAWEI Mate 40 Pro 全网通5G手机 8GB...",
          goodsIntro: "5nm麒麟9000旗舰芯片 | 超感光徕卡电...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/mate40-white.png",
          sellingPrice: 6488,
          tag: "跃见非凡",
        },
        {
          goodsId: 10906,
          goodsName: "Apple iPhone12 Pro (A2408) 128...",
          goodsIntro: "A14仿生芯片，6.1英寸超视网膜XDR显示...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/iphone-12-pro-blue-hero.png",
          sellingPrice: 8499,
          tag: "自我再飞跃",
        },
        {
          goodsId: 10902,
          goodsName: "华为 HUAWEI P40 冰霜银 全网通5G手机",
          goodsIntro: "麒麟990 5G SoC芯片 5000万超感...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/p40-silver.png",
          sellingPrice: 4299,
          tag: "超感知影像",
        },
      ],
      newGoodses: [
        {
          goodsId: 10925,
          goodsName: "HUAWEI P50 Pocket 4G全网通 超光谱影像系...",
          goodsIntro: "华为P50Pocket新品，华为年度旗舰折叠...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/p50-pocket-gold.png",
          sellingPrice: 10988,
          tag: "折叠万象",
        },
        {
          goodsId: 10926,
          goodsName: "华为笔记本电脑MateBook X Pro 2022",
          goodsIntro: "原色全面屏，轻薄高能，超级终端",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/MateBook%20X%20Pro.png",
          sellingPrice: 10499,
          tag: "入目惊鸿",
        },
        {
          goodsId: 10915,
          goodsName: "Apple iPhone 13 (A2634) 256GB ...",
          goodsIntro: "解锁超能力！超先进双摄系统，超强耐用性，超劲...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/iphone-13-pink-select-2021.png",
          sellingPrice: 6799,
          tag: "解锁超能力",
        },
        {
          goodsId: 10920,
          goodsName: "MacBook Pro 16英寸 M1 Pro芯片",
          goodsIntro: "16G 512G 银色。M1Pro和M1Ma...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/mbp16-silver-select-202110_GEO_CN.jpeg",
          sellingPrice: 18999,
          tag: "强者的强",
        },
        {
          goodsId: 10921,
          goodsName: "HUAWEI P50 Pro 4G全网通 8GB+512GB...",
          goodsIntro: "麒麟9000芯片,万象双环设计",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/p50-gold.png",
          sellingPrice: 7488,
          tag: "万象新生",
        },
      ],
      recommends: [
        {
          goodsId: 10922,
          goodsName: "HUAWEI P50 雪域白",
          goodsIntro: "骁龙888,4G全网通,原色双影像单元,万象...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/p50-white.png",
          sellingPrice: 4488,
          tag: "万象新生",
        },
        {
          goodsId: 10930,
          goodsName: "华为FreeBuds Pro无线耳机",
          goodsIntro: "主动降噪真无线蓝牙耳机/入耳式耳机/环境音/...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/freebuds-pro.png",
          sellingPrice: 749,
          tag: "动态降噪 听我想听",
        },
        {
          goodsId: 10916,
          goodsName: "Apple iPhone 13 Pro 远峰蓝色",
          goodsIntro: "自适应高刷新率，画面更流畅、响应更灵敏，电影...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/iphone-13-pro-family-hero.png",
          sellingPrice: 7999,
          tag: "强得很",
        },
        {
          goodsId: 10927,
          goodsName: "HUAWEI MatePad Pro 12.6英寸",
          goodsIntro: "8+256GB WIFI曜石灰 麒麟9000...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/matepad-pro.png",
          sellingPrice: 4699,
          tag: "创造无界",
        },
        {
          goodsId: 10920,
          goodsName: "MacBook Pro 16英寸 M1 Pro芯片",
          goodsIntro: "16G 512G 银色。M1Pro和M1Ma...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/mbp16-silver-select-202110_GEO_CN.jpeg",
          sellingPrice: 18999,
          tag: "强者的强",
        },
        {
          goodsId: 10929,
          goodsName: "华为 HUAWEI Sound X 2021",
          goodsIntro: "智能音箱幻彩光随声动",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/soundx.png",
          sellingPrice: 2199,
          tag: "声声出色",
        },
        {
          goodsId: 10928,
          goodsName: "HUAWEI WATCH 3 Pro智能手表",
          goodsIntro: "运动智能手表 尊享款 eSIM独立通话强劲续...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          sellingPrice: 3899,
          tag: "一表万象",
        },
        {
          goodsId: 10233,
          goodsName: "纪梵希高定香榭天鹅绒唇膏306#",
          goodsIntro: "(小羊皮口红 法式红 雾面哑光 持久锁色）新...",
          goodsCoverImg: "/goods-img/04949c0e-87df-445b-96dd-29e7fc69f734.jpg",
          sellingPrice: 355,
          tag: "雾面哑光 持久锁色",
        },
        {
          goodsId: 10907,
          goodsName: "HUAWEI Mate 40 Pro 全网通5G手机 8GB...",
          goodsIntro: "5nm麒麟9000旗舰芯片 | 超感光徕卡电...",
          goodsCoverImg:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/mate40-silver.png",
          sellingPrice: 6488,
          tag: "跃见非凡",
        },
        {
          goodsId: 10154,
          goodsName: "无印良品 MUJI 塑料浴室座椅",
          goodsIntro: "原色",
          goodsCoverImg: "/goods-img/15395057-94e9-4545-a8ee-8aee025f40c5.jpg",
          sellingPrice: 85,
          tag: "无印良品",
        },
      ],
      categoryList: [
        {
          name: "新蜂超市",
          imgUrl: "//s.weituibao.com/1583585285461/cs.png",
          categoryId: 100001,
        },
        {
          name: "新蜂服饰",
          imgUrl: "//s.weituibao.com/1583585285468/fs.png",
          categoryId: 100003,
        },
        {
          name: "全球购",
          imgUrl: "//s.weituibao.com/1583585285470/qq.png",
          categoryId: 100002,
        },
        {
          name: "新蜂生鲜",
          imgUrl: "//s.weituibao.com/1583585285472/sx.png",
          categoryId: 100004,
        },
        {
          name: "新蜂到家",
          imgUrl: "//s.weituibao.com/1583585285467/dj.png",
          categoryId: 100005,
        },
        {
          name: "充值缴费",
          imgUrl: "//s.weituibao.com/1583585285465/cz.png",
          categoryId: 100006,
        },
        {
          name: "9.9元拼",
          imgUrl: "//s.weituibao.com/1583585285469/pt.png",
          categoryId: 100007,
        },
        {
          name: "领劵",
          imgUrl: "//s.weituibao.com/1583585285468/juan.png",
          categoryId: 100008,
        },
        {
          name: "省钱",
          imgUrl: "//s.weituibao.com/1583585285471/sq.png",
          categoryId: 100009,
        },
        {
          name: "全部",
          imgUrl: "//s.weituibao.com/1583585285470/qb.png",
          categoryId: 100010,
        },
      ],
    };
  },
  components: {
    navBar,
    swiper,
  },
  async mounted() {
    const token = getLocal("token");
    if (token) {
      this.isLogin = true;
    }
    window.addEventListener("scroll", this.pageScroll);
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
    });
    // const { data } = await getHome();
    // this.swiperList = data.carousels;
    // this.newGoodses = data.newGoodses;
    // this.hots = data.hotGoodses;
    // this.recommends = data.recommendGoodses;
    Toast.clear();
  },
  methods: {
    pageScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      scrollTop > 100
        ? (this.headerScroll = true)
        : (this.headerScroll = false);
    },
    goToDetail(item) {
      this.$router.push({ path: `product/${item.goodsId}` });
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../styles/mixin.less";
.home-header {
  position: fixed;
  left: 0;
  top: 0;
  .wh(100%, 50px);
  .fj();
  line-height: 50px;
  padding: 0 15px;
  .boxSizing();
  font-size: 15px;
  color: #fff;
  z-index: 10000;
  .nbmenu2 {
    color: @primary;
  }
  &.active {
    background: @primary;
    .nbmenu2 {
      color: #fff;
    }
    .login {
      color: #fff;
    }
  }

  .header-search {
    display: flex;
    .wh(74%, 20px);
    line-height: 20px;
    margin: 10px 0;
    padding: 5px 0;
    color: #232326;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    .app-name {
      padding: 0 10px;
      color: @primary;
      font-size: 20px;
      font-weight: bold;
      border-right: 1px solid #666;
    }
    .icon-search {
      padding: 0 10px;
      font-size: 17px;
    }
    .search-title {
      font-size: 12px;
      color: #666;
      line-height: 21px;
    }
  }
  .icon-iconyonghu {
    color: #fff;
    font-size: 22px;
  }
  .login {
    color: @primary;
    line-height: 52px;
    .van-icon-manager-o {
      font-size: 20px;
      vertical-align: -3px;
    }
  }
}
.category-list {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  width: 100%;
  padding-bottom: 13px;
  div {
    display: flex;
    flex-direction: column;
    width: 20%;
    text-align: center;
    img {
      .wh(40px, 40px);
      margin: 13px auto 8px auto;
    }
  }
}
.good {
  .good-header {
    background: #f9f9f9;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: @primary;
    font-size: 18px;
    font-weight: 500;
  }
  .good-box {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .good-item {
      box-sizing: border-box;
      width: 50%;
      border-bottom: 1px solid #e9e9e9;
      padding: 10px 10px;
      img {
        display: block;
        width: 120px;
        margin: 0 auto;
      }
      .good-desc {
        text-align: center;
        font-size: 16px;
        padding: 10px 0;
        .title {
          color: #222333;
        }
        .price {
          color: @primary;
        }
      }
      &:nth-child(2n + 1) {
        border-right: 1px solid #e9e9e9;
      }
    }
  }
}
.floor-list {
  width: 100%;
  padding-bottom: 50px;
  .floor-head {
    width: 100%;
    height: 40px;
    background: #f6f6f6;
  }
  .floor-content {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    .boxSizing();
    .floor-category {
      width: 50%;
      padding: 10px;
      border-right: 1px solid #dcdcdc;
      border-bottom: 1px solid #dcdcdc;
      .boxSizing();
      &:nth-child(2n) {
        border-right: none;
      }
      p {
        font-size: 17px;
        color: #333;
        &:nth-child(2) {
          padding: 5px 0;
          font-size: 13px;
          color: @primary;
        }
      }
      .floor-products {
        .fj();
        width: 100%;
        img {
          .wh(65px, 65px);
        }
      }
    }
  }
}
</style>
