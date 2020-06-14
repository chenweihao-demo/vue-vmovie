import "../plugins/axios";
// https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/cate/getList
export const getChannelData = function () {
    return window.axios.get('/apiv3/cate/getList').catch(function (error) {
        console.log(error);
    });
}