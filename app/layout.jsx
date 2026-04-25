import "./globals.css";
import { LangProvider } from "@/components/LangProvider";

export const metadata = { /* ... */ };

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
