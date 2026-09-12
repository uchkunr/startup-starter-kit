import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../components/navbar";
import { ThemeProvider } from "../../components/theme-provider";
import { routing } from "../../i18n/routing";
import { AuthProvider } from "../../lib/auth-context";
import "../globals.css";

export const metadata: Metadata = {
  title: "Startup Starter Kit | Turborepo Monorepo",
  description: "Next.js 16 + shadcn UI + Tailwind CSS v4 + Express.js API",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <body className="bg-background text-foreground flex min-h-screen flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <AuthProvider>
              <Navbar />
              <main className="container mx-auto max-w-6xl flex-1 px-4 py-8">
                {children}
              </main>
              <footer className="border-border/60 text-muted-foreground border-t py-6 text-center text-xs">
                Startup Starter Kit • Next.js & Express.js Architecture
              </footer>
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
