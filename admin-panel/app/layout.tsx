// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: {
    default: "BarManager — Sistem POS pentru Baruri & Restaurante | QR Ordering",
    template: "%s | BarManager",
  },
  description:
    "BarManager este platforma SaaS de management bar cu comenzi QR self-service, împărțire cont individual și analiză în timp real. 5€/masă/lună — mai ieftin decât un POS clasic. Bar management software, restaurant POS, QR ordering system.",
  keywords: [
    // RO
    "sistem POS bar",
    "management bar software",
    "comenzi QR restaurant",
    "soft gestiune bar",
    "bon individual masa",
    "aplicatie comenzi restaurant",
    "QR meniu digital",
    "sistem comenzi masă",
    "POS restaurant Romania",
    "gestiune mese restaurant",
    // EN
    "bar management software",
    "restaurant POS system",
    "QR ordering system",
    "self-service QR menu",
    "table management app",
    "bill splitting software",
    "digital menu restaurant",
    "SaaS bar POS",
    "bar ordering app",
    "real-time bar analytics",
  ],
  authors: [{ name: "BarManager Team" }],
  creator: "BarManager",
  openGraph: {
    title: "BarManager — Servește mai repede. Câștigă mai mult.",
    description:
      "Platforma inteligentă de management bar. Comenzi QR, bon individual, zone drag-and-drop. 5€/masă/lună.",
    type: "website",
    locale: "ro_RO",
    alternateLocale: "en_GB",
    siteName: "BarManager",
  },
  twitter: {
    card: "summary_large_image",
    title: "BarManager — Sistem POS Modern pentru Baruri",
    description:
      "QR self-service, împărțire cont, analytics timp real. Pornește gratuit, plătești 5€/masă activă.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}