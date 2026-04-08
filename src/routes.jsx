import { Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ExpeditionDetailPage from "./pages/ExpeditionDetailPage";
import AdminPage from "./pages/AdminPage";
import MyMetricsPage from "./pages/MyMetricsPage";
import ParticipantMetricsPage from "./pages/ParticipantMetricsPage";
import ExpeditionMembersPage from "./pages/expedition/ExpeditionMembersPage";
import ExpeditionChartsPage from "./pages/charts/ExpeditionChartsPage";
import AdminExpeditionsPage from "./pages/AdminExpeditionsPage";
import AdminExpeditionMembersPage from "./pages/AdminExpeditionMembersPage";
import AdminParticipantChartsPage from "./pages/AdminParticipantChartsPage";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" />;
};

export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const rolesJson = localStorage.getItem("userRoles");
  const roles = rolesJson ? JSON.parse(rolesJson) : [];

  if (!roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export const routesConfig = [
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expeditions/:id",
    element: (
      <ProtectedRoute>
        <ExpeditionDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expeditions/:expeditionId/my-metrics",
    element: (
      <ProtectedRoute>
        <MyMetricsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/expeditions/:expeditionId/participants/:participantId/metrics",
    element: (
      <ProtectedRoute>
        <ParticipantMetricsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/expeditions",
    element: (
      <AdminRoute>
        <AdminExpeditionsPage />
     </AdminRoute>
    ),
  },
  {
    path: "/admin/expeditions/:expeditionId/members",
    element: (
      <AdminRoute>
        <AdminExpeditionMembersPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/expeditions/:expeditionId/charts/:indNum",
    element: (
      <AdminRoute>
        <AdminParticipantChartsPage />
      </AdminRoute>
    ),
  }, 
  {
    path: "/expeditions/:id/participants",
    element: (
      <ProtectedRoute>
        <ExpeditionMembersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/charts/expeditions/:id",
    element: (
      <ProtectedRoute>
        <ExpeditionChartsPage />
      </ProtectedRoute>
    ),
  },
];