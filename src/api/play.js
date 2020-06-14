// https://api.kele8.cn/agent/https://app.vmovier.com/apiv3/post/view?postid=' + id,
import "../plugins/axios";
export const getPostView = function (id) {
    return window.axios.get('/apiv3/post/view?postid='+id).catch(function (error) {
        console.log(error);
    });
}