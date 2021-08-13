// eslint-disable-next-line no-undef

export function throttle(fn, wait = 1000) {
  let timer = null
  return (...arg: any) => {
    if (!timer) {
      // @ts-ignore
      fn(...arg)
      // @ts-ignore
      timer = setTimeout(() => {
        timer = null
      }, wait)
    }
  }
}

export function debounce(fn, wait = 1000) {
  let timer = null
  return (...arg: any) => {
    if (timer) {
      // @ts-ignore
      clearTimeout(timer)
      timer = null
    }
    // @ts-ignore
    timer = setTimeout(() => {
      fn(...arg)
    }, wait)
  }
}
