export function debounce(timeout = 2000) {
  let timer;
  return () => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => {
        resolve(true);
      }, timeout);
    });
  };
}

export function debounce_leading(timeout = 2000) {
  let timer;
  return function () {
    return new Promise((resolve) => {
      if (!timer) {
        resolve(true);
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
      }, timeout);
    });
  };
}
