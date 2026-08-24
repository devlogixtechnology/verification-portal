import { NextResponse } from "next/server";
import { MOCK_VERIFIED_DOCUMENTS } from "@/features/verification/config/verification.config";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const decodedToken = decodeURIComponent(token).trim();

  // Test Route for Simulated Server / Network Error (Screen 3)
  if (decodedToken.toUpperCase() === "ERROR-500" || decodedToken.toUpperCase() === "FAIL-500") {
    return NextResponse.json(
      {
        success: false,
        valid: false,
        reason: "server_error",
        message: "There was a problem in verifying your asset. Please check your network and try again.",
      },
      { status: 500 }
    );
  }

  // 1. Check known mock records (CERT-2026-001, VALID-001, CERT-EXPIRED-002, CERT-REVOKED-003)
  if (MOCK_VERIFIED_DOCUMENTS[decodedToken]) {
    const doc = MOCK_VERIFIED_DOCUMENTS[decodedToken];

    if (doc.status === "active") {
      return NextResponse.json(
        {
          success: true,
          valid: true,
          data: doc,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        }
      );
    }

    if (doc.status === "expired") {
      return NextResponse.json(
        {
          success: false,
          valid: false,
          reason: "expired",
          message: `This asset expired at 15/01/2025.`,
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
          message: "This asset has been revoked by the issuing authority.",
          data: doc,
        },
        { status: 403 }
      );
    }
  }

  // 2. Generic demo fallback for custom tokens with prefix CERT, DOC, DL, VALID, or DEMO
  if (
    decodedToken.toUpperCase().startsWith("CERT") ||
    decodedToken.toUpperCase().startsWith("DOC") ||
    decodedToken.toUpperCase().startsWith("DL") ||
    decodedToken.toUpperCase().startsWith("VALID") ||
    decodedToken.toUpperCase().startsWith("DEMO") ||
    decodedToken.length >= 6
  ) {
    return NextResponse.json(
      {
        success: true,
        valid: true,
        data: {
          id: `doc-${decodedToken.toLowerCase()}`,
          documentType: "Verified Digital Asset",
          title: "Client Portal Redesign",
          referenceNumber: decodedToken,
          issuanceDate: new Date(Date.now() - 15 * 86400000).toISOString(),
          status: "active",
          issuer: {
            name: "Squad Nova",
            designation: "Authorized Trust Network",
            verifiedBadge: true,
            website: "https://devlogix.online",
          },
          recipient: {
            name: "Client Ops Team",
            email: "ops@clientportal.com",
            identifier: `USR-${decodedToken.slice(0, 6)}`,
          },
          additionalData: {
            "Source Code": "Present",
            Status: "Valid",
          },
          verifiedAt: new Date().toISOString(),
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  // 3. Unrecognized Token Not Found
  return NextResponse.json(
    {
      success: false,
      valid: false,
      reason: "not_found",
      message: `No active credential found matching token: "${decodedToken}".`,
    },
    { status: 404 }
  );
}
