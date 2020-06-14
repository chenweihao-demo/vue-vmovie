<template>
  <div class="dayCover">
    <div class="nav" @click="onClickBack">
      <van-icon name="cross" size="25" color="#fff" />
    </div>

    <div
      class="getDayCover"
      v-if="dayCoverData"
      :style="`background-image:url(${dayCoverData.image_blurred})`"
    >
      <div class="content-box">
        <div class="top-box" :style="`background-image:url(${dayCoverData.image})`">
          <div class="time">
            <div class="day">{{dayCoverData.time.day}}</div>
            <div class="day-box">
              <div class="month">{{dayCoverData.time.month}}</div>
              <div class="week">{{dayCoverData.time.week}}</div>
            </div>
          </div>
        </div>
        <div class="bottom-box">
          <div class="title">{{dayCoverData.title}}</div>
          <div class="content">{{dayCoverData.content}}</div>
          <!-- 分享 -->
          <div class="analysis" @click="showShare = true"></div>
        </div>
      </div>
    </div>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
  </div>
</template>

<script>
import { getDayCoverData } from "../api/daycover";
import { Toast } from "vant";
export default {
  data() {
    return {
      dayCoverData: null,
      showShare: false,
      options: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" }
      ],
      iconImg: import("../assets/icon/analysis.png")
    };
  },
  methods: {
    onSelect(option) {
      Toast(option.name);
      this.showShare = false;
    },
    getDayCover() {
      var dayCoverData = JSON.parse(
        window.localStorage.getItem("dayCoverData")
      );
      if (dayCoverData && dayCoverData.expires > Date.now()) {
        this.dayCoverData = dayCoverData.data;
      } else {
        getDayCoverData().then(response => {
          if (response.data.msg == "ok") {
            this.dayCoverData = response.data.data;
            window.localStorage.setItem(
              "dayCoverData",
              JSON.stringify({
                expires: Date.now() + 10 * 60 * 1000,
                data: response.data.data
              })
            );
          }
        });
      }
    },
    // 返回事件
    onClickBack() {
      this.$router.back();
    }
  },
  created() {
    this.getDayCover();
  }
};
</script>

<style lang="less" scoped>
.dayCover {
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  width: 100%;
  height: 100vh;
  z-index: 100;
  .nav {
    position: fixed;
    top: 20px;
    left: 20px;
  }
}
.getDayCover {
  width: 100%;
  height: 100vh;
  background-position: center center;
  padding: 86px 20px 40px;
  box-sizing: border-box;
}
.content-box {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: white;
  box-sizing: border-box;
  overflow: hidden;
}
.top-box {
  width: 100%;
  height: 60%;
  background-size: 100%;
  background-repeat: no-repeat;
  position: relative;
}
.top-box .time {
  position: absolute;
  bottom: 15px;
  left: 15px;
  color: white;
}
.top-box .time .day {
  display: inline-block;
  font-size: 28px;
  padding-right: 8px;
  /* border-right: 1px solid white; */
  position: relative;
}
.top-box .time .day::before {
  position: absolute;
  z-index: 2;
  content: "";
  top: 4px;
  left: 0;
  width: 100%;
  height: 68%;
  pointer-events: none;
  box-sizing: border-box;
  transform-origin: top left;
  border: 0 solid rgba(0, 0, 0, 0.1);
  /* transform: scale(0.333333); */
  border-right: 1px solid white;
  /* transform: scale(0.333333); */
}
.top-box .time .day-box {
  margin-left: 8px;
  float: right;
  display: flex;
  flex-direction: column;
}
.top-box .time .day-box .month {
  display: inline-block;
  font-size: 12px;
}
.top-box .time .day-box .week {
  display: inline-block;
  font-size: 12px;
}
.bottom-box {
  width: 100%;
  height: 40%;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  .analysis {
    width: 30px;
    height: 30px;
    position: absolute;
    bottom: 15px;
    left: 50%;
    margin-left: -15px;
    background-image: url("../assets/icon/analysis.png");
    background-size: 100%;
  }
}
.bottom-box .title {
  font-size: 14px;
  color: black;
  text-align: center;
  margin-bottom: 15px;
}

.bottom-box .content {
  font-size: 12px;
  color: black;
  white-space: pre-wrap;
  line-height: 2em;
}
/deep/.van-nav-bar__text,
/deep/.van-nav-bar__title,
.van-nav-bar /deep/.van-icon {
  color: white;
}
</style>