<template>
  <div class="history">
    <van-nav-bar title="播放历史" left-text="返回" :fixed="true" :placeholder="true" left-arrow @click-left="onClickLeft" />
    <SmallCard v-for="(item,index) in user.seeHistory" :key="index" :post="item"></SmallCard>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SmallCard from "../components/SmallCard";
export default {
  methods: {
    onClickLeft() {
      this.$router.back();
    }
  },
   computed: {
    ...mapState({ user: state => state.user })
  },
  components: {
    SmallCard
  }
};
</script>

<style lang="less" scoped>
.history {
  position: fixed;
  top: 0;
  left: 0;
  background: #f7f7f7;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: auto;
}
/deep/.van-nav-bar {
  background-color: black;
}
/deep/.van-nav-bar__text,
/deep/.van-nav-bar__title,
 /deep/.van-nav-bar /deep/.van-icon {
  color: white;
}
.posts /deep/.van-hairline--bottom::after {
  border-bottom-width: 0px !important;
}
</style>