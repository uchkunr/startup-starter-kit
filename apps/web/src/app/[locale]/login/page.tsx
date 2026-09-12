"use client";

import React, { useState } from "react";
import { Lock, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { SocialAuthButtons } from "../../../components/social-auth-buttons";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Link, useRouter } from "../../../i18n/routing";
import { useAuth } from "../../../lib/auth-context";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const { login } = useAuth();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(t("identifierRequired"));
      return;
    }

    if (password.length < 6) {
      setError(t("passwordMinLength"));
      return;
    }

    setLoading(true);
    try {
      await login(identifier, password);
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center py-8">
      <Card className="border-border/80 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t("welcomeBack")}
          </CardTitle>
          <CardDescription className="text-sm">{t("loginSubtitle")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border p-3 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs leading-none font-medium">
                {t("identifierLabel")}
              </label>
              <div className="relative">
                <User className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={t("identifierPlaceholder")}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs leading-none font-medium">
                {t("passwordLabel")}
              </label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 text-sm"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer font-medium"
              disabled={loading}
            >
              {loading ? t("signingIn") : t("signInButton")}
            </Button>
          </form>

          <SocialAuthButtons mode="login" onError={(err) => setError(err)} />

          <div className="text-muted-foreground mt-4 text-center text-xs">
            {t("noAccountPrompt")}{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              {t("registerLink")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
