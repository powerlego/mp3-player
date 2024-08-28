type ThrottleFunction<T> = (arg: T) => void;

export const useThrottle = () => {
  function throttle<K>(func: ThrottleFunction<K>, limit: number): ThrottleFunction<K> {
    let inThrottle = false;
    return (arg) => {
      if (!inThrottle) {
        func(arg);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  return { throttle };
};
