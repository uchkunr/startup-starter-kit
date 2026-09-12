"use client";

import { LogIn, LogOut, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { useAuth } from "../lib/auth-context";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function Navbar() {
  const t = useTranslations("Nav");
  const { user, loading, logout } = useAuth();

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
              StartupKit
            </span>
            <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 font-mono text-xs">
              Turborepo
            </span>
          </Link>

          {user?.role === "ADMIN" && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Shield className="h-3.5 w-3.5" />
                  {t("adminUsers")}
                </Button>
              </Link>
              <Link href="/admin/sessions">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  {t("adminSessions")}
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name || "avatar"} />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {(user.name || user.username || user.email)
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden flex-col text-left sm:flex">
                      <span className="text-xs leading-none font-medium">
                        {user.name || user.username || user.email.split("@")[0]}
                      </span>
                      <span className="text-muted-foreground font-mono text-[10px] leading-tight">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {user.role === "ADMIN" && (
                    <Badge
                      variant="default"
                      className="hidden text-[10px] sm:inline-flex"
                    >
                      ADMIN
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => logout()}
                    title={t("logout")}
                    className="text-muted-foreground hover:text-destructive h-8 w-8 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer gap-1.5 text-xs font-medium"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      {t("signIn")}
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="default"
                      size="sm"
                      className="cursor-pointer text-xs font-medium"
                    >
                      {t("signUp")}
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
