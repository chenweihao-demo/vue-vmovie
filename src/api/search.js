import "../plugins/axios";
// https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/cate/getList
export const getHotWord = function () {
    return window.axios.get('/apiv3/search/index/kw').catch(function (error) {
        console.log(error);
    });
}
export const getSearchDetails = function (v) {
    return window.axios.get('/apiv3/search?kw='+v).catch(function (error) {
        console.log(error);
    });
}
export const getMore = function (v) {
    return window.axios.get(v).catch(function (error) {
        console.log(error);
    });
}