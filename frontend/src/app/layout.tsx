import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Document Management System",
  description: "Manage virtual folders and documents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-slate-100 text-slate-900"
        suppressHydrationWarning
      >
        <QueryProvider>
          <Header />
          <div className="mx-auto flex w-full max-w-7xl flex-1">
            <Sidebar />
            <main className="w-full p-6">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
