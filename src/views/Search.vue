<template>
  <div class="search">
    <!-- 搜索 -->
    <div class="search-input">
      <van-search
        v-model="value"
        :background="showkw?'#000':'rgba(34, 33, 33, 0.762)'"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch(value)"
        @cancel="onCancel"
      />
    </div>
    <!-- 搜索词 -->
    <div class="search-keyword" v-if="showkw">
      <!-- 热门搜索 -->
      <div class="hot-box">
        <div class="h3">热门搜索</div>
        <div class="hot-content">
          <span
            class="keyworld"
            v-for="(keyword,hotindex) in hotWord.recommend_keywords"
            :key="hotindex"
            @click="onSearch(keyword.kw)"
          >{{keyword.kw}}</span>
        </div>
      </div>
      <!-- 搜索历史 -->
      <div class="history-box">
        <div class="h3">
          搜索历史
          <div class="clearall" @click="clearFn">
            <span class="clear-text">清除</span>
            <van-icon name="delete" color="#969799" size="12px" />
          </div>
        </div>
        <div class="hot-content">
          <div v-if="historyWords.length>0">
            <div
              class="keyworld"
              v-for="(historyWord,hisWindex) in historyWords"
              :key="hisWindex"
              @click="onSearch(historyWord)"
            >{{historyWord}}</div>
          </div>

          <div class="wu" v-else>还没有任何搜索记录</div>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="searc-result" v-if="!showkw">
      <div class="loadingsearch" v-if="showloading">
        <van-loading color="#1989fa" />
      </div>
      <div v-if="!showloading">
        <div class="h4">{{searchData[0].result.total}}个相关影片</div>
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div class="result-all" v-for="(Datas,ifSD) in searchData" :key="ifSD">
            <Postcard v-for="(item,index) in Datas.result.list" :key="index" :post="item"></Postcard>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
// import { Notify } from "vant";
import { mapState, mapActions } from "vuex";
import types from "@/store/TYPES";
import Postcard from "../components/Postcard";
import { Notify, Dialog } from "vant";
export default {
  data() {
    return {
      historyWords: [],
      value: "",
      loading: false,
      showkw: true,
      finished: false,
      showloading: true
    };
  },
  computed: {
    ...mapState({
      searchData: state => state.searchData,
      hotWord: state => state.hotWord
    })
  },
  created() {
    this.GET_HOT_WORD_DATA();
    this.setHistoryWords("", "0");
  },
  watch: {
    value(v) {
      if (v == "") {
        this.showkw = true;
      }
    }
  },
  methods: {
    // ...mapMutations([types.GET_SEARCH_DETAILS]),
    ...mapActions([
      types.GET_HOT_WORD_DATA,
      types.GET_SEARCH_DETAILS,
      types.GET_SEARCH_DETAILS_MORE
    ]),
    //  设置historywords数据
    setHistoryWords(v, key) {
      var cachedhistorywords = window.localStorage.getItem("historywords");
      if (cachedhistorywords) {
        cachedhistorywords = JSON.parse(cachedhistorywords);
        let isExist = cachedhistorywords.data.some(item => {
          return item == v;
        });
        switch (key) {
          case "+":
            this.value = v;
            isExist;
            if (!isExist) {
              cachedhistorywords.data.push(v);
              window.localStorage.setItem(
                "historywords",
                JSON.stringify({
                  data: cachedhistorywords.data
                })
              );
              this.historyWords = cachedhistorywords.data;
            }
            break;
          case "-":
            cachedhistorywords.data.length = 0;
            window.localStorage.setItem(
              "historywords",
              JSON.stringify({
                data: cachedhistorywords
              })
            );
            this.historyWords = cachedhistorywords.data;
            break;
          default:
            this.historyWords = cachedhistorywords.data;
            break;
        }
      } else if (v == "") {
        return;
      } else {
        window.localStorage.setItem(
          "historywords",
          JSON.stringify({
            data: [v]
          })
        );
        this.historyWords = [v];
      }
    },
    // 获取搜索详情数据
    getSearchDetails(v) {
      this.showkw = false;
      this.value = v;
      this.GET_SEARCH_DETAILS({
        more: v,
        callback: (context, response) => {
          if (response.data.msg == "ok") {
            context.commit(types.GET_SEARCH_DETAILS, {
              data: response.data.data
            });
            this.showloading = false;
          }
        }
      });
    },
    // 获取更多
    getMore() {
      this.GET_SEARCH_DETAILS_MORE((context, response) => {
        context;
        if (response.data.msg == "ok") {
          context.commit(types.GET_SEARCH_DETAILS_MORE, {
            data: response.data.data
          });
          this.loading = false;
        } else {
          Notify("没有更多内容了");
        }
      });
    },
    // input为空隐藏结果
    hidenResult(e) {
      if (e.detail == "") {
        this.showkw = true;
      }
    },
    // 搜索
    onSearch(v) {
      this.showloading = true;
      this.getSearchDetails(v);
      this.setHistoryWords(v, "+");
    },
    // 取消
    onCancel() {
      this.showkw = true;
      this.$router.back();
    },
    clearFn() {
      Dialog.confirm({
        message: "清空搜索记录？"
      })
        .then(() => {
          // on confirm
          this.setHistoryWords(1, "-");
        })
        .catch(() => {
          // on cancel
        });
    },
    clearall() {
      this.setHistoryWords(1, "-");
    },
    // 上拉获取更多
    onLoad() {
      this.getMore();
    }
  },
  components: {
    Postcard
  }
};
</script>

<style lang="less" scoped>
.search {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  overflow: auto;
  background-color: black;
  display: flex;
  flex-direction: column;
  .search-input {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 101;
  }
}
// 热门词
.search-keyword {
  flex: 1;
  margin-top: 54px;
}
.hot-box,
.history-box {
  width: 100%;
  background-color: black;
  color: white;
  box-sizing: border-box;
  padding: 20px 15px;
}

.h3 {
  margin-bottom: 15px;
  font-size: 14px;
  color: #969799;
}

.keyworld {
  display: inline-block;
  padding: 5px;
  font-size: 14px;
  border-radius: 2px;
  background-color: #4f4f4f96;
  margin: 0px 15px 10px 0;
  letter-spacing: 2px;
}

.wu {
  text-align: center;
  font-size: 14px;
  color: #969799;
}

.h3 .clearall {
  font-size: 12px;
  float: right;
  height: 100%;
  color: #969799;
}

.clear-text {
  display: inline-block;
  padding: 5px;
  margin-top: -2px;
}
/* 搜索结果 */
.searc-result {
  flex: 1;
  position: relative;
  margin-top: 54px;
}
.loadingsearch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  /deep/.van-loading {
    background-color: black;
  }
}
.h4 {
  font-size: 14px;
  color: #969799;
  padding: 10px 15px;
  background-color: rgba(34, 33, 33, 0.762);
}
/deep/.van-loading {
  width: 100%;
  text-align: center;
  padding: 5px 0;
  background-color: white;
}
/deep/.van-search__content {
  background-color: rgba(104, 104, 104, 0.796);
}

/deep/.van-field__control {
  color: white;
  font-size: 14px;
}
/deep/.van-search__action {
  color: #969799 !important;
}
</style>