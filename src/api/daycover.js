import "../plugins/axios";
export const getDayCoverData = function () {
    return window.axios.get('/apiv3/DayCover/getDayCover').catch(function (error) {
        console.log(error);
    });
}