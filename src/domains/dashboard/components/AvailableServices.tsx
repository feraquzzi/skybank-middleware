import { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import ServiceCard from "./ServiceCard";

export default function AvailableServices() {
  const { keycloak, initialized } = useKeycloak();
  const [dynamicServices, setDynamicServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized || !keycloak.authenticated) {
      setLoading(false);
      setDynamicServices([]);
      return;
    }

    const fetchRoles = async () => {
      try {
        const realmAccess = keycloak.realmAccess;
        if (realmAccess && realmAccess.roles) {
          // Filter only roles starting with ROLE_ and map them
          const roles = realmAccess.roles.filter((role: string) => role.startsWith("ROLE_"));

          const mapped = roles.map((role: string) => {
            const title = role;
            const descriptionMap: Record<string, string> = {
              ROLE_VIEWER: "View and monitor platform activity",
              ROLE_CLIENT: "Manage customer onboarding and accounts",
              ROLE_CREATE_CUSTOMER: "Create and provision customer accounts",
              ROLE_VENDOR: "Manage vendor operations and services",
              ROLE_ADMIN: "Administrative access and platform management",
            };
            const defaultLabel = role === "ROLE_CLIENT" ? "Default" : undefined;
            return {
              title,
              description: descriptionMap[title] || "Service functionality",
              method: "GET",
              endpoint: `/api/${role.toLowerCase()}`,
              buttonText: "Configure",
              buttonColor: "gray" as const,
              icon: (
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m-6 0a2 2 0 012-2h2a2 2 0 012 2v10" />
                </svg>
              ),
              defaultLabel,
            };
          });

          // Sort so ROLE_CLIENT with defaultLabel comes first in the grid
          mapped.sort((a, b) => {
            if (a.defaultLabel && !b.defaultLabel) return -1;
            if (!a.defaultLabel && b.defaultLabel) return 1;
            return 0;
          });

          setDynamicServices(mapped);
        } else {
          setDynamicServices([]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setDynamicServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [keycloak, initialized]);

  return (
    <div>
      <div className="mb-4">
        <h3 className="flex items-center text-lg font-semibold text-gray-900">
          <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m-6 0a2 2 0 012-2h2a2 2 0 012 2v10" />
          </svg>
          Available services
        </h3>
      </div>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm font-medium tracking-wider uppercase">Loading Available Services...</p>
          </div>
        </div>
      ) : (
        <div>
          {dynamicServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dynamicServices.map((service) => (
                <ServiceCard key={service.title} {...service} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No services assigned to your role. Contact administrator.
            </p>
          )}
        </div>
      )}
    </div>
  );
}