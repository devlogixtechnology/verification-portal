// server.js
//
// Three fake "backends" pretending to be three different clients' real
// verification systems. They share this ONE file just for convenience —
// each one still behaves as if it's a totally separate, unrelated server.
// That's why each has its own token table and its own document shape.

const express = require("express");
const cors = require("cors");

// ---------------------------------------------------------------------
// PART A: The "databases" (just plain JS objects, no real DB needed)
// ---------------------------------------------------------------------
// Each key is a token string. Each value describes what should happen
// when someone requests /verify/<that token>.
//
// Notice: Project A's valid document fields (eventName, seat, holder)
// look NOTHING like Project C's membership fields (tier, memberSince).
// That mismatch is intentional -- it's the whole point of the exercise.

const PROJECT_A_TOKENS = {
  "DOC-1001": {
    verificationStatus: "valid",
    message: "Document verified successfully.",
    data: {
      document: {
        assetType: "document",
        title: "Non-Disclosure Agreement",
        issuedTo: "Ayesha Raza",
        issuedOn: "2026-02-10",
      },
    },
  },
  "DOC-1002": {
    verificationStatus: "expired",
    message: "This document has expired.",
    data: {
      expiredAt: "2026-01-15T18:00:00Z",
    },
  },
};

const PROJECT_B_TOKENS = {
  "CERT-2001": {
    verificationStatus: "valid",
    message: "Certificate verified successfully.",
    data: {
      document: {
        assetType: "certificate",
        courseTitle: "Full-Stack Web Development",
        recipientName: "Bilal Khan",
        issuedOn: "2025-11-01",
      },
    },
  },
  "CERT-2002": {
    verificationStatus: "revoked",
    message: "This certificate has been revoked by the issuing authority.",
    data: {},
  },
};

const PROJECT_C_TOKENS = {
  "HANDOFF-3001": {
    verificationStatus: "valid",
    message: "Project handoff verified successfully.",
    data: {
      document: {
        assetType: "project handoff",
        projectName: "Client Portal Redesign",
        deliveredBy: "Squad Nova",
        deliveredTo: "Client Ops Team",
        handoffDate: "2026-06-01",
        includesSourceCode: true,
      },
    },
  },
  "HANDOFF-3002": {
    verificationStatus: "expired",
    message: "This project handoff link has expired.",
    data: {
      expiredAt: "2026-03-01T00:00:00Z",
    },
  },
  "CONTRACT-4001": {
    verificationStatus: "valid",
    message: "Signed contract verified successfully.",
    data: {
      document: {
        assetType: "signed contract",
        contractRef: "SC-2026-0044",
        parties: ["Devlogix", "Client Co."],
        signedOn: "2026-05-20",
      },
    },
  },
  "CONTRACT-4002": {
    verificationStatus: "revoked",
    message: "This contract has been revoked.",
    data: {},
  },
};

// ---------------------------------------------------------------------
// PART B: The reusable "brain" -- one function all three ports share
// ---------------------------------------------------------------------
// Instead of writing the same /verify/:token logic three times, we write
// it ONCE and hand it a different token table depending on which port
// is asking. This is just to keep our own code DRY -- it has nothing to
// do with the "portability" the spec cares about (that's about the
// FRONTEND code, not this).

function createVerifyHandler(tokenTable) {
  return (req, res) => {
    const { token } = req.params;

    // --- The 3 special "trap" tokens, identical behavior everywhere ---
    if (token === "TIMEOUT-TEST") {
      // Deliberately never call res.send() or res.json().
      // The connection just hangs, forcing the frontend's own timeout
      // logic to kick in (this is why the frontend even NEEDS a timeout).
      return;
    }

    if (token === "SERVER-ERROR-TEST") {
      // A real 500 error with nothing useful in the body -- tests the
      // frontend's generic "something went wrong on the server" path.
      return res.status(500).end();
    }

    if (token === "MALFORMED-TEST") {
      // HTTP 200 (success!) but the body isn't valid JSON at all.
      // Tests what happens when the frontend tries to .json() this
      // and it blows up.
      res.set("Content-Type", "text/plain");
      return res.status(200).send("<<<not valid json>>>");
    }

    // --- Normal lookup ---
    const entry = tokenTable[token];

    if (!entry) {
      // Unknown token -> generic "invalid", no `data` key at all.
      return res.status(200).json({
        success: false,
        verificationStatus: "invalid",
        message: "This code does not correspond to a known document",
      });
    }

    // Known token -> use whatever we defined above for it.
    return res.status(200).json({
      success: entry.verificationStatus === "valid",
      verificationStatus: entry.verificationStatus,
      message: entry.message,
      data: entry.data,
    });
  };
}

// ---------------------------------------------------------------------
// PART C: Spin up three independent servers
// ---------------------------------------------------------------------

function makeApp(tokenTable) {
  const app = express();
  app.use(cors()); // allow requests from any origin (e.g. localhost:3000)
  app.get("/verify/:token", createVerifyHandler(tokenTable));
  return app;
}

const PORT_A = 4001;
const PORT_B = 4002;
const PORT_C = 4003;

makeApp(PROJECT_A_TOKENS).listen(PORT_A, () => {
  console.log(`Project A mock backend running on http://localhost:${PORT_A}`);
});

makeApp(PROJECT_B_TOKENS).listen(PORT_B, () => {
  console.log(`Project B mock backend running on http://localhost:${PORT_B}`);
});

makeApp(PROJECT_C_TOKENS).listen(PORT_C, () => {
  console.log(`Project C mock backend running on http://localhost:${PORT_C}`);
});
