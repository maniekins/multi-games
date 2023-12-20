import { useEffect, useRef, useState } from 'react';
const getRandomKey = () => (Math.random() * 9e10).toFixed(0);

type TGlobalState = {
  someVal: string;
  someVal2: string;
  someInt: number;
};

type TMySelector = <T>(selector: (state: TGlobalState) => T) => T;

type TContext = {
  listen: (listener: (state: TGlobalState) => void) => () => void;
  listeners: Map<string, (state: TGlobalState) => void>;
  state: TGlobalState;
  setSomeVal: (val: string) => void;
};

export const ObjContext: TContext = {
  listen(listener) {
    const key = Date.now() + getRandomKey();
    this.listeners.set(key, listener);

    return () => {
      this.listeners.delete(key);
    };
  },
  listeners: new Map(),
  setSomeVal(val) {
    this.state.someVal = val;
    this.listeners.forEach((listener) => {
      listener(this.state);
    });
  },
  state: {
    someInt: 123,
    someVal: 'initial',
    someVal2: 'initial',
  },
};

export const useMySelector: TMySelector = (selector) => {
  const [val, setVal] = useState(() => selector(ObjContext.state));
  const prevVal = useRef(val);

  useEffect(() => {
    const unsubscribe = ObjContext.listen((state: TGlobalState) => {
      const newVal = selector(state);
      if (prevVal.current !== newVal) {
        setVal(newVal);
        prevVal.current = newVal;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selector]);

  return val;
};
