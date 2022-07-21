import {ReactNode, useCallback, useEffect, useRef} from "react";
import {ID, selectHandler} from "../ModalsArea";
import {useId} from "./useId";

type Fn = () => void | Promise<void>;

export const useModal = (handlerId: ID | undefined, fn: Fn) => {
  const handler = selectHandler(handlerId);
  const id = useId();
  const fnRef = useRef<Fn>();

  fnRef.current = fn;

  useEffect(() => () => {
    (async () => {
      await fnRef.current();
      handler.delete(id);
    })();
  }, []);

  return useCallback((children: ReactNode): null => {
    setTimeout(() => {
      handler.upsert({
        id,
        element: children
      });
    });

    return null;
  }, []);
};