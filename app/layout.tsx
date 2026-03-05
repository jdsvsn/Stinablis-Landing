import type { Metadata } from "next";
import { Anton, Roboto } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
});

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ar-one",
});

export const metadata: Metadata = {
  title: "STINABLIS - Where Engineering Meets Sustainability",
  description: "Engineering meets sustainability in perfect harmony",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${anton.variable} ${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
