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
