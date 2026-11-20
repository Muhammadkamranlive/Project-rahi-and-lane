import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3010"),
  title: { default: "Lane — logistics operating system", template: "%s · Lane" },
  description: "Book, dispatch, warehouse, clear, and bill freight from one responsive desk. Role-gated administration for carriers, forwarders, and 3PLs.",
  openGraph: {
    title: "Lane",
    description: "Every shipment, dock, and driver on one desk.",
    type: "website"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#142033"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body>
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2">
          Skip to content
        </a>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
