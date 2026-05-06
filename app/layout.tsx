import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const dmSans = localFont({
  src: '/fonts/DMSans.ttf',
  variable: "--font-dm-sans",
});
const sequelSans = localFont({
  src: '/fonts/SequelSans.ttf',
  variable: "--font-sequel-sans",
});



export const metadata: Metadata = {
  title: "Sport News",
  description: "A news website about sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${sequelSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
