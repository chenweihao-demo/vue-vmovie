<template>
  <keep-alive>
    <div class="channel">
      <van-grid column-num="2" :border="false" square>
        <van-grid-item
          use-slot
          v-for="(item,index) in cateList"
          :key="index"
          @click="toRouterFn(item)"
        >
          <van-image style="width:100%" fit="cover"  lazy-load :src="item.icon" />
          <div>
            <span># {{item.catename}} #</span>
          </div>
        </van-grid-item>
      </van-grid>
      <div class="loading" v-if="isLoad">
        <van-loading />
      </div>
    </div>
  </keep-alive>
</template>

<script>
import { mapState, mapActions } from "vuex";
import types from "@/store/TYPES";
export default {
  data() {
    return { isLoad: true };
  },
  computed: {
    ...mapState({
      cateList: state => state.channelData
    })
  },
  methods: {
    ...mapActions([types.INIT_CHANNEL_DATA]),
    toRouterFn(v) {
      let data = v.tab ? v.tab : v.cateid;
      this.$router.push({
        path: "/posts",
        query: { recdata: data, title: v.catename }
      });
    }
  },
  created() {
    this.INIT_CHANNEL_DATA(() => {
      this.isLoad = false;
    });
    
  }
};
</script>

<style lang="less" scoped>
// /deep/
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.van-grid /deep/.van-grid-item__content--square {
  padding: 0;
}

/deep/.van-grid-item {
  position: relative;
}

.van-grid-item /deep/.van-image {
  filter: brightness(0.6);
}

.van-grid-item div {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.van-grid-item div span {
  color: white;
  font-weight: bold;
}
</style>