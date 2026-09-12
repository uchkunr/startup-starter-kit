"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  KeyRound,
  Laptop,
  RefreshCw,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Link } from "../../../../i18n/routing";
import { api, type Session } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth-context";

export default function AdminSessionsPage() {
  const t = useTranslations("Admin");
  const { user: currentUser, loading: authLoading } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadSessions = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.admin.getSessions();
      if (res.success) {
        setSessions(res.sessions);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load sessions";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role !== "ADMIN") return;

    let ignore = false;
    api.admin
      .getSessions()
      .then((res) => {
        if (!ignore && res.success) {
          setSessions(res.sessions);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Failed to load sessions";
          setError(msg);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm(t("confirmRevokeSession"))) return;
    try {
      await api.admin.revokeSession(sessionId);
      setSuccess("Session revoked successfully");
      await loadSessions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to revoke session";
      setError(msg);
    }
  };

  const handleRevokeAllUserSessions = async (userId: string, email: string) => {
    if (!confirm(`${t("confirmRevokeAllUserSessions")} (${email})`)) return;
    try {
      await api.admin.revokeUserSessions(userId);
      setSuccess(`All sessions revoked for ${email}`);
      await loadSessions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to revoke sessions";
      setError(msg);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="text-primary h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <Card className="mx-auto max-w-lg py-10 text-center">
        <CardHeader>
          <div className="bg-destructive/10 text-destructive mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">{t("accessDenied")}</CardTitle>
          <CardDescription>{t("adminPrivilegeRequired")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button variant="default" size="sm">
              {t("signInWithAdmin")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("sessionsManagementTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("sessionsManagementSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/users">
            <Button variant="outline" size="sm" className="cursor-pointer gap-1.5">
              <Users className="h-4 w-4" />
              {t("adminUsers")}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={loadSessions}
            title={t("refresh")}
            className="cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-lg border p-3 text-xs">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("colUser")}</TableHead>
                <TableHead>{t("colIpAddress")}</TableHead>
                <TableHead>{t("colDevice")}</TableHead>
                <TableHead>{t("colCreated")}</TableHead>
                <TableHead>{t("colExpires")}</TableHead>
                <TableHead className="text-right">{t("colActions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && sessions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground h-24 text-center text-xs"
                  >
                    {t("loadingSessions")}
                  </TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground h-24 text-center text-xs"
                  >
                    {t("noSessionsFound")}
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {s.user?.avatar ? (
                            <AvatarImage src={s.user.avatar} alt={s.user.name || ""} />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {(s.user?.name || s.user?.username || s.user?.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium">
                              {s.user?.name || s.user?.username || "—"}
                            </span>
                            {s.user?.role && (
                              <Badge
                                variant={s.user.role === "ADMIN" ? "default" : "outline"}
                                className="h-4 px-1 py-0 text-[9px]"
                              >
                                {s.user.role}
                              </Badge>
                            )}
                          </div>
                          <span className="text-muted-foreground font-mono text-[11px]">
                            {s.user?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                        <Globe className="h-3.5 w-3.5" />
                        {s.ipAddress || "127.0.0.1"}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div
                        className="text-muted-foreground flex max-w-xs items-center gap-1.5 truncate text-xs"
                        title={s.userAgent || ""}
                      >
                        <Laptop className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {s.userAgent || "Desktop Browser"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground text-[11px]">
                      {new Date(s.createdAt).toLocaleString()}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-[11px]">
                      {new Date(s.expiresAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground h-7 cursor-pointer text-xs hover:text-amber-500"
                          onClick={() =>
                            handleRevokeAllUserSessions(s.userId, s.user?.email || "user")
                          }
                          title={t("revokeAllSessions")}
                        >
                          <KeyRound className="mr-1 h-3.5 w-3.5" />
                          {t("revokeAll")}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-7 w-7 cursor-pointer"
                          onClick={() => handleRevokeSession(s.id)}
                          title={t("revokeSession")}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
