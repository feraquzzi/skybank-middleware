import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import LandingPage from './domains/landing-page/LandingPage';
import RegisterPage from './domains/auth/RegisterPage';
import AdminDashboard from './domains/dashboard/admin/AdminDashboard';
import VendorDashboard from './domains/dashboard/vendor/VendorDashboard';
import ServicesPage from './domains/dashboard/components/ServicesPage';
import ProtectedRoute from './domains/dashboard/components/ProtectedRoute';
import logo from './assets/skybank-logo.png';

function App() {
    const { keycloak, initialized } = useKeycloak();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (!initialized) {
            return;
        }

        if (!keycloak.authenticated) {
            setUserRole(null);
            return;
        }

        const roles = keycloak.realmAccess?.roles || [];
        console.log('Keycloak roles:', roles);

        if (roles.includes('ROLE_ADMIN')) {
            console.log('User role: ADMIN');
            setUserRole('admin');
        } else if (roles.includes('ROLE_CLIENT') || roles.includes('ROLE_VENDOR')) {
            console.log('User role: VENDOR');
            setUserRole('vendor');
        } else {
            console.log('User has no recognized role');
            setUserRole(null);
        }
    }, [initialized, keycloak.authenticated]);

    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/40 to-orange-50/30">
                <div className="text-center">
                    <div className="relative inline-block mb-8">
                        <img src={logo} alt="Sky Bank Sierra Leone" className="h-24 w-auto animate-pulse" />
                        <div className="absolute inset-0 h-24 w-auto bg-orange-500/20 blur-xl rounded-full animate-ping"></div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-3 h-3 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium tracking-wider uppercase">Loading Sky Bank...</p>
                    <div className="mt-6 w-48 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    function RoleRedirect() {
        if (!keycloak.authenticated) {
            return <LandingPage />;
        }

        if (!userRole) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/40 to-orange-50/30">
                    <div className="text-center">
                        <div className="relative inline-block mb-8">
                            <img src={logo} alt="Sky Bank Sierra Leone" className="h-24 w-auto animate-pulse" />
                            <div className="absolute inset-0 h-24 w-auto bg-orange-500/20 blur-xl rounded-full animate-ping"></div>
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-3 h-3 bg-orange-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <p className="text-gray-500 text-sm font-medium tracking-wider uppercase">Verifying permissions...</p>
                        <div className="mt-6 w-48 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
                            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </div>
            );
        }

        if (userRole === 'admin') {
            return <Navigate to="/admin-dashboard" replace />;
        }

        if (userRole === 'vendor') {
            return <Navigate to="/vendor-dashboard" replace />;
        }

        return <LandingPage />;
    }

    return (
        <Routes>
            <Route
                path="/"
                element={<RoleRedirect />}
            />

            <Route
                path="/register"
                element={<RegisterPage />}
            />

            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute
                        requiredRole="admin"
                        userRole={userRole}
                    >
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

<Route
                path="/vendor-dashboard"
                element={
                    <ProtectedRoute
                        requiredRole="vendor"
                        userRole={userRole}
                    >
                        <VendorDashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="/services" element={<ServicesPage />} />
        </Routes>
    );
}

export default App;