/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from "react";
import { IpcMainEvent } from "electron";

const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState<any>();

  const checkKeyAndSet = React.useCallback(
    (event: IpcMainEvent, eventKey: string, value: any) => {
      if (key === eventKey) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        const val = JSON.parse(value)[key];
        setStoredValue(val);
      }
    },
    [key]
  );

  useEffect(() => {
    window.api
      .getStoreKey("settings")
      .then((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const json = JSON.parse(item);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const value = json[key] || initialValue;
        setStoredValue(value);
      })
      .catch((err) => {
        console.error(err);
      });
  });

  useEffect(() => {
    window.api.on("storeKeyUpdated", checkKeyAndSet);

    return () => {
      window.api.off("storeKeyUpdated", checkKeyAndSet);
    };
  }, [checkKeyAndSet]);

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      window.api
        .getStoreKey("settings")
        .then((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const json = JSON.parse(item);
          const val = {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            ...json,
            [key]: valueToStore,
          };
          console.log(val);
          setStoredValue(valueToStore);
          window.api
            .setStoreKey("settings", JSON.stringify(val), key)
            .then(null)
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
    catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
};

export default useLocalStorage;
