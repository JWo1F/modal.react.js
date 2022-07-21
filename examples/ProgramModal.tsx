import React from "react";
import {showModal} from "../src/utils/showModal";
import {OpacityInner} from "./OpacityModal";

export const ProgramModal = () => {
  const open = () => {
    showModal(1, (res) => {
      return (
        <div onClick={() => res()}>
          <OpacityInner />
        </div>
      );
    });
  };

  return (
    <div onClick={open}>Program Modal</div>
  );
};