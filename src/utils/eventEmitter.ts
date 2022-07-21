import {useEventEmitter} from "../hooks/useEventEmitter";

type Fn = () => void;
export type EventEmitterResult = ReturnType<typeof useEventEmitter>;

export const eventEmitter = () => {
  const events: Fn[] = [];

  return {
    subscribe: (fn: Fn) => {
      events.push(fn);
    },
    unsubscribe: (fn: Fn) => {
      const index = events.indexOf(fn);
      if (index > -1) events.splice(index, 1);
    },
    fire: async () => {
      for(const evt of events) {
        await evt();
      }
    },
  };
};