import React, { ReactNode } from "react";
import {ID, selectHandler} from "../ModalsArea";
import {getId} from "./getId";
import {ModalContext} from "../Modal";
import { eventEmitter } from "./eventEmitter";

type Input<T> = (
  resolve: (value?: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
) => ReactNode;

export const showModal = async <T = void>(handlerId: ID, input: Input<T>) => {
  const id = getId();
  const handler = selectHandler(handlerId);
  const emitter = eventEmitter();
  const ctx = {
    id: id,
    subscribe: emitter.subscribe,
    unsubscribe: emitter.unsubscribe
  };

  const result = await new Promise<T>((res, rej) => {
    handler.upsert({
      id,
      element: (
        <ModalContext.Provider value={ctx}>
          {input(res, rej)}
        </ModalContext.Provider>
      )
    });
  });

  await emitter.fire();

  handler.delete(id);

  return result;
};