import "./globals.css";
import {NextUIProvider} from "@nextui-org/react";

export const metadata = {
  title: "Leave-management",
  description: "Pour la gestion des congés",
}; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f1f1f1]">
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
