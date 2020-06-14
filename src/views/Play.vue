<template>
  <div class="play">
    <!-- 返回 -->
    <div class="back" @click="onClickBack">
      <van-icon size="20" name="arrow-left" />
    </div>
    <div class="play-box">
      <!-- 视频播放 -->
      <div class="wrap-box">
        <div class="vo-box">
          <div class="vide-box" v-show="!isLoad">
            <!-- <video
              v-if="!isLoad"
              :src="postView.content_video[0].progressive[0].https_url"
              controls
            ></video>-->
            <Videoer v-if="!isLoad&&isVodeo" :post="postView"></Videoer>
          </div>
          <transition
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            v-bind:css="false"
          >
            <div class="img-box" v-if="isImg">
              <img class="vo-img" :src="img" alt />
            </div>
          </transition>
        </div>
      </div>
      <!-- 内容 -->
      <div class="play-content" v-show="!isLoad">
        <div class="content-big" v-if="!isLoad">
          <!-- 简介 -->
          <div class="introduce" v-if="postView.title">
            <h4 class="title">{{postView.title}}</h4>
            <div class="info">{{postView.cate[0]}} / {{parseTime(postView.duration)}}</div>
            <div class="content">{{postView.intro}}</div>
            <div class="more">阅读全文→</div>
          </div>
          <!-- 作者 -->
          <div class="author" v-if="postView.author">
            <div class="pic">
              <img :src="postView.author.profile.avatar" />
            </div>
            <div class="author-info">
              <div class="name">{{postView.author.profile.username}}</div>
              <div class="occupation" v-if="postView.author.roles">片中职位：{{postView.author.roles}}</div>
            </div>
            <div class="icon-more">
              <van-icon name="arrow" />
            </div>
          </div>
          <!-- 相似推荐 -->
          <div class="recommend" v-if="postView.relate_video">
            <div class="recommend-warp" v-for="(item, index) in postView.relate_video" :key="index">
              <h4 class="h3">{{item.name}}</h4>
              <div class="roll-box" :id="'roll'+index">
                <div
                  class="card"
                  v-for="(card, idx) in item.list"
                  :key="idx"
                  @click="toRouterFn(card,$event)"
                >
                  <!-- <img :src="card.image" alt /> -->
                   <van-image style="width:100%"  fit="cover" :src="card.image" />
                  <div class="content">
                    <div class="time">{{parseTime(card.duration)}}</div>
                    <div class="title">{{card.title}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--  评论  -->
          <div class="comment-play" v-if="postView.comment.list">
            <div class="total">{{postView.comment.total}} 条评论</div>
            <div class="comment-conten">
              <comment
                v-for="(item,index) in postView.comment.list"
                :key="index"
                :commentData="item"
              ></comment>
            </div>
          </div>
          <!-- 留言、喜欢 -->
          <div class="Collection-box">
            <div class="input-Collection">
              <van-field
                shape="round"
                left-icon="edit"
                v-model="myValue"
                placeholder="输入内容"
                v-on:keyup.enter="submit"
              />
            </div>
            <div class="icon-Collection" @click="likeFn">
              <van-icon name="like" size="20" color="#ee0a24" v-if="like" />
              <van-icon name="like-o" size="20" color="#969799" v-else />
            </div>
          </div>
        </div>
      </div>
      <!-- loading -->
      <div class="loading" v-if="isLoad">
        <van-loading color="#1989fa" />
      </div>
    </div>
  </div>
</template>

<script>
import Videoer from "../components/Videoer";
import Velocity from "velocity-animate";
import comment from "../components/Comment";
import { mapState, mapActions, mapMutations } from "vuex";
import types from "@/store/TYPES";
import { Toast } from "vant";
export default {
  name: "Play",
  data() {
    return {
      myValue: "",
      like: false,
      scrollTop: 0,
      voTop: 0,
      voleft: 0,
      voW: 0,
      voH: 0,
      isImg: true,
      img: "",
      isLoad: true,
      isVodeo: true,
      // back forward
      jumpMode: "forward",
    };
  },
  components: {
    comment,
    Videoer
  },
  computed: {
    ...mapState({
      postView: state => state.postView,
      user: state => state.user
    })
  },
  created() {
    if (this.$route.query) {
      this.img = this.$route.query.img;
      this.scrollTop = this.$route.query.scrollTop || 0;
      this.voTop = this.$route.query.top;
      this.voleft = this.$route.query.left;
      this.voW = this.$route.query.w;
      this.voH = this.$route.query.h;
    }

    this.isImg = false;
    if (this.user) {
      this.like = this.user.collection.some(item => {
        return item.postid == this.postView.postid;
      });
    }
  },
  mounted() {
    this.isImg = true;
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener("popstate", this.onBack, true);
    }
  },
  updated() {
    if (this.user) {
      this.like = this.user.collection.some(item => {
        return item.postid == this.postView.postid;
      });
    }
  },
  destroyed() {
    // 当页面销毁必须要移除这个事件，vue不刷新页面，不移除会重复执行这个事件
    window.removeEventListener("popstate", this.onBrowserBack, false);
  },
  methods: {
    ...mapMutations([types.SET_COLLECTION, types.SET_SEE_HISTORY]),
    ...mapActions([types.GET_POSET_VIEW_DATA]),
    // 发送评论
    submit() {
      if (!this.myValue) return;
      if (!this.user) {
        Toast("用户未登陆！");
        return;
      }
      let newdate = new Date();
      let n = newdate.valueOf() / 1000;
      let obj = {
        addtime: n,
        commentid: 0,
        content: this.myValue,
        count_approve: 0,
        has_approve: 0,
        isrecommend: 0,
        userinfo: {
          author_type: 0,
          avatar: "https://b.yzcdn.cn/vant/icon-demo-1126.png",
          isAdministrator: false,
          is_editor: "0",
          isadmin: "0",
          mcard_url: "",
          username: this.user.name
        }
      };
      this.postView.comment.list.unshift(obj);
      this.myValue = "";
    },
    // 喜欢设置添加
    likeFn() {
      if (this.user) {
        this.like = !this.like;
        if (this.like) {
          this.$store.commit(types.SET_COLLECTION, { data: this.postView });
        } else {
          this.$store.commit(types.SET_COLLECTION, { data: this.postView });
        }
      } else {
        Toast("用户未登陆！");
      }
    },
    // 更新数据
    updataFn(v) {
      this.isVodeo = false;
      // 获取数据
      let postid = v.query.postid;
      this.GET_POSET_VIEW_DATA({
        id: postid,
        callback: (context, response) => {
          if (response.data.msg == "OK" || response.data.msg == "ok") {
            this.isLoad = false;
            setTimeout(() => {
              this.isVodeo = true;
            }, 1);
          }
          context.commit(types.GET_POSET_VIEW_DATA, {
            data: response.data.data
          });
          this.$store.commit(types.SET_SEE_HISTORY, {
            data: response.data.data
          });
        }
      });
    },
    // 计算时间
    parseTime(t = 0) {
      return parseInt(t / 60) + "'" + (t % 60) + '"';
    },
    // 相关推荐的点击跳转
    toRouterFn(v, event) {
      this.jumpMode = "forward";
      this.isImg = false;
      let arr = event.path;
      let rollbox;
      let card;
      let le;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].className == "roll-box") {
          rollbox = arr[i];
        }
        if (arr[i].className == "card") {
          card = arr[i];
        }
        if (arr[i].className == "play") {
          le = arr[i];
        }
      }
      this.$router.push({
        path: "/play",
        query: {
          postid: v.postid,
          scrollTop: le.scrollTop,
          rollid: rollbox.id,
          rollbox: rollbox.scrollLeft,
          top: event.clientY - event.offsetY,
          left: event.clientX - event.offsetY,
          w: card.clientWidth,
          h: card.clientHeight,
          img: v.image
        }
      });
    },
    // 动画
    beforeEnter: function(el) {
      el.style.top = this.voTop + "px";
      el.style.left = this.voleft + "px";
      el.style.width = this.voW + "px";
      el.style.height = this.voH + "px";
      el.style.zIndex = 200;
      if (this.jumpMode == "back") {
        el.style.display = "none";
        el.style.zIndex = 200;
      }
    },
    enter: function(el, done) {
      if (this.jumpMode == "back") {
        Velocity(
          el,
          {
            top: "0px",
            left: "0px",
            width: this.$el.querySelector(".vo-box").clientWidth,
            height: this.$el.querySelector(".vo-box").clientHeight,
            display: "none"
          },
          { duration: 0 }
        );
        Velocity(
          el,
          {
            top: "0px",
            left: "0px",
            width: this.$el.querySelector(".vo-box").clientWidth,
            height: this.$el.querySelector(".vo-box").clientHeight,
            display: "block"
          },
          { duration: 0 },
          { complete: done }
        );
        return;
      }
      Velocity(
        el,
        {
          top: "0px",
          left: "0px",
          width: this.$el.querySelector(".vo-box").clientWidth,
          height: this.$el.querySelector(".vo-box").clientHeight,
          display: "block",
          zIndex: 0
        },
        { duration: 300 },
        { complete: done }
      );
      setTimeout(() => {
        this.updataFn(this.$route);
      }, 600);
    },
    leave: function(el, done) {
      if (this.jumpMode == "back") {
        this.updataFn(this.$route);
        Velocity(
          el,
          {
            top: "0px",
            left: "0px",
            width: this.$el.querySelector(".vo-box").clientWidth,
            height: this.$el.querySelector(".vo-box").clientHeight,
            display: "block",
            zIndex: 200
          },
          { duration: 300 },
          { complete: done }
        );
        Velocity(
          el,
          {
            top: this.voTop + "px",
            left: this.voleft + "px",
            width: this.voW + "px",
            height: this.voH + "px",
            display: "none",
            zIndex: 0
          },
          { duration: 300 },
          { complete: done }
        );
        // setTimeout(() => {
        //   this.updataFn(this.$route);
        // }, 600);
      } else {
        Velocity(el, { top: 0 + "px" }, { duration: 300 }, { complete: done });
      }
    },
    // 返回事件
    onClickBack() {
      this.jumpMode = "back";
      // this.isImg = true;
      this.$router.back();
    },
    onBack() {
      // console.log(this.$route)
      if(this.$route.query.postid ==this.postView.postid){
        history.back()
      }
      this.jumpMode = "back";
      // if(this.jumpMode&&this.$route.name=='Play'){
      //   
      // }
    }
  },
  watch: {
    $route(to, from) {
      // 对路由变化作出响应...
      // console.log("监听route", to, from);
      to;
      from;
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (from.name == "Play") {
      setTimeout(() => {
        if (this.jumpMode == "forward") {
          this.img = to.query.img;
          this.voTop = to.query.top;
          this.voleft = to.query.left;
          this.voW = to.query.w;
          this.voH = to.query.h;
          this.$el.scrollTop = to.query.scrollTop||0;
          setTimeout(() => {
            this.isImg = true;
          }, 300);
          this.isLoad = true;
        } else {
          this.img = from.query.img;
          this.voTop = from.query.top;
          this.voleft = from.query.left;
          this.voW = from.query.w;
          this.voH = from.query.h;
          this.$el.scrollTop = from.query.scrollTop||0;
          this.$el.querySelector("#" + from.query.rollid).scrollLeft =
            from.query.rollbox||0;
          this.isImg = true;
          setTimeout(() => {
            this.isImg = false;
          }, 300);
          this.updataFn(this.$route);
        }
      }, 1);
    }else{
      history.back()
    }
    next();
  }
};
</script>

