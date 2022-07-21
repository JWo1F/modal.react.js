import { useContext, useEffect, useState } from 'react';

import { delay } from '../utils/delay';
import { ModalContext } from "../Modal";

export const useFlowValue = <I, L, U>(time: number, initial: I, live: L, unloaded: U) => {
  const [value, setValue] = useState<I | L | U>(initial);
  const ctx = useContext(ModalContext);

  useEffect(() => {
    setTimeout(() => {
      setValue(live);
    }, 100);

    ctx.subscribe(async () => {
      setValue(unloaded);
      await delay(time);
    })
  }, []);

  return value;
};