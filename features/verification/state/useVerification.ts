"use client";

import { useContext } from "react";
import { VerificationContext } from "./VerificationProvider";

function useVerification() {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error("useVerification must be used within a VerificationProvider");
  }
  return context;
}

export { useVerification };