import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { CookieBanner } from "@/components/CookieBanner";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raahi — trusted traveler delivery to and from Pakistan",
  description:
    "Find verified travelers going to Pakistani villages or leaving Pakistan. KYC, escrow, customs checks and GDPR built in.",
  applicationName: "Raahi",
  appleWebApp: { capable: true, title: "Raahi", statusBarStyle: "black-translucent" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#14643d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full">
        <StoreProvider>
          {children}
          <CookieBanner />
        </StoreProvider>
      </body>
    </html>
  );
}
