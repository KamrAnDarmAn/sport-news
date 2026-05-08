import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider"

const dmSans = localFont({
  src: '/fonts/DMSans.ttf',
  variable: "--font-dm-sans",
  weight: "100 200 300 400 500 700 800 900",
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
      className={`h-full antialiased ${dmSans.variable} ${sequelSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col ">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >

          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
