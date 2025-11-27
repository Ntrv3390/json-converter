"use client";

import Providers from "./providers";
import Header from "./components/Header";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 1500,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
            reverseOrder={false}
          />
        </Providers>
      </body>
    </html>
  );
}
