<template>
  <div class="postcard">
    <div class="postitem" @click="navigateToPlay($event)">
      <van-image style="width:100%" fit="cover"  lazy-load :src="post.image" />
      <div class="info">
        <div>{{parseCates(post.cates)}} / {{parseTime(post.duration)}}</div>
        <div>{{post.title}}</div>
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
      let hl=event.path[0];
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i].className == "postitem") {
          dom = event.path[i];
        }
        if (event.path[i].scrollTop > 0) {
          hl = event.path[i];
        }
      }
      let top = hl.scrollTop||0;
      this.$router.push({
        path: "play",
        query: {
          postid: this.post.postid,
          scrollTop:top,
          top: dom.offsetTop - top,
          left: 0,
          img: this.post.image
        }
      });
    },
    parseCates(cates) {
      if (cates) {
        return cates
          .map(function(item) {
            return item.catename;
          })
          .join(",");
      } else {
        return "";
      }
    },
    parseTime(t = 0) {
      return parseInt(t / 60) + "'" + (t % 60) + '"';
    }
  }
};
</script>

<style lang="less" scoped>
.postitem {
  position: relative;
}

.postitem /deep/.van-image {
  display: block;
  width: 100%;
  filter: brightness(0.6);
}
.postitem .info {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 15px;
  color: white;
}
</style>