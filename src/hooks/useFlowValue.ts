import { useEffect, useState } from 'react';

import { delay } from '../utils/delay';
import { useBasicModalUnmount } from './useBasicModalUnmount';

export const useFlowValue = <I, L, U>(time: number, initial: I, live: L, unloaded: U) => {
  const [value, setValue] = useState<I | L | U>(initial);

  useEffect(() => {
    setTimeout(() => setValue(live), 100);
  }, []);

  useBasicModalUnmount(async (unmount) => {
    setValue(unloaded);
    await delay(time);
    unmount();
  });

  return value;
};