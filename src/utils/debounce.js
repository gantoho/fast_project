// 防抖函数的封装
export default function debounce(func, delay) {
    let timer = null
    return function () {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply()
        }, delay)
    }
}
