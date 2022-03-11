import * as React from 'react';
import {
  ReactNode, createContext, useState, useEffect
} from 'react';

import { useModalId } from '../hooks/useModalId';

interface IProps {
  children?: ReactNode;
  global?: boolean;
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

const defaultGlobalFn = () => { throw new Error('You don\'t have Global Wrapper'); };

let globalWrapperId: string | undefined;
let onUpsertModalGlobal: onUpsertFunction = defaultGlobalFn;
let onDeleteModalGlobal: onDeleteFunction = defaultGlobalFn;

export const upsertModalGlobal: onUpsertFunction = (...args) => onUpsertModalGlobal(...args);
export const deleteModalGlobal: onDeleteFunction = (...args) => onDeleteModalGlobal(...args);

export const Wrapper = (props: IProps) => {
  const [modals, setModals] = useState<IModalState[]>([]);
  const id = useModalId();

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
    if (props.global) {
      if (globalWrapperId && globalWrapperId !== id) throw new Error('You can use only one Global Wrapper');
      globalWrapperId = id;
      onUpsertModalGlobal = onUpsert;
      onDeleteModalGlobal = onDelete;

      return () => {
        globalWrapperId = undefined;
        onUpsertModalGlobal = defaultGlobalFn;
        onDeleteModalGlobal = defaultGlobalFn;
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