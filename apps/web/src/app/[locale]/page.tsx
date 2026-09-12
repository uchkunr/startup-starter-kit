import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ApiHealthCheck } from "../../components/api-health-check";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <HomeContent params={params} />;
}

async function HomeContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeView />;
}

function HomeView() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <span>⚡ Turborepo Monorepo Architecture</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          {t("title")}
        </h1>
        <p className="text-xl font-medium text-muted-foreground">
          {t("subtitle")}
        </p>
        <p className="text-sm text-muted-foreground/80 max-w-xl mx-auto">
          {t("tagline")}
        </p>
      </section>

      {/* Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Web App Card */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                apps/web
              </span>
              <span className="text-xs text-muted-foreground font-mono">Next.js App Router</span>
            </div>
            <CardTitle className="text-xl mt-2">{t("webBadge")}</CardTitle>
            <CardDescription>
              Next.js 16 + shadcn UI + Tailwind CSS v4 + next-intl (i18n)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {t("demoFormTitle")}
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full"
              />
              <Input
                type="password"
                placeholder={t("passwordPlaceholder")}
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button className="cursor-pointer flex-1">{t("submitBtn")}</Button>
            <Button variant="outline" className="cursor-pointer flex-1">
              {t("registerBtn")}
            </Button>
          </CardFooter>
        </Card>

        {/* API App Card */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                apps/api
              </span>
              <span className="text-xs text-muted-foreground font-mono">Express.js 5</span>
            </div>
            <CardTitle className="text-xl mt-2">{t("apiBadge")}</CardTitle>
            <CardDescription>{t("apiCardDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-medium text-foreground">
                {t("apiTestLabel")}
              </span>
              <ApiHealthCheck />
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground font-mono">
              Port: 4000 • Modules: auth, user, health
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Tech Stack Highlights */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">{t("featuresTitle")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: "Turborepo", desc: "Build system", badge: "v2.10" },
            { name: "Next.js", desc: "App Router", badge: "v16" },
            { name: "shadcn UI", desc: "Design system", badge: "latest" },
            { name: "Tailwind CSS", desc: "Styling", badge: "v4" },
            { name: "next-intl", desc: "i18n router", badge: "uz/en/ru" },
            { name: "Express.js", desc: "Backend API", badge: "v5" },
            { name: "Prisma ORM", desc: "Database layer", badge: "v7" },
            { name: "Argon2", desc: "Password hash", badge: "latest" },
            { name: "Jose", desc: "JWT security", badge: "latest" },
            { name: "Zod", desc: "Validation", badge: "latest" },
            { name: "CORS", desc: "Cross-origin", badge: "latest" },
            { name: "pnpm", desc: "Workspaces", badge: "v12" },
          ].map((item) => (
            <div
              key={item.name}
              className="p-3 rounded-lg border border-border/80 bg-muted/30 flex flex-col justify-between"
            >
              <div>
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <div className="mt-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-background border border-border">
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
