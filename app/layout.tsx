import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-libre-franklin",
});

export const metadata: Metadata = {
  title: "Audit Ready | AI Banking IT Governance",
  description: "SAMA-aligned IT governance platform for Saudi banks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Metrophobic&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${libreFranklin.variable} font-sans bg-dark text-secondary-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
