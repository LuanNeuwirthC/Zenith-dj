import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ZenithProvider } from "@/components/providers/zenith-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zenith - Financial Ecosystem",
  description: "Gerencie suas finanças com inteligência.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ADICIONADO: suppressHydrationWarning
    // Isso diz ao React para ignorar diferenças causadas por extensões no nível do HTML
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ZenithProvider>
              {children}
            </ZenithProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}