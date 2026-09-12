const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const TOKEN_KEY = "starter_kit_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export interface User {
  id: string;
  email: string;
  username?: string | null;
  name?: string | null;
  avatar?: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt?: string;
  accounts?: Array<{
    id: string;
    provider: string;
    createdAt: string;
  }>;
  _count?: {
    sessions: number;
  };
}

export interface Session {
  id: string;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  expiresAt: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    username?: string | null;
    name?: string | null;
    avatar?: string | null;
    role: string;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export async function apiClient<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

// Auth API Calls
export const api = {
  auth: {
    async register(body: {
      email: string;
      password: string;
      username?: string;
      name?: string;
    }) {
      return apiClient<{ success: boolean; data: { user: User; token: string } }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
    },

    async login(body: { identifier: string; password: string }) {
      return apiClient<{ success: boolean; data: { user: User; token: string } }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
    },

    async oauthLogin(body: {
      provider: "google" | "github" | "apple" | "linkedin";
      providerAccountId: string;
      email: string;
      name?: string;
      avatar?: string;
    }) {
      return apiClient<{ success: boolean; data: { user: User; token: string } }>(
        "/auth/oauth",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
    },

    async telegramLogin(body: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      auth_date: number;
      hash: string;
    }) {
      return apiClient<{ success: boolean; data: { user: User; token: string } }>(
        "/auth/telegram",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );
    },

    async getMe() {
      return apiClient<{ success: boolean; data: User }>("/auth/me");
    },

    async logout() {
      return apiClient<{ success: boolean }>("/auth/logout", {
        method: "POST",
      });
    },

    async getSessions() {
      return apiClient<{ success: boolean; data: Session[] }>("/auth/sessions");
    },

    async revokeSession(sessionId: string) {
      return apiClient<{ success: boolean; message: string }>(
        `/auth/sessions/${sessionId}`,
        { method: "DELETE" }
      );
    },
  },

  admin: {
    async getUsers(
      params: {
        page?: number;
        limit?: number;
        search?: string;
        role?: "USER" | "ADMIN";
        status?: "ACTIVE" | "SUSPENDED";
      } = {}
    ) {
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("limit", String(params.limit));
      if (params.search) query.set("search", params.search);
      if (params.role) query.set("role", params.role);
      if (params.status) query.set("status", params.status);

      return apiClient<{
        success: boolean;
        users: User[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/admin/users?${query.toString()}`);
    },

    async getUser(id: string) {
      return apiClient<{ success: boolean; data: User }>(`/admin/users/${id}`);
    },

    async createUser(body: {
      email: string;
      username?: string;
      name?: string;
      password: string;
      role?: "USER" | "ADMIN";
      status?: "ACTIVE" | "SUSPENDED";
    }) {
      return apiClient<{ success: boolean; data: User }>("/admin/users", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },

    async updateUser(
      id: string,
      body: {
        email?: string;
        username?: string;
        name?: string;
        password?: string;
        role?: "USER" | "ADMIN";
        status?: "ACTIVE" | "SUSPENDED";
      }
    ) {
      return apiClient<{ success: boolean; data: User }>(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
    },

    async deleteUser(id: string) {
      return apiClient<{ success: boolean; message: string }>(`/admin/users/${id}`, {
        method: "DELETE",
      });
    },

    async getSessions(
      params: {
        page?: number;
        limit?: number;
        userId?: string;
      } = {}
    ) {
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.limit) query.set("limit", String(params.limit));
      if (params.userId) query.set("userId", params.userId);

      return apiClient<{
        success: boolean;
        sessions: Session[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(`/admin/sessions?${query.toString()}`);
    },

    async revokeSession(sessionId: string) {
      return apiClient<{ success: boolean; message: string }>(
        `/admin/sessions/${sessionId}`,
        {
          method: "DELETE",
        }
      );
    },

    async revokeUserSessions(userId: string) {
      return apiClient<{ success: boolean; message: string }>(
        `/admin/users/${userId}/sessions`,
        {
          method: "DELETE",
        }
      );
    },
  },
};
