import { useContext, useEffect, useRef } from 'react';

import { BasicReverseCallbackContext } from '../Basic';

type PlainFn = () => void;
type Fn = (fn: PlainFn) => void;

export const useBasicModalUnmount = (fn: Fn) => {
  const ctx = useContext(BasicReverseCallbackContext);

  if (ctx === void 0) {
    throw new Error('You should wrap this component with Basic');
  }

  const ref = useRef(fn);
  ref.current = fn;

  useEffect(() => {
    (async () => {
      const unmount = await ctx;
      ref.current(unmount);
    })();
  }, []);
};