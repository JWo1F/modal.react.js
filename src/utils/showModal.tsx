import React, {ReactNode} from "react";
import {modalId} from "./modalId";
import {createPromise} from "./createPromise";
import {BasicReverseCallbackContext, OnDeleteHandler} from "../Basic";
import {deleteModalGlobal, upsertModalGlobal} from "../Wrapper";

type Input<T> = (
  resolve: (value?: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
) => ReactNode;

export const showModal = async <T = void>(input: Input<T>) => {
  const id = modalId();
  const [onDelete, onDeletePromise] = createPromise<OnDeleteHandler>();

  const result = await new Promise<T>((res, rej) => {
    upsertModalGlobal({
      id,
      element: (
        <BasicReverseCallbackContext.Provider value={onDeletePromise}>
          {input(res, rej)}
        </BasicReverseCallbackContext.Provider>
      )
    });
  });

  onDelete(() => {
    deleteModalGlobal(id);
  });

  return result;
}