import wx from "weixin-js-sdk";
import { getJSSDK } from "@/api/wx";
import router from "@/router";
const wxShare = () => {
  return new Promise((resolve, reject) => {
    if (!isWeixinBrowser()) {
      return;
    }
    let url = encodeURIComponent(
      window.location.origin + router.currentRoute.fullPath
    );
    getJSSDK(url).then((data) => {
      if (data) {
        sessionStorage.shareSignature = JSON.stringify(data.data);
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        wx.config({
          debug: false,
          appId: "wx0868730ab0460a87",
          timestamp: data.data.timestamp,
          nonceStr: data.data.nonceStr,
          signature: data.data.signature,
          jsApiList: [
            "checkJsApi",
            "onMenuShareTimeline",
            "onMenuShareAppMessage",
            "getLocation",
            "hideMenuItems",
            "chooseWXPay",
          ],
        });
        wx.onMenuShareTimeline({
          link:
            "http://h5.shouchuangtx.cn/#/?inviteCode=" + userInfo.invite_code,
          title: "刚发现一个神器，用它去加油能打9折，不需要充值",
          desc: "直接去加油站支付油费就可以，我刚加一次油便宜了几十",
          imgUrl:
            "https://shengxin-static.oss-cn-shenzhen.aliyuncs.com/images/vehicle/life/img-share-thumb.png",
          success: function () {},
        });
        wx.onMenuShareAppMessage({
          link:
            "http://h5.shouchuangtx.cn/#/?inviteCode=" + userInfo.invite_code,
          title: "刚发现一个神器，用它去加油能打9折，不需要充值",
          desc: "直接去加油站支付油费就可以，我刚加一次油便宜了几十",
          imgUrl:
            "https://shengxin-static.oss-cn-shenzhen.aliyuncs.com/images/vehicle/life/img-share-thumb.png",
          success: function () {},
        });
        resolve();
      }
      // TODO
      // else if (data && data.data.code == 401) {
      //   localStorage.clear();
      //   sessionStorage.clear();
      //   window.location.reload();
      // }
      else {
        alert(JSON.stringify(data));
      }
    });
  });
};

function isWeixinBrowser() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    console.info("非微信浏览器");
    return false;
  }
}
export default wxShare;
