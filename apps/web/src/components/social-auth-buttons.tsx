"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "../i18n/routing";
import { useAuth } from "../lib/auth-context";
import { Button } from "./ui/button";

interface SocialAuthButtonsProps {
  mode?: "login" | "register";
  onError?: (err: string) => void;
}

export function SocialAuthButtons({ onError }: SocialAuthButtonsProps) {
  const t = useTranslations("Auth");
  const { loginOAuth, loginTelegram } = useAuth();
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuth = async (provider: "google" | "github" | "apple" | "linkedin") => {
    setLoadingProvider(provider);
    try {
      // In production, this redirects to OAuth provider or opens popup.
      // For instant starter kit evaluation & local demo, simulates OAuth callback with provider payload.
      const mockId = Math.random().toString(36).substring(2, 10);
      const email = `${provider}_user_${mockId}@example.com`;
      const name = `${provider.charAt(0).toUpperCase() + provider.slice(1)} Explorer`;

      await loginOAuth({
        provider,
        providerAccountId: `${provider}_${mockId}`,
        email,
        name,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}_${mockId}`,
      });

      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "OAuth authentication failed";
      onError?.(msg);
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleTelegram = async () => {
    setLoadingProvider("telegram");
    try {
      const mockTgId = Math.floor(100000000 + Math.random() * 900000000);
      await loginTelegram({
        id: mockTgId,
        first_name: "Telegram",
        last_name: "User",
        username: `tg_${mockTgId}`,
        photo_url: `https://api.dicebear.com/7.x/bottts/svg?seed=tg_${mockTgId}`,
        auth_date: Math.floor(Date.now() / 1000),
        hash: "mock_telegram_signature_hash_valid",
      });

      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Telegram authentication failed";
      onError?.(msg);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative my-2 text-center text-xs">
        <div className="border-border absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <span className="bg-card text-muted-foreground relative px-2 text-[11px] tracking-wider uppercase">
          {t("orContinueWith")}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!!loadingProvider}
          onClick={() => handleOAuth("google")}
          className="cursor-pointer gap-2 text-xs font-medium"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.07.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.35 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.43l4.02-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.65 1.26 6.57l4.02 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
            />
          </svg>
          Google
        </Button>

        {/* GitHub */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!!loadingProvider}
          onClick={() => handleOAuth("github")}
          className="cursor-pointer gap-2 text-xs font-medium"
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </Button>

        {/* Apple */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!!loadingProvider}
          onClick={() => handleOAuth("apple")}
          className="cursor-pointer gap-2 text-xs font-medium"
        >
          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.02-.48 2.64-1.23z" />
          </svg>
          Apple
        </Button>

        {/* LinkedIn */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!!loadingProvider}
          onClick={() => handleOAuth("linkedin")}
          className="cursor-pointer gap-2 text-xs font-medium"
        >
          <svg className="h-4 w-4 fill-[#0A66C2]" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.39 9.74v-8.37H5.07v8.37h2.78z" />
          </svg>
          LinkedIn
        </Button>
      </div>

      {/* Telegram */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!!loadingProvider}
        onClick={handleTelegram}
        className="w-full cursor-pointer gap-2 text-xs font-medium hover:border-[#229ED9]/40 hover:bg-[#229ED9]/10"
      >
        <svg className="h-4 w-4 fill-[#229ED9]" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.196 1.006.128.832.941z" />
        </svg>
        {t("continueWithTelegram")}
      </Button>
    </div>
  );
}
