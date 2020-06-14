<template>
  <div class="comment">
    <div class="pic">
      <img :src="commentData.userinfo.avatar" alt />
    </div>
    <div class="info">
      <div class="title">
        <div class="who-mesg">
          <div class="who">{{commentData.userinfo.username}}</div>
          <div class="date">{{parseData(commentData.addtime)}}</div>
        </div>
        <div class="zan">
          <van-icon name="good-job-o" />
          {{commentData.count_approve}}
        </div>
      </div>
      <div class="content">
        <div class="comment-content">
          <span v-if="commentData.reply_userinfo">回复 {{commentData.reply_userinfo.username}}：</span>
          {{commentData.content}}
        </div>
        <div v-if="commentData.subcomment">
          <comment v-for="(item,index) in commentData.subcomment" :key="index" :commentData="item"></comment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import comment from "./Comment.vue";
export default {
  name: "Comment",
  components: {
    // comment
  },
  props: {
    commentData: Object
  },
  methods: {
    parseData(t = 0) {
      let date = new Date();
      date.setTime(t * 1000);
      return date.getMonth() + 1 + "月" + date.getDate() + "日";
    }
  }
};
</script>

<style lang="less" scoped>
.comment {
  width: 100%;
  display: flex;
}
/* 头像 */
.comment .pic {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  overflow: hidden;
  margin-right: 8px;
  position: relative;
  margin-right: 5px;
}
.comment .pic::before {
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
.comment .pic image {
  width: 100%;
}
.comment .info {
  flex: 1;
}
.comment .info .title {
  display: flex;
}
.comment .info .title .who-mesg {
  flex: 1;
  font-size: 10px;
  color: rgba(102, 99, 99, 0.679);
}

.comment .info .title .who-mesg .who,
.comment .info .title .who-mesg .date {
  margin: 5px 0;
}
.comment .info .title .zan {
  width: 40px;
  font-size: 12px;
  color: rgba(102, 99, 99, 0.679);
  text-align: end;
}
.comment .info .title .zan van-icon {
  margin-right: 5px;
  font-size: 16px;
  vertical-align: bottom;
}
.comment .info .content {
  font-size: 12px;
}
.comment .info .content .comment-content {
  margin: 5px 0 20px;
}
</style>