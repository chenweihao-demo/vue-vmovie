export const parseCates = function (cates) {
    if (cates) {
        return cates.map(function (item) {
            return item.catename
        }).join(',')
    } else {
        return ''
    }

}
export const parseTime = function (t = 0) {
    return parseInt(t / 60) + "'" + t % 60 + '"'
} 
export const parseData = function (t = 0) {
    // console.log(Date)
    let date = window.getDate();
    date.setTime(t * 1000)
    return date.getMonth() + 1 + '月' + date.getDate() + '日'
}