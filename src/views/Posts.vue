<template>
  <div class="posts">
    <van-nav-bar :fixed="true" :title="title" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="posts-box">
      <Postcard v-for="(item,index) in recdata" :key="index" :post="item"></Postcard>
      <van-list
        v-model="loading"
        :finished="finished"
        :immediate-check="immediatecheck"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <Postcard v-for="(item,index) in posts" :key="index" :post="item"></Postcard>
      </van-list>
      <van-loading size="18px" text-size="10px" color="#1989fa" v-if="showLoading">加载中...</van-loading>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import types from "@/store/TYPES";
import { Notify } from "vant";
import Postcard from "../components/Postcard";
export default {
  data() {
    return {
      title: "",
      page: 1,
      // page: 119,
      posts: [],
      showLoading: true,
      hasMore: false,
      loading: false,
      finished: false,
      immediatecheck: false,
      Rendering: true
    };
  },
  computed: {
    ...mapState({ recdata: state => state.postsData })
  },
  methods: {
    // 调用Mutation里的方法
    ...mapMutations([types.GET_POSTS_DATA]),
    // 调用action里的方法
    ...mapActions([types.GET_POSTS_DATA]),
    // 获取详细数据
    getPostsByRecdata(recdata) {
      let url = isNaN(recdata)
        ? `/apiv3/post/getPostByTab?p=${this.page}&size=10&tab=${recdata}`
        : `/apiv3/post/getPostInCate?p=${this.page}&size=10&cateid=${recdata}`;
      this.GET_POSTS_DATA({
        url: url,
        recdata: recdata,
        page: this.page,
        callback: (context, response) => {
          this.loading = false;
          this.showLoading = false;
          if (response.length) {
            this.posts = response;
          } else {
            if (this.page > 1) {
              this.posts = [...this.posts, ...response.data.data];
            }
            if (response.data.msg !== "OK") {
              // 没有更多内容了
              Notify("没有更多内容了");
              this.hasMore = true;
            }
          }
        }
      });
    },
    // 上拉加载更多数据数据
    onLoad() {
      this.page = this.page + 1;
      let recdata = this.$route.query.recdata;
      if (this.hasMore) {
        Notify("没有更多内容");
        this.finished = true;
      } else {
        this.page = this.page + 1;
        this.getPostsByRecdata(recdata);
      }
    },
    // 返回事件
    onClickLeft() {
      this.$router.back();
      this.$store.commit(types.GET_POSTS_DATA, { data: {} });
    }
  },
  created() {
    // let recdata = this.$route.query.recdata;
    // this.title = this.$route.query.title;
    // this.getPostsByRecdata(recdata);
  },
  mounted() {},
  // 路由守卫
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      let recdata = vm.$route.query.recdata;
      vm.title = vm.$route.query.title;
      vm.getPostsByRecdata(recdata);
    });
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$store.commit(types.GET_POSTS_DATA, { data: {} });
  //   next();
  // },
  components: {
    Postcard
  }
};
</script>

<style lang="less" scoped>
.posts {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f7f7f7;
  z-index: 2;
  overflow: auto;
  .posts-box{
    margin-top: 46px;
  }
}
/deep/.van-loading {
  width: 100%;
  text-align: center;
  padding: 5px 0;
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