import type { Metadata, Viewport } from "next";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://verify.devlogix.online"),
  title: {
    default: "DevLogix Verification Portal | Official Document Authenticity",
    template: "%s | DevLogix Verification",
  },
  description:
    "Official verification portal for DevLogix issued letters, certificates, and credentials. Real-time cryptographic validation and tamper-proof verification.",
  keywords: [
    "DevLogix",
    "verification portal",
    "certificate verification",
    "document authenticity",
    "credential verification",
    "QR code verification",
    "tamper-proof",
    "Squad Nova",
  ],
  authors: [{ name: "DevLogix", url: "https://devlogix.online" }],
  creator: "DevLogix",
  publisher: "DevLogix",
  alternates: {
    canonical: "https://verify.devlogix.online",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "DevLogix Verification Portal",
    description:
      "Verify authentic DevLogix issued letters and certificates instantly via QR code or verification token.",
    url: "https://verify.devlogix.online",
    siteName: "DevLogix Verification Portal",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/devlogix-logo.svg",
        width: 1023,
        height: 221,
        alt: "DevLogix Verification Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevLogix Verification Portal",
    description:
      "Official verification portal for DevLogix issued credentials and certificates.",
    images: ["/devlogix-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/devlogix-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/devlogix-logo.svg",
    apple: "/devlogix-logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0acab7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "DevLogix Verification Portal",
    url: "https://verify.devlogix.online",
    description:
      "Official verification portal for DevLogix issued letters, certificates, and credentials.",
    applicationCategory: "SecurityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "DevLogix",
      url: "https://devlogix.online",
      logo: "https://verify.devlogix.online/devlogix-logo.svg",
    },
  };

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] bg-portal-mesh text-[var(--foreground)]">
        {/* Shared Top Navigation Header */}
        <Header />

        {/* Responsive Centered Shell */}
        <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 sm:py-12">
          <div className="w-full max-w-[480px]">
            {children}
          </div>
        </main>

        {/* Shared Bottom Footer */}
        <Footer />
      </body>
    </html>
  );
}
