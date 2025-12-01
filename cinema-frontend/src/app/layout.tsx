import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import {SessionProvider} from "@/app/session/SessionContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Group 27 Cinema E-Booking",
  description: "Group 27 Cinema E-Booking Project.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SessionProvider>
          <Header/>
          <main className="mx-auto max-w-screen-xl px-4 py-8">
              {children}
          </main>
      </SessionProvider>
      </body>
    </html>
  );
}
