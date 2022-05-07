<template>
  <div class="categray">
    <div>
      <!-- <header class="category-header wrap">
        <i class="nbicon nbfanhui" @click="goHome"></i>
        <div class="header-search">
          <i class="nbicon nbSearch"></i>
          <router-link
            tag="span"
            class="search-title"
            to="./product-list?from=category"
            >全场50元起步</router-link
          >
        </div>
        <i class="iconfont icon-More"></i>
      </header> -->
      <nav-bar></nav-bar>
      <div class="search-wrap" ref="searchWrap">
        <list-scroll :scroll-data="categoryData" class="nav-side-wrapper">
          <ul class="nav-side">
            <li
              v-for="item in categoryData"
              :key="item.category_id"
              v-text="item.category_name"
              :class="{ active: currentIndex == item.category_id }"
              @click="selectMenu(item.category_id)"
            ></li>
          </ul>
        </list-scroll>
        <div class="search-content">
          <list-scroll :scroll-data="goodsList">
            <div>
              <div
                class="product-item"
                v-for="(item, index) in goodsList"
                :key="index"
                @click="addCart(item)"
              >
                <img :src="prefix(item.goods_img)" />
                <div class="product-info">
                  <p class="name">{{ item.goods_name }}</p>
                  <p class="subtitle">{{ item.goods_remarks }}</p>

                  <div class="price-wrapper">
                    <span class="price">￥ {{ item.goods_price }}</span>
                    <span class="goods-stock"
                      >库存：{{ item.goods_stock }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </list-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navBar from "./components/NavBar";
import listScroll from "./components/ListScroll";
import { fet } from "@/api/constants.js";
// import { getCategory } from "../service/good";
export default {
  components: {
    navBar,
    listScroll,
  },
  data() {
    return {
      categoryData: [],
      goodsList: [
        {
          goods_id: "1",
          goods_price: "100",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "2",
          goods_name: "测试",
          goods_remarks: "测试测试测试测试测试测试",
          goods_stock: "10",
          ctime: "1651754649",
          status: "1",
        },
        {
          goods_id: "2",
          goods_price: "200",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "4",
          goods_name: "测试2",
          goods_remarks: null,
          goods_stock: "100",
          ctime: "1651840254",
          status: "1",
        },
        {
          goods_id: "3",
          goods_price: "12",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "3",
          goods_name: "葡萄",
          goods_remarks: null,
          goods_stock: "100",
          ctime: "1651840433",
          status: "0",
        },
        {
          goods_id: "4",
          goods_price: "210",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "2",
          goods_name: "香水",
          goods_remarks: null,
          goods_stock: "10",
          ctime: "1651840461",
          status: "0",
        },
        {
          goods_id: "5",
          goods_price: "210",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "2",
          goods_name: "香水",
          goods_remarks: null,
          goods_stock: "10",
          ctime: "1651840461",
          status: "0",
        },
        {
          goods_id: "6",
          goods_price: "210",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "2",
          goods_name: "香水",
          goods_remarks: null,
          goods_stock: "10",
          ctime: "1651840461",
          status: "0",
        },
        {
          goods_id: "7",
          goods_price: "210",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "2",
          goods_name: "香水",
          goods_remarks: null,
          goods_stock: "10",
          ctime: "1651840461",
          status: "0",
        },
        {
          goods_id: "8",
          goods_price: "210",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "2",
          goods_name: "香水",
          goods_remarks: null,
          goods_stock: "10",
          ctime: "1651840461",
          status: "0",
        },
        {
          goods_id: "9",
          goods_price: "210",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "2",
          goods_name: "香水",
          goods_remarks: null,
          goods_stock: "10",
          ctime: "1651840461",
          status: "0",
        },
        {
          goods_id: "99",
          goods_price: "210",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "2",
          goods_name: "香水",
          goods_remarks: null,
          goods_stock: "10",
          ctime: "1651840461",
          status: "0",
        },
        {
          goods_id: "422",
          goods_price: "210",
          goods_img:
            "https://newbee-mall.oss-cn-beijing.aliyuncs.com/images/watch-3-pro.png",
          category_id: "2",
          goods_name: "香水",
          goods_remarks: null,
          goods_stock: "10",
          ctime: "1651840461",
          status: "0",
        },
      ],
      currentIndex: 1,
    };
  },
  mounted() {
    this.setWrapHeight();
    // const { data } = await getCategory();
    // this.categoryData = data;
    this.getCategory();
  },
  methods: {
    async getCategory() {
      const params = {
        action: "get_categorylist",
      };
      const { data } = await fet("/shopmall/web_route.php", params, "post");
      console.log(data);
      this.categoryData = data.result || [];
    },
    setWrapHeight() {
      // 设置视口高度
      let $screenHeight = document.documentElement.clientHeight;
      this.$refs.searchWrap.style.height = $screenHeight - 50 + "px";
    },
    async selectMenu(id) {
      this.currentIndex = id;
      const params = {
        action: "get_goodslist",
        category_id: id,
      };
      const { data } = await fet("/shopmall/web_route.php", params, "post");
      this.goodsList = data.result || [];
    },
    selectProduct(item) {
      this.$router.push({ path: `product-list?categoryId=${item.categoryId}` });
    },
    //TODO 加入购物车
    addCart(record) {
      console.log(record);
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../styles/mixin.less";
.categray {
  .category-header {
    background: #fff;
    position: fixed;
    left: 0;
    top: 0;
    .fj();
    .wh(100%, 50px);
    line-height: 50px;
    padding: 0 15px;
    box-sizing: border-box;
    font-size: 15px;
    color: #656771;
    z-index: 10000;
    &.active {
      background: @primary;
    }
    .icon-left {
      font-size: 25px;
      font-weight: bold;
    }
    .header-search {
      display: flex;
      width: 80%;
      height: 20px;
      line-height: 20px;
      margin: 10px 0;
      padding: 5px 0;
      color: #232326;
      background: #f7f7f7;
      border-radius: 20px;
      .nbSearch {
        padding: 0 10px 0 20px;
        font-size: 17px;
      }
      .search-title {
        font-size: 12px;
        color: #666;
      }
    }
    .icon-More {
      font-size: 20px;
    }
  }
}
.search-wrap {
  .fj();
  width: 100%;
  // margin-top: 50px;
  background: #f8f8f8;
  border-top: 1px solid #999;
  .nav-side-wrapper {
    width: 28%;
    height: 100%;
    overflow: hidden;
    .nav-side {
      width: 100%;
      .boxSizing();
      background: #f8f8f8;
      li {
        width: 100%;
        height: 56px;
        text-align: center;
        line-height: 56px;
        font-size: 14px;
        &.active {
          color: @primary;
          background: #fff;
        }
      }
    }
  }
  .search-content {
    width: 72%;
    height: 100%;
    padding: 0 10px;
    background: #fff;
    .boxSizing();
    .swiper-container {
      width: 100%;
      .swiper-slide {
        width: 100%;
        .category-main-img {
          width: 100%;
        }
        .category-list {
          display: flex;
          flex-wrap: wrap;
          flex-shrink: 0;
          width: 100%;
          .catogory-title {
            width: 100%;
            font-size: 17px;
            font-weight: 500;
            padding: 20px 0;
          }
          // .product-item {
          //   width: 33.3333%;
          //   margin-bottom: 10px;
          //   text-align: center;
          //   font-size: 15px;
          //   .product-img {
          //     .wh(30px, 30px);
          //   }
          // }
        }
      }
    }
  }
}

.product-item {
  // .fj();
  display: flex;
  width: 100%;
  height: 80px;
  padding: 10px 0;
  border-bottom: 1px solid #dcdcdc;

  img {
    width: 80px;
    height: 80px;
    // padding: 0 10px;
    margin-right: 8px;
    .boxSizing();
  }
  .product-info {
    // width: 56%;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    height: 80px;
    padding: 5px;
    text-align: left;
    .boxSizing();
    p {
      margin: 0;
    }
    .name {
      width: 100%;
      max-height: 40px;
      line-height: 20px;
      font-size: 15px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .subtitle {
      width: 100%;
      max-height: 20px;
      // padding: 10px 0;
      line-height: 25px;
      font-size: 12px;
      color: #999;
      overflow: hidden;
    }
    .price {
      color: @primary;
      font-size: 16px;
    }

    .price-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-stock {
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>
