import * as React from 'react';
import { FunctionComponent } from 'react';
import { Basic } from "../Basic";

type FC<T> = FunctionComponent<T>;

export const wrapWithBasicModal = <T,>(Component: FC<T>): FC<T> => {
  const realName = Component.displayName || Component.name;

  const Result: FC<T> = (props) => {
    return (
      <Basic>
        <Component {...props} />
      </Basic>
    );
  };

  Result.displayName = `Basic(${realName})`;

  return Result;
};
