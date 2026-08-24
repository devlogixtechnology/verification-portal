import { NextResponse } from "next/server";
import { MOCK_VERIFIED_DOCUMENTS } from "@/features/verification/config/verification.config";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const decodedToken = decodeURIComponent(token).trim();

  // 1. Check known mock records
  if (MOCK_VERIFIED_DOCUMENTS[decodedToken]) {
    const doc = MOCK_VERIFIED_DOCUMENTS[decodedToken];
    if (doc.status === "active") {
      return NextResponse.json({
        success: true,
        valid: true,
        data: doc,
      });
    }

    if (doc.status === "expired") {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          reason: "expired",
          message: "This certificate has expired and is no longer valid.",
          data: doc,
        },
        { status: 410 }
      );
    }

    if (doc.status === "revoked") {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          reason: "revoked",
          message: "This certificate has been revoked by the issuing authority.",
          data: doc,
        },
        { status: 403 }
      );
    }
  }

  // 2. Generic demo fallback for any standard code starting with CERT, DOC, DL, or DEMO
  if (
    decodedToken.toUpperCase().startsWith("CERT") ||
    decodedToken.toUpperCase().startsWith("DOC") ||
    decodedToken.toUpperCase().startsWith("DL") ||
    decodedToken.toUpperCase().startsWith("DEMO") ||
    decodedToken.length >= 6
  ) {
    return NextResponse.json({
      success: true,
      valid: true,
      data: {
        id: `doc-${decodedToken.toLowerCase()}`,
        documentType: "Verified Digital Asset",
        title: "Official Verification Record",
        referenceNumber: decodedToken,
        issuanceDate: new Date(Date.now() - 30 * 86400000).toISOString(),
        status: "active",
        issuer: {
          name: "DevLogix Verification Authority",
          designation: "Authorized Trust Network",
          verifiedBadge: true,
          website: "https://devlogix.online",
        },
        recipient: {
          name: "Authenticated Holder",
          email: "holder@devlogix.online",
          identifier: `USR-${decodedToken.slice(0, 6)}`,
        },
        additionalData: {
          Registry: "Mainnet Trust Layer",
          IntegrityCheck: "SHA-256 Passed",
        },
        verifiedAt: new Date().toISOString(),
      },
    });
  }

  // 3. Not Found
  return NextResponse.json(
    {
      success: false,
      valid: false,
      reason: "not_found",
      message: `No active record found for token: ${decodedToken}`,
    },
    { status: 404 }
  );
}

