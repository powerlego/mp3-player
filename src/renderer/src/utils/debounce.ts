function debounce(func: (...args: any) => any, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  let reject: (reason?: any) => void;
  return async function (this: any, ...args: any[]) {
    if (timeout) {
      reject();
    }
    clearTimeout(timeout);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const promise = new Promise((resolve: (value: void) => void, _reject) => {
      reject = _reject;
      timeout = setTimeout(() => {
        func.apply(this, args);
        resolve();
      }, wait);
    });
    return promise;
  };
}

export default debounce;
