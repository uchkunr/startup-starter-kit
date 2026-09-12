"use client";

import React, { useState } from "react";
import { Lock, Mail, Tag, User } from "lucide-react";
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

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError(t("invalidEmail"));
      return;
    }

    if (password.length < 6) {
      setError(t("passwordMinLength"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }

    setLoading(true);
    try {
      await register(email, password, username || undefined, name || undefined);
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register account";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center py-6">
      <Card className="border-border/80 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t("createAccountTitle")}
          </CardTitle>
          <CardDescription className="text-sm">
            {t("createAccountSubtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border p-3 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs leading-none font-medium">
                {t("emailLabel")} *
              </label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  type="email"
                  placeholder="alex@startup.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1.5">
                <label className="text-xs leading-none font-medium">
                  {t("usernameLabel")}
                </label>
                <div className="relative">
                  <Tag className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="alexsmith"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs leading-none font-medium">
                  {t("fullNameLabel")}
                </label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Alex Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs leading-none font-medium">
                {t("passwordLabel")} * (min 6)
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

            <div className="space-y-1.5">
              <label className="text-xs leading-none font-medium">
                {t("confirmPasswordLabel")} *
              </label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-9 text-sm"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 w-full cursor-pointer font-medium"
              disabled={loading}
            >
              {loading ? t("creatingAccount") : t("signUpButton")}
            </Button>
          </form>

          <SocialAuthButtons mode="register" onError={(err) => setError(err)} />

          <div className="text-muted-foreground mt-4 text-center text-xs">
            {t("hasAccountPrompt")}{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              {t("loginLink")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
