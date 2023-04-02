function debounce(func: (...args: any) => any, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default debounce;
