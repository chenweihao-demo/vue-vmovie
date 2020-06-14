<template>
  <div class="smallcard" @click="navigateToPlay($event)">
    <div class="img-box">
      <van-image style="width:100%"  lazy-load fit="cover" :src="post.image" />
    </div>
    <div class="title-box">
      <h4 class="title">{{post.title}}</h4>
      <div class="score">
        <van-rate v-model="value" allow-half void-icon="star" size="14" void-color="#eee" readonly />
        {{post.rating}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object
  },
  methods: {
    navigateToPlay(event) {
      let dom;
      let hl = event.path[0];
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i].className == "smallcard") {
          dom = event.path[i];
        }
        if (event.path[i].scrollTop > 0) {
          hl = event.path[i];
        }
      }
      let top = hl.scrollTop || 0;
      this.$router.push({
        path: "play",
        query: {
          postid: this.post.postid,
          scrollTop: top,
          top: dom.offsetTop - top,
          left: 0,
          img: this.post.image
        }
      });
    }
  },
  data() {
    return {
      value: this.post.rating / 2
    };
  }
};
</script>

<style lang="less" scoped>
.smallcard {
  width: 100%;
  background-color: white;
  padding: 15px;
  display: flex;
  .img-box {
    width: 40%;
  }
  .title-box {
    flex: 1;
    padding: 10px;
    .title {
      margin-bottom: 10px;
      font-size: 14px;
    }
    .score {
      color: #bbbbbb;
    }
  }
}
</style>