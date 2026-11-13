import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mock Test Platform",
  description: "Practice mock tests and improve your score",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
