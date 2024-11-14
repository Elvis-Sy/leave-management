import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { SocketProvider } from "@/helpers/socketProvider";

export const metadata: Metadata = {
  title: "Leave Management",
  description: "Plateforme de gestion de conge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='fr'>
      <body className="font-sans antialiased">
        <SocketProvider>
          <Providers>{children}</Providers>
        </SocketProvider>
      </body>
    </html>
  );
}
