<template>
  <div class="card" @click="toRouterFn($event)">
    <!-- <img :src="item.image" alt /> -->
     <van-image style="width:100%" fit="cover"  lazy-load :src="item.image" />
    <div class="mask"></div>
    <dl>
      <dt>
        <span v-for="(cate, index) in item.cates" :key="index">{{cate.catename}} / </span>
        <span>{{parseTime(item.duration)}}</span>
      </dt>
      <dd>{{item.title}}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: ["item"],
  methods: {
    // 计算时间
    parseTime(t = 0) {
      return parseInt(t / 60) + "'" + (t % 60) + '"';
    },
    toRouterFn(event) {
      // console.log(event);
      let dom;
      let hl;
      for (let i = 0; i < event.path.length; i++) {
        if (event.path[i].className == "card") {
          dom = event.path[i];
        }
        if (event.path[i].localName == "html") {
          hl = event.path[i];
        }
      }
      this.$router.push({
        path: "play",
        query: {
          postid: this.item.postid,
          top: dom.offsetTop - hl.scrollTop,
          img:this.item.image
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  position: relative;
  display: flex;
  img {
    vertical-align: middle;
    max-width: 100%;
    filter: brightness(0.8);
  }
  dl {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 15px;
    margin: 0;
    color: white;
    font-size: 14px;
    dt {
      span {
      }
    }
    dd {
      margin: 0;
    }
  }
}
</style>