// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // Importă provider-ul creat

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Satellite POS",
};

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // ACEASTA ESTE LINIA CRITICĂ:
    <html lang="ro" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}