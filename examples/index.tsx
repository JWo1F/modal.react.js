import React from "react";
import ReactDOM from "react-dom/client";
import { ModalsArea } from "../src";
import { SimpleModal } from "./SimpleModal";
import { OpacityModal } from "./OpacityModal";
import {ProgramModal} from "./ProgramModal";

const div = document.createElement('div');
document.body.appendChild(div);

const root = ReactDOM.createRoot(div);

root.render(
  <div>
    <ModalsArea id={1}>
      <SimpleModal />
      <OpacityModal />
      <ProgramModal />
    </ModalsArea>
  </div>
);