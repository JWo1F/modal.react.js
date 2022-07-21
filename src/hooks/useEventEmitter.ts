import { useMemo } from "react";
import {eventEmitter} from "../utils/eventEmitter";

export const useEventEmitter = () => {
  return useMemo(eventEmitter, []);
};