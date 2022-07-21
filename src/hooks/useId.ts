import { useMemo } from "react";
import { getId } from "../utils/getId";

export const useId = () => {
  return useMemo(getId, []);
};