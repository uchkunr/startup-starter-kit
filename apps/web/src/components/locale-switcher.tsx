"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "../i18n/routing";
import { Button } from "./ui/button";

const locales = [
  { code: "uz", label: "O'zbek" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
] as const;

export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
      {locales.map(({ code, label }) => {
        const isActive = currentLocale === code;
        return (
          <Link key={code} href={pathname} locale={code}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="xs"
              className="text-xs font-medium cursor-pointer"
            >
              {label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
