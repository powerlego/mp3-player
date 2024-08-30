/* eslint-disable @typescript-eslint/no-explicit-any */
export const useDebounce = () => {
  function debounce(func: (...args: any) => any, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    let reject: (reason?: any) => void;
    return function (this: any, ...args: any[]) {
      if (timeout) {
        reject();
      }
      clearTimeout(timeout);
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
  return { debounce };
};
