<template>
  <div class="me">
    <div class="me-box">
      <div class="header-me">
        <!-- <van-image style="width:100%" fit="cover" :src="img" /> -->
        <img src="../assets/image/splash.jpg" alt />
        <div class="denglu" @click="routeToLogin">
          <van-icon size="50px" name="https://b.yzcdn.cn/vant/icon-demo-1126.png" />
          <div>{{name}}</div>
        </div>
      </div>
      <div class="content-me">
        <div class="icon-line" @click="routeToLike">
          <div class="line-l">
            <van-icon name="like-o" size="16px" />
            <div class="title-line">我的喜欢</div>
          </div>
          <div class="line-r">
            <van-icon name="arrow" />
          </div>
        </div>

        <div class="icon-line">
          <div class="line-l" @click="routerToHistory">
            <van-icon name="clock-o" size="16px" />
            <div class="title-line">播放历史</div>
          </div>
          <div class="line-r">
            <van-icon name="arrow" />
          </div>
        </div>

        <div class="icon-line">
          <div class="line-l" @click="Tips">
            <van-icon name="down" size="16px" />
            <div class="title-line">离线缓存</div>
          </div>
          <div class="line-r">
            <van-icon name="arrow" />
          </div>
        </div>

        <div class="icon-line">
          <div class="line-l" @click="Tips">
            <van-icon name="smile-comment-o" size="16px" />
            <div class="title-line">我的消息</div>
          </div>
          <div class="line-r">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div class="fooder-me">
        <div class="icon-line" @click="Tips">
          <div class="line-l">
            <van-icon name="setting-o" size="16px" />
            <div class="title-line">设置</div>
          </div>
          <div class="line-r">
            <van-icon name="arrow" />
          </div>
        </div>

        <div class="icon-line">
          <div class="line-l" @click="Tips">
            <van-icon name="edit" size="16px" />
            <div class="title-line">问题反馈</div>
          </div>
          <div class="line-r">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Toast } from "vant";
export default {
  data() {
    return {
      img: import("../assets/image/splash.jpg"),
      name: "点击登录"
    };
  },
  computed: {
    ...mapState({ user: state => state.user })
  },
  methods: {
    Tips() {
      Toast("功能未完善，请见谅！");
    },
    routeToLogin() {
      if (this.name == "点击登录") {
        this.$router.push("/login");
      } else {
        this.$router.push("/user");
      }
    },
    routeToLike() {
      if (this.user) {
        this.$router.push("/like");
      } else {
        Toast("用户未登陆！");
      }
    },
    routerToHistory() {
      if (this.user) {
        this.$router.push("/history");
      } else {
        Toast("用户未登陆！");
      }
    }
  },
  created() {
    if (this.user) {
      this.name = this.user.name;
    } else {
      this.name = "点击登录";
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.me-box {
  width: 100%;
  height: 91vh;
  background-color: black;
}

.me-box .header-me {
  width: 100%;
  height: 36%;
  position: relative;
}

.me-box .header-me > img {
  width: 100%;
  filter: grayscale(100%) brightness(0.6);
}

.me-box .header-me .denglu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-45%, -60%);
  color: white;
  text-align: center;
}

.me-box .header-me .denglu .van-icon {
  display: block;
}

.me-box .header-me .denglu .van-icon .van-icon__image {
  border-radius: 50%;
  background-color: white;
}

.icon-line {
  width: 100%;
  display: flex;
  background-color: #1a1a1a;
  color: white;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
}
.icon-line::before {
  position: absolute;
  z-index: 2;
  content: "";
  top: 0;
  left: 0;
  width: 300%;
  height: 300%;
  pointer-events: none;
  box-sizing: border-box;
  transform-origin: top left;
  border: 0 solid rgba(0, 0, 0, 0.1);
  transform: scale(0.333333);
  border-bottom: 1px solid rgba(38, 38, 38, 0.796);
  transform: scale(0.333333);
}

.icon-line .line-l {
  flex: 1;
  display: flex;
}

.icon-line .line-l .title-line {
  display: inline-block;
  padding-left: 12px;
}

.icon-line .line-r {
  display: inline-block;
  padding-top: 3px;
}
.fooder-me {
  margin-top: 30px;
}
</style>