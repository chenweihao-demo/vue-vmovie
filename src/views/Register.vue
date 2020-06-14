<template>
  <div class="register">
    <van-nav-bar title="登录" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-form @submit="register">
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
      <van-field
        v-model="pwd2"
        type="password"
        name="password"
        label="确认密码"
        placeholder="请输入密码"
        :rules="[{validator ,required: true, message: '请填写密码不一致' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import types from "@/store/TYPES";
import { Notify } from "vant";
export default {
  data() {
    return {
      username: "",
      password: "",
      pwd2: "",
      patternName: /^[\w\u4e00-\u9fa5]{1,10}$/,
      patternPwd: /^[A-Za-z]\w{5,15}$/
    };
  },
  computed: {
    // ...mapState({ userData: state => state.userData })
  },
  methods: {
    // 调用Mutation里的方法
    ...mapMutations([types.USER_DATA]),
    validator(val) {
      return val == this.password;
    },
    onClickLeft() {
      this.username = "";
      this.password = "";
      this.$router.back();
    },
    register(value) {
      if (this.registerUser(value)) {
        this.username = "";
        this.password = "";
        this.$router.back();
      }
    },
    // 设置用户数据
    setUserDataFn(v) {
      this.$store.commit(types.USER_DATA, { data: v });
    },
    // 用户注册
    registerUser(v) {
      let userStorage = JSON.parse(window.localStorage.getItem("userStorage"));
      if (userStorage) {
        let isFlay = userStorage.data.some(item => {
          return item.name == v.name;
        });
        if (isFlay) {
          Notify("账号已注册！");
          return false;
        } else {
            userStorage.data.push(v)
          window.localStorage.setItem(
            "userStorage",
            JSON.stringify({
              data: userStorage.data
            })
          );
          this.setUserDataFn(userStorage.data);
          Notify("注册成功，请返回！");
          return true;
        }
      } else {
        window.localStorage.setItem(
          "userStorage",
          JSON.stringify({
            data: [v]
          })
        );
        this.setUserDataFn([v]);
        Notify("注册成功，请返回！");
        return true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.register {
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