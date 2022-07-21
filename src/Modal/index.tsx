import React, { createContext, PropsWithChildren } from "react";
import { useModal } from "../hooks/useModal";
import { ID } from "../ModalsArea";
import { useEventEmitter } from "../hooks/useEventEmitter";
import { EventEmitterResult } from "../utils/eventEmitter";

interface IModalProps {
  id?: ID;
}

interface IModalContext {
  id: ID;
  subscribe: EventEmitterResult['subscribe'];
  unsubscribe: EventEmitterResult['unsubscribe'];
}

export const ModalContext = createContext<IModalContext>(null);

export const Modal = (props: PropsWithChildren<IModalProps>) => {
  const emitter = useEventEmitter();
  const render = useModal(props.id, emitter.fire);
  const ctx = {
    id: props.id,
    subscribe: emitter.subscribe,
    unsubscribe: emitter.unsubscribe
  };

  return render(
    <ModalContext.Provider value={ctx}>
      {props.children}
    </ModalContext.Provider>
  );
};