import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import { Analytics } from "@vercel/analytics/next";

export const metadata = { /* ... */ };

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body>
        <LangProvider>{children}</LangProvider>
        <Analytics />
      </body>
    </html>
  );
}
