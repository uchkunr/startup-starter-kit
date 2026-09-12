import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { LocaleSwitcher } from "../../components/locale-switcher";
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
    <html lang={locale} className="h-full">
      <body className="min-h-screen bg-background text-foreground flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Startup Starter Kit
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-primary/10 text-primary border border-primary/20">
                  Turborepo
                </span>
              </div>
              <div className="flex items-center gap-4">
                <LocaleSwitcher />
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto max-w-6xl px-4 py-10">
            {children}
          </main>

          <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
            Startup Starter Kit • Next.js & Express.js Architecture
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
