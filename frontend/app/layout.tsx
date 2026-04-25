import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "./context/GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZF Halo | Control Patrimonial",
  description: "Sistema de gestión y trazabilidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Aquí inyectamos el cerebro global */}
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}