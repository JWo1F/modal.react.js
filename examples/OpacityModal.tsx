import React, {useEffect, useState} from "react";
import { useFlowValue, Modal } from "../src";

export const OpacityModal = () => {
  const [v, sv] = useState(false);

  return (
    <div>
      <div onClick={() => sv(!v)}>Opacity Modal: {v ? 'ON' : 'OFF'}</div>
      {v && <Opacity/>}
    </div>
  );
};

export const Opacity = () => {
  return (
    <Modal id={1}>
      <OpacityInner />
    </Modal>
  );
};

const TIME = 500;
export const OpacityInner = () => {
  const [times, setTimes] = useState(0);
  const value = useFlowValue(TIME, 0, 1, 0);

  useEffect(() => {
    const id = setInterval(() => setTimes(t => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ transition: TIME + 'ms', opacity: value }}>Hello World: {times}</div>
  );
};