<style lang="less" scoped>
.play {
  // display: block;
  position: fixed;
  top: 0;
  left: 0;
  background: #f7f7f7;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: auto;
  // 返回
  .back {
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 120;
    background-color: transparent;
    /deep/.van-icon {
      background-color: transparent;
      color: white;
    }
  }
  .play-box {
    width: 100%;
    // height: 100%;
    position: relative;
    // 视频播放
    .wrap-box {
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      .vo-box {
        width: 100%;
        position: relative;
        padding-bottom: 56.2%; /*需要用padding来维持16:9比例,也就是9除以16*/
        height: 0;
        background-color: white;
        .vide-box {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: black;
          z-index: 99;
          video {
            width: 100%;
            height: 100%;
          }
        }
        .img-box {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 98;
          .vo-img {
            width: 100%;
            height: 100%;
            z-index: 200;
          }
        }
      }
    }
    // 介绍内容
    .play-content {
      margin-top: 56.2%;
      margin-bottom: 60px;
      width: 100%;
      height: 100%;
      .content-big {
        // 简介
        .introduce {
          width: 100%;
          text-align: center;
          padding: 30px 10px;
          box-sizing: border-box;
          position: relative;
          &::before {
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
            border-bottom: 1px solid rgba(153, 92, 92, 0.3);
            transform: scale(0.333333);
          }
          .title {
            font-weight: 600;
            margin: 0px 0 15px;
            font-size: 16px;
          }
          .info {
            font-size: 12px;
            color: #8c8a8a;
          }
          .content {
            font-size: 14px;
            line-height: 26px;
            padding: 20px 0px;
            text-align: justify;
          }
          .more {
            font-size: 14px;
            color: rgb(101, 189, 249);
          }
        }
        // 出品人
        .author {
          width: 100%;
          padding: 10px 10px;
          box-sizing: border-box;
          position: relative;
          display: flex;
          &::before {
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
            border-bottom: 1px solid rgba(153, 92, 92, 0.3);
            transform: scale(0.333333);
          }
          .pic {
            border-radius: 50%;
            /* border: 1px solid rgba(0, 0, 0, 0.3); */
            width: 40px;
            height: 40px;
            overflow: hidden;
            margin-right: 8px;
            position: relative;
            &::before {
              position: absolute;
              z-index: 2;
              content: "";
              top: 0;
              left: 0;
              width: 300%;
              height: 300%;
              border-radius: 50%;
              pointer-events: none;
              box-sizing: border-box;
              transform-origin: top left;
              border: 1px solid rgba(0, 0, 0, 0.3);
              transform: scale(0.333333);
            }
            img {
              width: 100%;
            }
          }
          .author-info {
            flex: 1;
            .name {
              font-weight: 600;
              font-size: 14px;
            }
            .occupation {
              margin-top: 3px;
              font-size: 14px;
            }
          }
          .icon-more {
            width: 16px;
            height: 16px;
            margin-top: 15px;
          }
        }
        // 相关推荐
        .recommend {
          width: 100%;
          padding: 30px 10px;
          box-sizing: border-box;
          position: relative;

          &::before {
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
            border-bottom: 1px solid rgba(153, 92, 92, 0.3);
            transform: scale(0.333333);
          }
          .recommend-warp {
            width: 100%;
            height: auto;
            margin-bottom: 5px;
            .h3 {
              font-size: 14px;
              font-weight: 600;
              padding: 0 0 10px;
            }
            .roll-box {
              overflow: hidden;
              overflow-x: auto;
              white-space: nowrap;
              &::-webkit-scrollbar {
                display: none;
              }
              .card {
                display: inline-block;
                width: 40%;
                height: 90px;
                margin-right: 15px;
                position: relative;
                overflow: hidden;
                img {
                  height: 100%;
                  filter: brightness(0.6);
                  pointer-events: none;
                }
                .content {
                  position: absolute;
                  left: 0;
                  bottom: 0px;
                  padding: 8px;
                  width: 100%;
                  box-sizing: border-box;
                  pointer-events: none;
                  .time {
                    font-size: 12px;
                    color: white;
                    margin-bottom: 8px;
                    pointer-events: none;
                  }
                  .title {
                    font-size: 12px;
                    color: white;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    word-break: normal;
                    pointer-events: none;
                  }
                }
              }
            }
          }
        }
        // 评论
        .comment-play {
          width: 100%;
          padding: 30px 10px 0;
          box-sizing: border-box;
          position: relative;
          .total {
            padding-bottom: 10px;
          }
          .comment-conten {
            position: relative;
            &::before {
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
              border-bottom: 1px solid rgba(153, 92, 92, 0.3);
              transform: scale(0.333333);
            }
          }
        }
        // 留言
        .Collection-box {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 8px 6px;
          z-index: 99;
          background-color: #f7f8fa;
          display: flex;
          &::before {
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
            border-top: 1px solid rgba(32, 32, 32, 0.3);
            transform: scale(0.333333);
          }
          .input-Collection {
            display: inline-block;
            width: 80%;
            // border: 1px solid black;
            /deep/.van-cell {
              border: 0.4px solid rgba(0, 0, 0, 0.3);
              border-radius: 20px;
              padding: 6px 16px;
            }
          }
          .icon-Collection {
            flex: 1;
            display: inline-block;
            padding: 0 20px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
    // loading
    .loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin-top: 56.2%;
      // box-sizing: content-box;
      background-color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 97;
      /deep/.van-loading {
        margin-top: -56.2%;
      }
    }
  }
}
</style>