import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frame Zero - Nightlife Content Engine",
  description: "Generate ready-to-post social media content for your nightlife business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
