import React, { useEffect, useState } from "react";
import { Modal } from "../src";

export const SimpleModal = () => {
  const [v, sv] = useState(false);

  return (
    <div>
      <div onClick={() => sv(!v)}>Simple Modal: {v ? 'ON' : 'OFF'}</div>
      {v && <Ticker/>}
    </div>
  );
};

export const Ticker = () => {
  return (
    <Modal id={1}>
      <TickerInner />
    </Modal>
  );
};

export const TickerInner = () => {
  const [times, setTimes] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTimes(t => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div>Hello World: {times}</div>
  );
};