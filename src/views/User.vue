<template>
  <div class="user">
    <van-nav-bar title="登录" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="me" v-if="user">
      <img src="../assets/image/splash.jpg" alt />
      <div class="denglu">
        <van-icon size="50px" name="https://b.yzcdn.cn/vant/icon-demo-1126.png" />
        <div>{{user.name}}</div>
      </div>
    </div>
    <div style="margin: 16px;">
      <van-button round block type="info" @click="signOut">退出登录</van-button>
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import types from "@/store/TYPES";
export default {
  computed: {
    ...mapState({ user: state => state.user })
  },
  methods: {
    ...mapMutations([types.USER_DATA, types.USER]),
    onClickLeft() {
      this.$router.back();
    },
    signOut() {
      this.$router.back();
      this.$store.commit(types.USER, { data: null });
    }
  }
};
</script>

<style lang="less" scoped>
.user {
  position: fixed;
  top: 0;
  left: 0;
  background: #f7f7f7;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: auto;
}
.me {
  width: 100%;
  height: 36%;
  position: relative;
}

.me > img {
  width: 100%;
  filter: grayscale(100%);
}

.me .denglu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-45%, -60%);
  color: white;
  text-align: center;
}

.me .denglu .van-icon {
  display: block;
}

.me .denglu .van-icon .van-icon__image {
  border-radius: 50%;
  background-color: white;
}
.van-form {
  margin-top: 20px;
}
/deep/.van-nav-bar {
  background-color: black;
}
/deep/.van-nav-bar__text,
/deep/.van-nav-bar__title,
.van-nav-bar /deep/.van-icon {
  color: white;
}
.posts /deep/.van-hairline--bottom::after {
  border-bottom-width: 0px !important;
}
</style>