import { useEffect, useRef } from 'react';

export const useIsFirstRender = () => {
  const ref = useRef(true);

  useEffect(() => {
    ref.current = false;
  }, []);

  return ref.current;
};