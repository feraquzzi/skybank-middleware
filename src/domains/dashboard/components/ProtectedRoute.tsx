import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole: string;
    userRole: string | null;
}

export default function ProtectedRoute({
    children,
    requiredRole,
    userRole
}: ProtectedRouteProps) {
    if (!userRole) {
        return <div className="flex items-center justify-center min-h-screen">Checking permissions...</div>;
    }

    if (userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}