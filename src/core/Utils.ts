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

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}

export { arrayTake, debounce, scrollToTop, scrollToBottom };
