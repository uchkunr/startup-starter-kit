"use client";

import React from "react";
import { ArrowRight, Globe, KeyRound, Moon, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiHealthCheck } from "../../components/api-health-check";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Link } from "../../i18n/routing";
import { useAuth } from "../../lib/auth-context";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-10">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl space-y-4 pt-4 text-center">
        <div className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
          <span>⚡ Turborepo Monorepo Architecture</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-xl font-medium">{t("subtitle")}</p>
        <p className="text-muted-foreground/80 mx-auto max-w-xl text-sm">
          {t("tagline")}
        </p>

        {/* Quick Auth Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <div className="border-primary/20 bg-primary/5 flex items-center gap-3 rounded-xl border p-2 px-4">
              <Avatar className="h-7 w-7">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name || ""} />
                ) : null}
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {(user.name || user.username || user.email).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">
                {t("welcomeUser")}{" "}
                <strong className="text-foreground">
                  {user.name || user.username || user.email}
                </strong>
              </span>
              <Badge
                variant={user.role === "ADMIN" ? "default" : "outline"}
                className="text-[10px]"
              >
                {user.role}
              </Badge>
              {user.role === "ADMIN" && (
                <Link href="/admin/users">
                  <Button size="xs" variant="default" className="cursor-pointer gap-1">
                    <Shield className="h-3 w-3" />
                    {t("goToAdmin")}
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button size="sm" variant="default" className="cursor-pointer gap-1.5">
                  {t("goToLogin")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="outline" className="cursor-pointer">
                  {t("registerBtn")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Feature Badges Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="border-border/80">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold">Multi-Auth Ready</div>
              <div className="text-muted-foreground text-[11px]">
                Google, GitHub, Apple, LinkedIn, TG
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold">Admin Panel & CRUD</div>
              <div className="text-muted-foreground text-[11px]">
                Users management & sessions control
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold">Multilingual i18n</div>
              <div className="text-muted-foreground text-[11px]">
                English, Russian, Uzbek
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <Moon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold">Dark / Light Mode</div>
              <div className="text-muted-foreground text-[11px]">
                Tailwind CSS v4 + next-themes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Web App Card */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                apps/web
              </span>
              <span className="text-muted-foreground font-mono text-xs">
                Next.js App Router
              </span>
            </div>
            <CardTitle className="mt-2 text-xl">{t("webBadge")}</CardTitle>
            <CardDescription>
              Next.js 16 + shadcn UI + Tailwind CSS v4 + next-intl (i18n)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-xs">{t("demoFormTitle")}</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/login">
                <Button variant="outline" className="w-full cursor-pointer text-xs">
                  {t("submitBtn")}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="default" className="w-full cursor-pointer text-xs">
                  {t("registerBtn")}
                </Button>
              </Link>
            </div>
            <div className="border-border/60 bg-muted/20 text-muted-foreground rounded-lg border p-3 text-xs">
              <div className="text-foreground mb-1 font-semibold">
                Available Providers:
              </div>
              Google • GitHub • Apple • LinkedIn • Telegram • Email • Username (Password
              min 6)
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/users" className="w-full">
              <Button
                variant="secondary"
                className="w-full cursor-pointer gap-1.5 text-xs"
              >
                <Shield className="h-3.5 w-3.5" />
                {t("goToAdmin")}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* API App Card */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                apps/api
              </span>
              <span className="text-muted-foreground font-mono text-xs">
                Express.js 5
              </span>
            </div>
            <CardTitle className="mt-2 text-xl">{t("apiBadge")}</CardTitle>
            <CardDescription>{t("apiCardDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-foreground text-xs font-medium">
                {t("apiTestLabel")}
              </span>
              <ApiHealthCheck />
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-muted-foreground font-mono text-xs">
              Port: 4000 • Modules: auth, admin, users, health
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Tech Stack Highlights */}
      <section className="border-border bg-card rounded-2xl border p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">{t("featuresTitle")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { name: "Turborepo", desc: "Build system", badge: "v2.10" },
            { name: "Next.js", desc: "App Router", badge: "v16" },
            { name: "shadcn UI", desc: "Design system", badge: "latest" },
            { name: "Tailwind CSS", desc: "Styling", badge: "v4" },
            { name: "next-intl", desc: "i18n router", badge: "uz/en/ru" },
            { name: "next-themes", desc: "Dark / Light", badge: "latest" },
            { name: "Express.js", desc: "Backend API", badge: "v5" },
            { name: "Prisma ORM", desc: "Database layer", badge: "v7" },
            { name: "Argon2", desc: "Password hash", badge: "latest" },
            { name: "Jose", desc: "JWT security", badge: "latest" },
            { name: "Zod", desc: "Validation", badge: "latest" },
            { name: "pnpm", desc: "Workspaces", badge: "v12" },
          ].map((item) => (
            <div
              key={item.name}
              className="border-border/80 bg-muted/30 flex flex-col justify-between rounded-lg border p-3"
            >
              <div>
                <div className="text-sm font-semibold">{item.name}</div>
                <div className="text-muted-foreground text-xs">{item.desc}</div>
              </div>
              <div className="mt-2">
                <span className="bg-background border-border rounded border px-1.5 py-0.5 font-mono text-[10px]">
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
