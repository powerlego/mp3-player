function wrapPromise<T>(promise: Promise<T>) {
  let status = "pending";
  let result: T;

  const suspender = promise.then(
    (res) => {
      status = "success";
      result = res;
    },
    (err) => {
      status = "error";
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result = err;
    }
  );
  const read = () => {
    if (status === "pending") {
      throw suspender;
    }
    else if (status === "error") {
      throw result;
    }
    else if (status === "success") {
      return result;
    }
    else {
      throw new Error("Unexpected status");
    }
  };
  return { read };
}

export default wrapPromise;
