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
    <div className="bg-muted/60 border-border flex items-center gap-1 rounded-lg border p-1">
      {locales.map(({ code, label }) => {
        const isActive = currentLocale === code;
        return (
          <Link key={code} href={pathname} locale={code}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="xs"
              className="cursor-pointer text-xs font-medium"
            >
              {label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
