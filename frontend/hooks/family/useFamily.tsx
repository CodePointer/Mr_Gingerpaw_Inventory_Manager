import { useContext } from "react";
import { FamilyContext } from "./FamilyContext";


export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
      throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
};