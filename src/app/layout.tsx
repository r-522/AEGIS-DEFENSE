import type { Metadata, Viewport } from "next";
import { Cinzel, Rajdhani, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AEGIS DEFENSE",
  description: "Defend the living fortress Aegis. Third-person roguelite tower defense.",
  keywords: ["tower defense", "roguelite", "3D", "action", "strategy"],
  openGraph: {
    title: "AEGIS DEFENSE",
    description: "Defend the fortress. Command the towers. Survive the siege.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0E12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${cinzel.variable} ${rajdhani.variable} ${inter.variable}`}
    >
      <body className="bg-obsidian text-bone antialiased">
        {children}
      </body>
    </html>
  );
}
