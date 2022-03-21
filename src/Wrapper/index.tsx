import * as React from 'react';
import {
  ReactNode, createContext, useState, useEffect
} from 'react';
import {modalId} from "../utils/modalId";

interface IProps {
  children?: ReactNode;
  global?: number | boolean;
}

interface IContext {
  onUpsert: (modal: IModalState) => void;
  onDelete: (id: string) => void;
}

export interface IModalState {
  id: string;
  element: ReactNode;
}

export const ModalsContext = createContext<IContext>(null as unknown as IContext);

type onUpsertFunction = (state: IModalState) => void;
type onDeleteFunction = (id: string) => void;

const DEFAULT_MODAL_ID = modalId();
interface IGlobalFunctionsHolder {
  [id: string | number]: {
    readonly upsert: onUpsertFunction;
    readonly delete: onDeleteFunction;
  }
}

const HOLDER: IGlobalFunctionsHolder = {};

export const selectHandler = (num?: number) => {
  const id = num ?? DEFAULT_MODAL_ID;
  if (!(id in HOLDER)) throw new Error('You don\'t have Global Wrapper');
  return HOLDER[id];
};

export const upsertModalGlobal: onUpsertFunction = (...args) => selectHandler().upsert(...args);
export const deleteModalGlobal: onDeleteFunction = (...args) => selectHandler().delete(...args);

export const Wrapper = (props: IProps) => {
  const [modals, setModals] = useState<IModalState[]>([]);
  const id = (typeof props.global === 'number') ? props.global : (props.global ? DEFAULT_MODAL_ID : undefined);

  const onUpsert: onUpsertFunction = (state) => {
    setModals((arr) => {
      const index = arr.findIndex((modal) => modal.id == state.id);

      if (index > -1) {
        const cloned = [...arr];
        cloned.splice(index, 1, state);
        return cloned;
      } else {
        return [...arr, state];
      }
    });
  };

  const onDelete: onDeleteFunction = (id) => {
    setModals((arr) => arr.filter((m) => m.id !== id));
  };

  useEffect(() => {
    if (id !== undefined) {
      if (id in HOLDER) throw new Error('You can use only one Global Wrapper for ID: ' + id);

      HOLDER[id] = {
        upsert: onUpsert,
        delete: onDelete,
      };

      return () => {
        delete HOLDER[id];
      };
    }
  }, []);

  return (
    <ModalsContext.Provider value={{ onUpsert, onDelete }}>
      {props.children}

      {modals.map((modal) => (
        <div key={modal.id} data-id={modal.id}>{modal.element}</div>
      ))}
    </ModalsContext.Provider>
  );
};