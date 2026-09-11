import keycloak from "../keycloak";

export interface KeycloakUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export function getKeycloakUser(): KeycloakUser | null {
  if (!keycloak.authenticated || !keycloak.token) return null;

  const token = keycloak.tokenParsed as Record<string, string> | undefined;
  if (!token) return null;

  return {
    firstName: token.given_name || "",
    lastName: token.family_name || "",
    email: token.email || "",
    username: token.preferred_username || token.email || "",
  };
}

export function getDisplayName(): string {
  const user = getKeycloakUser();
  if (!user) return "User";
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username;
}

export function getInitials(): string {
  const user = getKeycloakUser();
  if (!user) return "U";
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  if (user.username) {
    return user.username.slice(0, 2).toUpperCase();
  }
  return "U";
}
