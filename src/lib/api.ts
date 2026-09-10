import keycloak from "../keycloak";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

async function authHeaders(): Promise<HeadersInit> {
  if (keycloak.authenticated && keycloak.token) {
    return { Authorization: `Bearer ${keycloak.token}` };
  }
  return {};
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(await authHeaders()),
    ...(options.headers as HeadersInit | undefined),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg =
      body?.message || body?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

/* ---- Client types (matches backend OpenAPI schema) ---- */

export interface ClientResponse {
  id: string;
  companyName: string;
  contactEmail: string;
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
  registrationNumber: string;
  country: string;
  address: string;
  taxId: string;
  industry: string;
  phoneNumber: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "SUSPENDED"
    | "INACTIVE";
  createdAt: string;
  approvedAt: string | null;
  userCount: number;
}

export interface ApproveClientRequest {
  approvedRoles: string[];
}

export interface AvailabilityResponse {
  usernameAvailable: boolean;
  emailAvailable: boolean;
}

/* ---- Admin endpoints ---- */

export const adminApi = {
  getAllClients: () => request<ClientResponse[]>("/admin/clients"),

  getPendingClients: () =>
    request<ClientResponse[]>("/admin/clients/pending"),

  getClient: (clientId: string) =>
    request<ClientResponse>(`/admin/clients/${clientId}`),

  approveClient: (clientId: string, roles: string[]) =>
    request<ClientResponse>(`/admin/clients/${clientId}/approve`, {
      method: "PUT",
      body: JSON.stringify({ approvedRoles: roles }),
    }),

  rejectClient: (clientId: string) =>
    request<ClientResponse>(`/admin/clients/${clientId}/reject`, {
      method: "PUT",
    }),

  suspendClient: (clientId: string) =>
    request<ClientResponse>(`/admin/clients/${clientId}/suspend`, {
      method: "PUT",
    }),

  activateClient: (clientId: string, roles: string[]) =>
    request<ClientResponse>(`/admin/clients/${clientId}/activate`, {
      method: "PUT",
      body: JSON.stringify({ approvedRoles: roles }),
    }),

  getRoles: () => request<string[]>("/admin/roles"),
};

/* ---- Public endpoints ---- */

export const publicApi = {
  checkAvailability: (params: { username?: string; email?: string }) => {
    const qs = new URLSearchParams();
    if (params.username) qs.set("username", params.username);
    if (params.email) qs.set("email", params.email);
    return request<AvailabilityResponse>(
      `/check-availability?${qs.toString()}`
    );
  },
};
