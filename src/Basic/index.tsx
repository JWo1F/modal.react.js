import * as React from 'react';
import {
  createContext, ReactNode, useContext, useEffect, useMemo 
} from 'react';

import { useModalId } from '../hooks/useModalId';
import { createPromise } from '../utils/createPromise';
import { ModalsContext } from '../Wrapper';

interface IProps {
  children?: ReactNode;
}

export type OnDeleteHandler = () => void;
export type OnDeletePromise = Promise<OnDeleteHandler>;

export const BasicReverseCallbackContext = createContext<OnDeletePromise>(null as unknown as OnDeletePromise);

export const Basic = (props: IProps): null => {
  const ctx = useContext(ModalsContext);
  const id = useModalId();
  const [onDelete, onDeletePromise] = useMemo(() => createPromise<OnDeleteHandler>(), []);

  useEffect(() => {
    ctx.onUpsert({
      id,
      element: (
        <BasicReverseCallbackContext.Provider value={onDeletePromise}>
          {props.children}
        </BasicReverseCallbackContext.Provider>
      )
    });
  }, [props.children]);

  useEffect(() => {
    return () => {
      onDelete(() => {
        ctx.onDelete(id);
      });
    };
  }, []);

  return null;
};