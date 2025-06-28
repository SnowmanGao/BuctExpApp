import dayjs from 'dayjs';

// 获取数组中满足条件的前 n 个元素
function arrayTake<T>(array: T[], predicate: (item: T) => boolean, n: number) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            result.push(array[i]);
            if (result.length === n) break;
        }
    }
    return result;
}


// 特制防抖，先执行后有不应期
function debounce<T extends (...args: any[]) => void>(
    fn: T,
    wait: number
): (...args: Parameters<T>) => void {
    let lastTime: number = 0;

    return function (...args: Parameters<T>) {
        if (Date.now() - lastTime < wait) return;
        lastTime = Date.now();
        fn.call(args);
    };
}

// 滚动到页面顶部
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 滚动到页面底部
function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}

function easterEgg(endTime: Date) {
    if (dayjs().isAfter(endTime)) {
        console.warn('Never can we suspend the time.');
    }
}

// 将（24小时制）时间转换为适合人类阅读的字符串
function formatTimeOfDay(hr: number, min: number) {
    const h = (hr > 12 ? hr - 12 : hr).toString();
    const m = min.toString().padStart(2, '0');
    let tag: string;
    if (hr < 0) tag = '';
    else if (hr < 6) tag = '凌晨';
    else if (hr < 11) tag = '上午';
    else if (hr < 13) tag = '中午';
    else if (hr < 19) tag = '下午';
    else tag = '晚上';
    return `${tag}${h}:${m}`;
}

export { arrayTake, debounce, scrollToTop, scrollToBottom, easterEgg, formatTimeOfDay };
