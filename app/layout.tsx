import type { Metadata } from "next";
import { Anton, Roboto, Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stinablis.com"),
  title: "STINABLIS | Engineering & Digital Manufacturing Solutions",
  description: "STINABLIS: 3D printing, custom automotive parts & rapid prototyping in Kuching, Malaysia. Digital manufacturing for industry & car enthusiasts.",
  keywords: [
    "STINABLIS",
    "3D printing Kuching",
    "custom automotive parts Malaysia",
    "rapid prototyping Sarawak",
    "digital manufacturing",
    "composite manufacturing",
    "reverse engineering Malaysia",
    "engineering software solutions"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "STINABLIS | Engineering & Digital Manufacturing Solutions",
    description: "STINABLIS: 3D printing, custom automotive parts & rapid prototyping in Kuching, Malaysia. Digital manufacturing for industry & car enthusiasts.",
    url: "https://stinablis.com",
    siteName: "STINABLIS",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo-new.png",
        width: 1200,
        height: 630,
        alt: "STINABLIS Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "STINABLIS | Engineering & Digital Manufacturing Solutions",
    description: "STINABLIS: 3D printing, custom automotive parts & rapid prototyping in Kuching, Malaysia. Digital manufacturing for industry & car enthusiasts.",
    images: ["/logo-new.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "STINABLIS",
  "image": "https://stinablis.com/logo-new.png",
  "@id": "https://stinablis.com/#organization",
  "url": "https://stinablis.com",
  "telephone": "+601160915670",
  "email": "info@stinablis.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Lot 1324, No.856, 1st Floor Tabuan Jaya",
    "addressLocality": "Kuching",
    "addressRegion": "Sarawak",
    "postalCode": "93350",
    "addressCountry": "MY"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 1.526568,
    "longitude": 110.375206
  },
  "sameAs": [
    "https://facebook.com/stinablis",
    "https://linkedin.com/company/stinablis"
  ],
  "description": "STINABLIS: 3D printing, custom automotive parts & rapid prototyping in Kuching, Malaysia. Digital manufacturing for industry & car enthusiasts."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${anton.variable} ${roboto.variable} ${syne.variable} ${dmSans.variable} font-roboto antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="grain"></div>
        <div className="scroll-bar" id="scrollBar"></div>
        {children}
      </body>
    </html>
  );
}
