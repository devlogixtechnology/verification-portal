"use client";

import { createContext, useReducer, type ReactNode, type Dispatch } from "react";
import { verificationReducer, initialState, type Action } from "./verificationMachine";
import type { VerificationState } from "../types/verification.types";

type VerificationContextValue = {
  state: VerificationState;
  dispatch: Dispatch<Action>;
};

const VerificationContext = createContext<VerificationContextValue | undefined>(undefined);

function VerificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(verificationReducer, initialState);

  return (
    <VerificationContext.Provider value={{ state, dispatch }}>
      {children}
    </VerificationContext.Provider>
  );
}

export { VerificationContext, VerificationProvider };