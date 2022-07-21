import React, {FunctionComponent} from "react";
import {Modal} from "../Modal";
import type {ID} from "../ModalsArea";

type FC<T> = FunctionComponent<T>;

export const wrapModal = <T,>(handlerId: ID, Component: FC<T>) => {
  const realName = Component.displayName || Component.name;

  const Result: FC<T> = (props) => (
    <Modal id={handlerId}>
      <Component {...props} />
    </Modal>
  );

  Result.displayName = `Basic(${realName})`;

  return Result;
};