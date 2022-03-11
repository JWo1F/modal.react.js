import { useRef } from 'react';

import { modalId } from '../utils/modalId';

export const useModalId = () => {
  const id = useRef<string>();
  if (!id.current) id.current = modalId();
  return id.current;
};