
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import RootClientLayout from "./utils/Layout";

export const metadata: Metadata = {
  title: "Tecnoesis 2024 Admin Panel",
  description: "The Admin Panel for Tecnoesis 2024",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="dark">
        <RootClientLayout>{children}</RootClientLayout>
      </body>
    </html>
  );
}
