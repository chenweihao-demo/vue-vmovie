<template>
    <div class="home">
      <!-- 轮播图 -->
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <template v-if="banner">
          <van-swipe-item
            v-for="(item,index) in banner.list"
            :key="index"
            @click="toRouterFn(item,$event)"
          >
            <img :src="item.image" alt />
          </van-swipe-item>
        </template>
      </van-swipe>
      <!-- 今日 -->
      <HomeSection v-if="today" :items="today.list">今日</HomeSection>
      <!-- 热门 -->
      <HomeSection v-if="hot" :items="hot.list" :special="true">热门</HomeSection>
      <!-- 专题 -->
      <HomeSection v-if="album" :items="album.list">专题</HomeSection>
      <!-- posts -->
      <HomeSection v-if="posts" :items="posts.list">{{posts.selection_title}}</HomeSection>
      <!-- history -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="immediatecheck"
        @load="onLoad"
      >
        <section v-for="(somedayData, index) in historyData" :key="index">
          <HomeSection :items="somedayData.list">{{somedayData.selection_title}}</HomeSection>
        </section>
      </van-list>
      <div class="loading" v-if="isLoad&&Rendering">
        <van-loading />
      </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import { mapState, mapActions } from "vuex";
import types from "@/store/TYPES";
import HomeSection from "@/components/HomeSection.vue";
// import { getIndexPosts } from "../api/home";


export default {
  name: "Home",
  data: function() {
    return {
      list: [],
      isLoad:true,
      loading: false,
      finished: false,
      immediatecheck: false,
      Rendering:true,
    };
  },
  components: {
    HomeSection
  },
  computed: {
    ...mapState({
      banner: state => state.indexData.banner,
      album: state => state.indexData.album,
      hot: state => state.indexData.hot,
      posts: state => state.indexData.posts,
      today: state => state.indexData.today,
      historyData: state => state.historyData
    })
  },
  methods: {
    ...mapActions([types.INIT_INDEX_DATA, types.GET_MORE_HISTORY_DATA]),
    // 上拉加载数据
    onLoad() {
      this.GET_MORE_HISTORY_DATA((context, response) => {
        this.loading = false;
        if (response.data.msg == "ok") {
          context.commit(types.GET_MORE_HISTORY_DATA, {
            data: response.data.data
          });
        }
      });
    },
    // 轮播图跳转到播放页面
    toRouterFn(v, event) {
      event
      this.$router.push({
        path: "Play",
        query: { postid: v.extra_data.app_banner_param, img: v.image, top: 46 }
      });
    }
  },
  created() {
    this.INIT_INDEX_DATA(()=>{
      this.isLoad=false;
    });
  },
  mounted(){
    this.Rendering=false;
  }
};
</script>
<style lang="less" scoped>
.home {
  // background-color: black;
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
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  text-align: center;
  background-color: #39a9ed;
  img {
    max-width: 100%;
    vertical-align: middle;
  }
}
</style>
