import "../plugins/axios";
export const getPostsData = function (url) {
    return window.axios.get(url).catch(function (error) {
        console.log(error);
    });
}