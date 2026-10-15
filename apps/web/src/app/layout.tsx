import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Flow Remake", description: "Voice dictation that keeps your meaning intact." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
