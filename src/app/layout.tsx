import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { Toaster } from "react-hot-toast";
import ConditionalAuthProvider from "@/components/providers/ConditionalAuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Beautify Merchant Dashboard",
  description: "Professional beauty services management platform",
  keywords: ["beauty", "salon", "merchant", "dashboard", "bookings"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
        <ReduxProvider>
          <ConditionalAuthProvider>
            {children}
          </ConditionalAuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#1f2937',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
              success: {
                style: {
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                },
              },
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
