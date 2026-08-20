"use client";

import { createContext, useReducer, type ReactNode, type Dispatch } from "react";
import { verificationReducer, createInitialState, type Action } from "./verificationMachine";
import type { VerificationState } from "../types/verification.types";

type VerificationContextValue<TAsset, TErrorDetail> = {
  state: VerificationState<TAsset, TErrorDetail>;
  dispatch: Dispatch<Action<TAsset, TErrorDetail>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VerificationContext = createContext<VerificationContextValue<any, any> | undefined>(undefined);

function VerificationProvider<TAsset, TErrorDetail>({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    verificationReducer<TAsset, TErrorDetail>,
    undefined,
    () => createInitialState<TAsset, TErrorDetail>()
  );

  return (
    <VerificationContext.Provider value={{ state, dispatch }}>
      {children}
    </VerificationContext.Provider>
  );
}

export { VerificationContext, VerificationProvider };
export type { VerificationContextValue }; 