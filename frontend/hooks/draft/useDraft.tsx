import { useContext } from "react";
import { DraftContext } from "./DraftContext";


export const useDrafts = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error("useDrafts must be used within a DraftProvider");
  }
  return context;
};