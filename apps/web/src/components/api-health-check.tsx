"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";

export function ApiHealthCheck() {
  const t = useTranslations("HomePage");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    data?: unknown;
    error?: string;
  } | null>(null);

  async function checkHealth() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:4000/api/health", {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: unknown = await res.json();
      setResult({ ok: true, data });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch";
      setResult({
        ok: false,
        error: message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button
          onClick={checkHealth}
          disabled={loading}
          variant="outline"
          className="cursor-pointer font-medium"
        >
          {loading ? t("checking") : t("checkApiBtn")}
        </Button>

        {result && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              result.ok
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                result.ok ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
              }`}
            />
            {result.ok ? t("apiOnline") : t("apiOffline")}
          </span>
        )}
      </div>

      {result?.data !== undefined && (
        <pre className="p-3 bg-muted rounded-lg text-xs font-mono overflow-x-auto text-muted-foreground border border-border">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}
    </div>
  );
}
