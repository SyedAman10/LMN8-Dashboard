import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import PremiumEffects from "@/components/ui/PremiumEffects";

export const metadata = {
  title: "LMN8 — Therapeutic Presence Technology",
  description: "Ensuring no ketamine therapy patient ever experiences abandonment during their most vulnerable moments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <AuthProvider>
          <PremiumEffects />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
