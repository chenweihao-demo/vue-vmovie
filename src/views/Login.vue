<template>
  <div class="login">
    <van-nav-bar title="登录" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-form @submit="onLogin">
      <van-field
        v-model="username"
        name="name"
        label="用户名"
        placeholder="用户名只支持字母、汉字、数字、_组合"
        :rules="[{ pattern:patternName,required: true, message: '请填写正确的格式' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码只支持字母、数字、_组合且首字符必须为字母"
        :rules="[{ pattern:patternPwd,required: true, message: '请填写正确的格式' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
    <div style="margin: 16px;">
      <van-button round block type="info" @click="register">注册</van-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import types from "@/store/TYPES";
import { Notify } from "vant";
export default {
  data() {
    return {
      username: "",
      password: "",
      patternName: /^[\w\u4e00-\u9fa5]{1,10}$/,
      patternPwd: /^[A-Za-z]\w{5,15}$/
    };
  },
  computed: {
    ...mapState({ userData: state => state.userData })
  },
  methods: {
    // 调用Mutation里的方法
    ...mapMutations([types.USER_DATA, types.USER]),
    onClickLeft() {
      this.$router.back();
    },
    // 设置个人信息
    setUser(name) {
      let user = JSON.parse(window.localStorage.getItem(name));
      if (user) {
        this.$store.commit(types.USER, { data: user.data });
      } else {
        let obj = {
          name: name,
          collection: [],
          seeHistory: []
        };
        window.localStorage.setItem(
          name,
          JSON.stringify({
            data: obj
          })
        );
        this.$store.commit(types.USER, { data: obj });
      }
    },
    // 登录
    onLogin(values) {
      let isName = this.userData.some(item => {
        return item.name == values.name;
      });
      let isPwd = this.userData.some(item => {
        return item.password == values.password;
      });
      if (!isName) {
        Notify("该用户不存在");
      } else if (!isPwd) {
        Notify("密码不正确");
      } else {
        Notify("登录成功");
        this.setUser(values.name);
        this.setCookie("_abc", JSON.stringify(values), 10080);
        this.$router.back();
      }
    },
    // 注册
    register() {
      this.$router.push("/register");
    },
    // 设置cookies
    setCookie(name, value, minutes) {
      var now = new Date();
      now.setMinutes(now.getMinutes() + minutes);

      // 设置cookie
      document.cookie = name + "=" + value + ";expires=" + now.toUTCString();
    }
  },
  created() {
    let userStorage = JSON.parse(window.localStorage.getItem("userStorage"));
    if (userStorage) {
      this.$store.commit(types.USER_DATA, { data: userStorage.data });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  top: 0;
  left: 0;
  background: #f7f7f7;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: auto;
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