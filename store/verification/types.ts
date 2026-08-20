export type VerificationStatus =
  | "valid"
  | "invalid"
  | "expired"
  | "revoked";

export type VerificationError = {
  message: string;
  code?: string;
};

export type VerificationState =
  | {
      status: "idle";
    }
  | {
      status: "scanning";
    }
  | {
      status: "verifying";
    }
  | {
      status: "valid";
      result: VerificationResult;
    }
  | {
      status: "invalid";
      result?: VerificationResult;
    }
  | {
      status: "expired";
      result?: VerificationResult;
    }
  | {
      status: "revoked";
      result?: VerificationResult;
    }
  | {
      status: "error";
      error: VerificationError;
    };

export interface VerificationResult<TAsset = unknown> {
  verificationStatus: VerificationStatus;

  data: {
    asset: TAsset;
    verifiedAt: string;
  };
}