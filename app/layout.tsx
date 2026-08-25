import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Verification Portal",
    template: "%s | Verification Portal",
  },
  description:
    "Verify an asset's authenticity by scanning its QR code or entering the code provided with it.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="vf-page" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
