<template>
  <keep-alive>
    <div id="app">
      <div id="nav">
        <van-nav-bar border fixed :placeholder="true">
          <template #left>
            <div class="icon-img" @click="routeToDayCover">
              <span class="date">{{(data>=10)?data:'0'+data}}</span>
            </div>
          </template>
          <template #title>
            <van-tabs v-model="active" @click="navClickHandle">
              <van-tab title="发现" name="home"></van-tab>
              <van-tab title="频道" name="channel"></van-tab>
              <van-tab title="我的" name="profile"></van-tab>
            </van-tabs>
          </template>
          <template #right>
            <van-icon name="search" @click="routeToSearch" />
          </template>
        </van-nav-bar>
      </div>
      <router-view v-if="!$route.meta.isKeep"></router-view>
      <keep-alive>
        <router-view v-if="$route.meta.isKeep" />
      </keep-alive>
    </div>
  </keep-alive>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import types from "@/store/TYPES";
var data = new Date();
data = data.getDate();
export default {
  data() {
    return {
      active: "home",
      iconImg: import("./assets/icon/icon-calendar.png"),
      data: data
    };
  },
  computed: {
    ...mapState({ userData: state => state.userData })
  },
  created() {
    let userStorage = JSON.parse(window.localStorage.getItem("userStorage"));
    if (userStorage) {
      this.$store.commit(types.USER_DATA, { data: userStorage.data });
      this.verificationFn();
    }
  },
  mounted() {
    this.navClickHandle(this.active);
  },
  methods: {
    ...mapMutations([types.USER_DATA, types.USER]),
    // 路由跳转
    navClickHandle: function(name) {
      switch (name) {
        case "home":
          if (this.$route.path == "/") {
            return;
          }
          this.$router.push("/");
          break;
        case "channel":
          if (this.$route.path == "/channel") {
            return;
          }
          this.$router.push("/channel");
          break;
        case "profile":
          if (this.$route.path == "/profile") {
            return;
          }
          this.$router.push("/profile");
          break;
      }
    },
    // 跳转到每日好句
    routeToDayCover() {
      this.$router.push("/dayCover");
    },
    // 页面跳转到搜索页面
    routeToSearch() {
      this.$router.push("/search");
    },
    // 获取cooki
    getMessage(str, key) {
      var arr = str.split("; ");
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(key) > -1) {
          var newArr = arr[i].split("=");
          return JSON.parse(newArr[1]);
        }
      }
    },
    // 验证
    verificationFn() {
      let mycookie = this.getMessage(document.cookie, "_abc");
      let isName = this.userData.some(item => {
        return item.name == mycookie.name;
      });
      let isPwd = this.userData.some(item => {
        return item.password == mycookie.password;
      });
      if (isName && isPwd) {
        let user = JSON.parse(window.localStorage.getItem(mycookie.name));
        if (user) {
          this.$store.commit(types.USER, { data: user.data });
        }
      }
    }
  }
};
</script>
<style lang="less">
#nav {
  .van-nav-bar {
    background: black;
    color: white;
    .van-tabs__nav {
      background: none;
    }
    .van-tab {
      color: rgb(163, 163, 163);
      &.van-tab--active {
        color: white;
      }
      span {
        padding: 0 10px;
      }
    }
    .van-tabs__line {
      background-color: white;
    }
    .van-icon {
      font-size: 24px;
      color: white;
    }
    .icon-img {
      position: relative;
      width: 24px;
      height: 24px;
      background-image: url("./assets/icon/icon-calendar.png");
      background-size: 100%;
      .date {
        font-size: 10px;
        position: absolute;
        top: 3px;
        left: 0;
        width: 100%;
        height: 100%;
        padding-top: 6px;
        // font-weight: bold;
        transform: scale(0.8);
      }
    }
  }
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
#app .nav .van-nav-bar__placeholder /deep/.van-hairline--bottom::after {
  border-bottom-width: 0px !important;
}
/deep/.van-hairline--top-bottom::after,
/deep/.van-hairline--bottom::after {
  border-bottom-width: 0px !important;
}
.van-hairline--top-bottom::after {
  border-width: 0 !important;
}
.van-hairline--bottom::after {
  border-bottom-width: 0 !important;
}
</style>
