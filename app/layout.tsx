import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "sudoku-ai",
  description:
    "AI Problem Solving Agent which solves sudoku with varying difficulties(Easy, Medium,Hard)",
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
