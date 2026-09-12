"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  KeyRound,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCheck,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Link } from "../../../../i18n/routing";
import { api, type User } from "../../../../lib/api";
import { useAuth } from "../../../../lib/auth-context";

export default function AdminUsersPage() {
  const t = useTranslations("Admin");
  const { user: currentUser, loading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    name: "",
    password: "",
    role: "USER" as "USER" | "ADMIN",
    status: "ACTIVE" as "ACTIVE" | "SUSPENDED",
  });

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.admin.getUsers({
        search: search || undefined,
        role: (roleFilter as "USER" | "ADMIN") || undefined,
        status: (statusFilter as "ACTIVE" | "SUSPENDED") || undefined,
      });
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load users";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    if (currentUser?.role !== "ADMIN") return;

    let ignore = false;
    api.admin
      .getUsers({
        search: search || undefined,
        role: (roleFilter as "USER" | "ADMIN") || undefined,
        status: (statusFilter as "ACTIVE" | "SUSPENDED") || undefined,
      })
      .then((res) => {
        if (!ignore && res.success) {
          setUsers(res.users);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Failed to load users";
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
  }, [currentUser, search, roleFilter, statusFilter]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.admin.createUser({
        email: formData.email,
        username: formData.username || undefined,
        name: formData.name || undefined,
        password: formData.password,
        role: formData.role,
        status: formData.status,
      });
      setSuccess("User created successfully");
      setIsCreateOpen(false);
      setFormData({
        email: "",
        username: "",
        name: "",
        password: "",
        role: "USER",
        status: "ACTIVE",
      });
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create user";
      setError(msg);
    }
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormData({
      email: u.email,
      username: u.username || "",
      name: u.name || "",
      password: "",
      role: u.role,
      status: u.status,
    });
    setIsEditOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setError(null);
    try {
      await api.admin.updateUser(editingUser.id, {
        email: formData.email,
        username: formData.username || undefined,
        name: formData.name || undefined,
        role: formData.role,
        status: formData.status,
        password: formData.password ? formData.password : undefined,
      });
      setSuccess("User updated successfully");
      setIsEditOpen(false);
      setEditingUser(null);
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update user";
      setError(msg);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm(t("confirmDeleteUser"))) return;
    try {
      await api.admin.deleteUser(id);
      setSuccess("User deleted successfully");
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete user";
      setError(msg);
    }
  };

  const handleToggleStatus = async (u: User) => {
    const nextStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await api.admin.updateUser(u.id, { status: nextStatus });
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      setError(msg);
    }
  };

  const handleRevokeSessions = async (userId: string) => {
    if (!confirm(t("confirmRevokeAllSessions"))) return;
    try {
      await api.admin.revokeUserSessions(userId);
      setSuccess("All user sessions revoked");
      await loadUsers();
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

  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("usersManagementTitle")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("usersManagementSubtitle")}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/sessions">
            <Button variant="outline" size="sm" className="cursor-pointer gap-1.5">
              <KeyRound className="h-4 w-4" />
              {t("viewAllSessions")}
            </Button>
          </Link>

          <Button
            onClick={() => {
              setFormData({
                email: "",
                username: "",
                name: "",
                password: "",
                role: "USER",
                status: "ACTIVE",
              });
              setIsCreateOpen(true);
            }}
            size="sm"
            className="cursor-pointer gap-1.5"
          >
            <Plus className="h-4 w-4" />
            {t("addNewUser")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">
                {t("totalUsers")}
              </p>
              <p className="text-xl font-bold">{users.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">
                {t("activeUsers")}
              </p>
              <p className="text-xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">{t("admins")}</p>
              <p className="text-xl font-bold">{adminCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
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

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label={t("filterRoleAll")}
                className="bg-background border-border rounded-lg border px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="">{t("filterRoleAll")}</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label={t("filterStatusAll")}
                className="bg-background border-border rounded-lg border px-2.5 py-1.5 text-xs outline-none"
              >
                <option value="">{t("filterStatusAll")}</option>
                <option value="ACTIVE">{t("statusActive")}</option>
                <option value="SUSPENDED">{t("statusSuspended")}</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                onClick={loadUsers}
                title={t("refresh")}
                className="cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("colUser")}</TableHead>
                <TableHead>{t("colRole")}</TableHead>
                <TableHead>{t("colStatus")}</TableHead>
                <TableHead>{t("colSessions")}</TableHead>
                <TableHead>{t("colCreated")}</TableHead>
                <TableHead className="text-right">{t("colActions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground h-24 text-center text-xs"
                  >
                    {t("loadingUsers")}
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-muted-foreground h-24 text-center text-xs"
                  >
                    {t("noUsersFound")}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {u.avatar ? (
                            <AvatarImage src={u.avatar} alt={u.name || ""} />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {(u.name || u.username || u.email).charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">
                            {u.name || u.username || "—"}
                          </span>
                          <span className="text-muted-foreground font-mono text-[11px]">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={u.role === "ADMIN" ? "default" : "outline"}
                        className="text-[10px]"
                      >
                        {u.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={u.status === "ACTIVE" ? "secondary" : "destructive"}
                        className="cursor-pointer text-[10px]"
                        onClick={() => handleToggleStatus(u)}
                        title={t("clickToToggleStatus")}
                      >
                        {u.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-mono text-xs">
                      {u._count?.sessions ?? 0}
                    </TableCell>

                    <TableCell className="text-muted-foreground text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground h-7 w-7 cursor-pointer"
                          onClick={() => handleOpenEdit(u)}
                          title={t("editUser")}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground h-7 w-7 cursor-pointer hover:text-amber-500"
                          onClick={() => handleRevokeSessions(u.id)}
                          title={t("revokeAllSessions")}
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-7 w-7 cursor-pointer"
                          onClick={() => handleDeleteUser(u.id)}
                          title={t("deleteUser")}
                          disabled={u.id === currentUser.id}
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

      {/* Create User Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <form onSubmit={handleCreateUser}>
            <DialogHeader>
              <DialogTitle>{t("addNewUser")}</DialogTitle>
              <DialogDescription>{t("addNewUserDescription")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">{t("colEmail")} *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">{t("colUsername")}</label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="john_doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">{t("colName")}</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">
                  {t("colPassword")} * (min 6)
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">{t("colRole")}</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "USER" | "ADMIN",
                      })
                    }
                    aria-label={t("colRole")}
                    className="bg-background border-border w-full rounded-lg border px-3 py-2 text-xs outline-none"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">{t("colStatus")}</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "ACTIVE" | "SUSPENDED",
                      })
                    }
                    aria-label={t("colStatus")}
                    className="bg-background border-border w-full rounded-lg border px-3 py-2 text-xs outline-none"
                  >
                    <option value="ACTIVE">{t("statusActive")}</option>
                    <option value="SUSPENDED">{t("statusSuspended")}</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <form onSubmit={handleUpdateUser}>
            <DialogHeader>
              <DialogTitle>{t("editUser")}</DialogTitle>
              <DialogDescription>{t("editUserDescription")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">{t("colEmail")}</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">{t("colUsername")}</label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">{t("colName")}</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">{t("newPasswordOptional")}</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={t("leaveBlankToKeepCurrent")}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium">{t("colRole")}</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "USER" | "ADMIN",
                      })
                    }
                    aria-label={t("colRole")}
                    className="bg-background border-border w-full rounded-lg border px-3 py-2 text-xs outline-none"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">{t("colStatus")}</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "ACTIVE" | "SUSPENDED",
                      })
                    }
                    aria-label={t("colStatus")}
                    className="bg-background border-border w-full rounded-lg border px-3 py-2 text-xs outline-none"
                  >
                    <option value="ACTIVE">{t("statusActive")}</option>
                    <option value="SUSPENDED">{t("statusSuspended")}</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
