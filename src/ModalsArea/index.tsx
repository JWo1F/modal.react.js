import React, {ReactNode, useState, useEffect} from 'react';

export type ID = string | number;

interface IProps {
  children?: ReactNode;
  id: ID;
}

export interface IModalState {
  id: string;
  element: ReactNode;
}

interface IGlobalFunctionsHolder {
  [id: string | number]: {
    readonly upsert: (state: IModalState) => void;
    readonly delete: (id: string) => void;
  }
}

const HOLDER: IGlobalFunctionsHolder = {};

export const selectHandler = (id: ID) => {
  if (!HOLDER[id]) {
    throw new Error('You don\'t have Global Wrapper');
  }

  return HOLDER[id];
};

export const ModalsArea = (props: IProps) => {
  const [modals, setModals] = useState<IModalState[]>([]);

  const onUpsert = (state: IModalState) => {
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

  const onDelete = (id: string) => {
    setModals((arr) => arr.filter((m) => m.id !== id));
  };

  useEffect(() => {
    HOLDER[props.id] = {
      upsert: onUpsert,
      delete: onDelete,
    };

    return () => {
      delete HOLDER[props.id];
    };
  }, []);

  return (
    <>
      {modals.map((modal) => (
        <div key={modal.id} data-id={modal.id}>{modal.element}</div>
      ))}
    </>
  );
};