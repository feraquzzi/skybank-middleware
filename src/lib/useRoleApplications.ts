import { useCallback, useEffect, useRef, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { ApiError, customerApi } from "./api";
import type { RoleChangeApplicationResponse } from "./types";

/**
 * Roles the backend refuses to grant or revoke through a request. Kept identical to
 * `CustomerManagementService.SYSTEM_ROLES` on the server - a single one of these in a
 * payload makes the whole request fail with 400.
 */
export const SYSTEM_ROLES = new Set([
  "ROLE_ADMIN",
  "ROLE_CLIENT",
  "default-roles-banking",
  "uma_authorization",
  "offline_access",
]);

/** Roles a user can hold as a service, i.e. everything that is not a system role. */
export function isServiceRole(role: string): boolean {
  return !SYSTEM_ROLES.has(role);
}

/** How often to re-check a request that is waiting on an administrator. */
const PENDING_POLL_MS = 30_000;

type Status = "loading" | "success" | "error";

/**
 * The vendor's own role-change applications. `pending` is the one awaiting review, if any:
 * the backend allows a single outstanding request at a time.
 *
 * While something is pending this re-checks in the background, and when an approval lands it
 * refreshes the access token - the roles live in the JWT, so without that the vendor would
 * have to sign out and back in to see the change.
 */
export function useRoleApplications() {
  const { keycloak, initialized } = useKeycloak();
  const [applications, setApplications] = useState<
    RoleChangeApplicationResponse[]
  >([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  /** Bumped whenever the token is refreshed, so role consumers re-read the JWT. */
  const [accessVersion, setAccessVersion] = useState(0);
  /** The request an administrator just decided, for the page to announce. */
  const [decision, setDecision] = useState<RoleChangeApplicationResponse | null>(
    null,
  );

  // Only kept so we can tell the moment a watched request stops being pending.
  const pendingIdRef = useRef<string | null>(null);

  const refreshAccessToken = useCallback(async () => {
    if (!keycloak.authenticated) return;
    try {
      // -1 forces a refresh even though the current token has not expired yet.
      if (await keycloak.updateToken(-1)) {
        setAccessVersion((version) => version + 1);
      }
    } catch {
      // Leave it to the next API call to notice the session is gone.
    }
  }, [keycloak]);

  const load = useCallback(async () => {
    // /services is a public route, so don't ask for applications until we have a session.
    if (!initialized || !keycloak.authenticated) {
      setApplications([]);
      setStatus("success");
      return;
    }

    setError(null);
    try {
      const fetched = await customerApi.getMyApplications();
      setApplications(fetched);
      setStatus("success");

      const stillPending =
        fetched.find((a) => a.status === "PENDING") ?? null;
      const watchedId = pendingIdRef.current;
      if (watchedId && watchedId !== stillPending?.id) {
        const decided = fetched.find((a) => a.id === watchedId);
        if (decided) {
          setDecision(decided);
          // Only an approval changes what the token says.
          if (decided.status === "APPROVED") await refreshAccessToken();
        }
      }
      pendingIdRef.current = stillPending?.id ?? null;
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        // Not a vendor account - there is nothing to track or request.
        setApplications([]);
        setStatus("success");
        return;
      }
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }, [initialized, keycloak.authenticated, refreshAccessToken]);

  useEffect(() => {
    load();
  }, [load]);

  const pending = applications.find((a) => a.status === "PENDING") ?? null;
  const pendingId = pending?.id ?? null;

  // Re-check while a request is waiting on a decision, and whenever the vendor comes back
  // to the tab - that is when they expect to see the outcome.
  useEffect(() => {
    if (!pendingId) return;

    const timer = setInterval(() => {
      void load();
    }, PENDING_POLL_MS);

    const onFocus = () => {
      void load();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void load();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pendingId, load]);

  const submit = useCallback(
    async (requestedRoles: string[]) => {
      // Safety net: the backend 400s the entire request if any system role (e.g. ROLE_CLIENT,
      // which every vendor JWT carries) appears in the payload.
      const requestable = requestedRoles.filter((role) => !SYSTEM_ROLES.has(role));
      if (requestable.length === 0) {
        throw new Error("No requestable service roles in this selection");
      }
      await customerApi.submitRoleChange(requestable);
      await load();
    },
    [load],
  );

  const dismissDecision = useCallback(() => setDecision(null), []);

  // Derived on every render: a bump of accessVersion re-reads the (already replaced) token
  // claims, so callers get the post-approval roles without memoising anything themselves.
  const roles =
    initialized && keycloak.authenticated
      ? (keycloak.realmAccess?.roles ?? [])
      : [];

  return {
    applications,
    pending,
    status,
    error,
    decision,
    dismissDecision,
    accessVersion,
    roles,
    refetch: load,
    submit,
  };
}

/**
 * What a pending application would do to one role, given the access the user holds now.
 * `null` means the pending request leaves that role untouched.
 */
export function pendingChangeForRole(
  application: RoleChangeApplicationResponse | null,
  role: string,
  isAssigned: boolean,
): "add" | "remove" | null {
  if (!application || SYSTEM_ROLES.has(role)) return null;
  const requested = new Set(application.requestedRoles);
  if (requested.has(role) && !isAssigned) return "add";
  if (!requested.has(role) && isAssigned) return "remove";
  return null;
}
