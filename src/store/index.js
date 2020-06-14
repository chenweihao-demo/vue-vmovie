import Vue from "vue";
import Vuex from "vuex";
import types from "./TYPES";

import {
  getIndexData,
  getIndexPosts
} from "../api/home";
import {
  getPostView
} from "../api/play";
import {
  getChannelData
} from "../api/channel";
import {
  getPostsData
} from "../api/posts";
import {
  getHotWord,
  getSearchDetails,
  getMore
} from "../api/search";
// import {play} from './module';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 发现
    indexData: {},
    historyData: [],
    // 播放
    postView: {},
    // 频道
    channelData: {},
    // 分类详细
    postsData: {},
    // 搜索页面
    // 搜索热门词
    hotWord: {},
    // 搜索详情
    searchData: [],
    // 用户
    userData: [],
    // 个人信息
    user: null,
    // 收藏
    collectionData: [],
    // 历史记录
    seeHistoryData: [],
  },

  mutations: {
    // 设置页面的数据
    // 初始化的数据
    [types.INIT_INDEX_DATA](state, playload) {
      state.indexData = playload.data;
    },
    // 历史数据
    [types.GET_MORE_HISTORY_DATA](state, playload) {
      state.historyData.push(playload.data);
    },
    // 设置播放数据
    [types.GET_POSET_VIEW_DATA](state, playload) {
      state.postView = playload.data;
    },
    // 设置频道数据
    [types.INIT_CHANNEL_DATA](state, playload) {
      state.channelData = playload.data;
    },
    // 设置分类详细数据
    [types.GET_POSTS_DATA](state, playload) {
      state.postsData = playload.data;
    },
    // 设置热门词
    [types.GET_HOT_WORD_DATA](state, playload) {
      state.hotWord = playload.data;
    },
    // 设置搜索详情
    [types.GET_SEARCH_DETAILS](state, playload) {
      state.searchData = [playload.data];
    },
    [types.GET_SEARCH_DETAILS_MORE](state, playload) {
      state.searchData.push(playload.data);
    },
    // 设置用户数据
    [types.USER_DATA](state, playload) {
      state.userData = playload.data;
    },
    // 添加用户数据
    [types.USER](state, playload) {
      state.user = playload.data;
    },
    // 设置收藏数据
    [types.SET_COLLECTION](state, playload) {
      if(!state.user)return;
      let isflay = state.user.collection.some((item) => {
        return item.postid == playload.data.postid
      });
      if (isflay) {
        state.user.collection.forEach((element, index) => {
          if (element.postid == playload.data.postid) {
            state.user.collection.splice(index, 1);
            return
          }
        });

      } else {
        state.user.collection.push(playload.data);
      }
      window.localStorage.setItem(state.user.name, JSON.stringify({
        data: state.user,
      }));
    },
    // 添加收藏数据
    [types.ADD_COLLECTION](state, playload) {
      state.user.collection.push(playload.data);
      window.localStorage.setItem(state.user.name, JSON.stringify({
        data: state.user,
      }));
    },
    // 设置历史记录数据
    [types.SET_SEE_HISTORY](state, playload) {
      if(!state.user)return;
      let isflay = state.user.seeHistory.some((item) => {
        return item.postid == playload.data.postid
      });
      if (isflay) {
        state.user.seeHistory.forEach((element, index) => {
          if (element.postid == playload.data.postid) {
            state.user.seeHistory.splice(index, 1);
            return
          }
        });

      }
      state.user.seeHistory.unshift(playload.data);
      window.localStorage.setItem(state.user.name, JSON.stringify({
        data: state.user,
      }));
    },
    // 添加历史记录数据
    [types.ADD_SEE_HISTORY](state, playload) {
      state.user.seeHistory.push(playload.data);
      window.localStorage.setItem(state.user.name, JSON.stringify({
        data: state.user,
      }));
    },
  },
  actions: {
    // 获取发现页面初始化的数据
    [types.INIT_INDEX_DATA](context, callback) {
      var indexData = JSON.parse(window.localStorage.getItem('indexData'));
      if (indexData && indexData.expires > Date.now()) {
        context.commit(types.INIT_INDEX_DATA, {
          data: indexData.data
        });
        callback()
      } else {
        getIndexData().then((response) => {
          // console.log(response)
          window.localStorage.setItem('indexData', JSON.stringify({
            expires: Date.now() + 10 * 60 * 1000,
            data: response.data.data,
          }));
          context.commit(types.INIT_INDEX_DATA, {
            data: response.data.data
          })
          callback()
        })
      }
    },
    // 发现页面上拉加载数据
    [types.GET_MORE_HISTORY_DATA](context, callback) {
      let url = (context.state.historyData.length === 0) ?
        context.state.indexData.posts.next_page_url :
        context.state.historyData[context.state.historyData.length - 1].next_page_url;
      getIndexPosts(url).then((response) => {
        callback(context, response);
      })
    },
    // 获取播放页面数据
    [types.GET_POSET_VIEW_DATA](context, op) {
      getPostView(op.id).then((response) => {
        op.callback(context, response);
      })
    },
    // 频道页面的初始化数据
    [types.INIT_CHANNEL_DATA](context, callback) {
      var channelData = JSON.parse(window.localStorage.getItem('channelData'));
      if (channelData && channelData.expires > Date.now()) {
        context.commit(types.INIT_CHANNEL_DATA, {
          data: channelData.data
        });
        callback();
      } else {
        getChannelData().then((response) => {
          // console.log(response)
          if (response.data) {
            window.localStorage.setItem('channelData', JSON.stringify({
              expires: Date.now() + 10 * 60 * 1000,
              data: response.data.data,
            }));
            context.commit(types.INIT_CHANNEL_DATA, {
              data: response.data.data
            });
            callback();
          }

        })
      }
    },
    // 获取分类详细数据
    [types.GET_POSTS_DATA](context, v) {
      var postsData = JSON.parse(window.localStorage.getItem('postsData' + v.recdata));
      if (postsData && postsData.expires > Date.now() && v.page == 1) {
        context.commit(types.GET_POSTS_DATA, {
          data: postsData.data
        });
        v.callback(context, postsData.data);
      } else {
        getPostsData(v.url).then((response) => {
          // console.log(response)
          if (response.data) {
            if(v.page==1){
              window.localStorage.setItem('postsData' + v.recdata, JSON.stringify({
                expires: Date.now() + 10 * 60 * 1000,
                data: response.data.data,
              }));
            }
            
            context.commit(types.GET_POSTS_DATA, {
              data: response.data.data
            });
            v.callback(context, response);
          }

        })
      }
    },
    // 获取搜索热门词
    [types.GET_HOT_WORD_DATA](context) {
      var cachedhotWord = JSON.parse(window.localStorage.getItem('hotWordData'));
      if (cachedhotWord && cachedhotWord.expires > Date.now()) {
        context.commit(types.GET_HOT_WORD_DATA, {
          data: cachedhotWord.data
        });
      } else {
        getHotWord().then(response => {
          
          if (response.data) {
            window.localStorage.setItem('hotWordData', JSON.stringify({
              expires: Date.now() + 10 * 60 * 1000,
              data: response.data.data,
            }));
            context.commit(types.GET_HOT_WORD_DATA, {
              data: response.data.data
            });
          }
        })
      }
    },
    // 获取搜索详情
    [types.GET_SEARCH_DETAILS](context, v) {
      var str = v.more.replace(/\s*/g, "")
      getSearchDetails(str).then(response => {
        v.callback(context, response)
      })
    },
    // // 获取更多
    [types.GET_SEARCH_DETAILS_MORE](context, callback) {
      // this.data.searchData[this.data.searchData.length-1].result.next_page_url
      var str = context.state.searchData[context.state.searchData.length - 1].result.next_page_url
      getMore(str).then(response => {
        callback(context, response)
      })
    },
  },
  modules: {
    // play,
  }
});