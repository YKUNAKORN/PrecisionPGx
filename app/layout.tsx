// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import LayoutWrapper from "./LayoutWrapper";
import { ThemeDebug } from "@/components/ThemeDebug";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Precision-PGX",
  description: "Precision Pharmacogenomics Laboratory Information Management System",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased `} >
        <Providers>
          <LayoutWrapper>
            <div className=" mx-auto w-full p-4 my-10 ">
              {children}
            </div>

          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
