import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import "./apiClient.js";
import Layout from "./Pages/Layout";
import { initVersionChecker } from "./utils/versionChecker";
import { ToastContainer } from "./Components";
import { ROUTE_ALIASES, ROUTES } from "./constants/routes";

const Login = lazy(() => import("./Pages/login"));
const WhatsAppHome = lazy(() => import("./Pages/WhatsAppHome"));
const WhatsAppCloudDashboard = lazy(() => import("./Pages/WhatsAppCloudDashboard"));
const WhatsAppSendPage = lazy(() => import("./Pages/WhatsAppSendPage"));
const WhatsAppBroadcastPage = lazy(() => import("./Pages/WhatsAppBroadcastPage"));
const FlowBuilderPage = lazy(() => import("./Pages/FlowBuilderPage"));

function RouteLoader() {
  return (
    <Stack alignItems="center" justifyContent="center" minHeight="50vh" spacing={2}>
      <CircularProgress size={32} />
      <Typography variant="body2" color="text.secondary">Loading page...</Typography>
    </Stack>
  );
}

function withSuspense(element) {
  return <Suspense fallback={<RouteLoader />}>{element}</Suspense>;
}

export default function App() {
  useEffect(() => {
    if (import.meta.env.PROD) {
      const id = initVersionChecker();
      return () => clearInterval(id);
    }
  }, []);

  return (
    <Router>
      <ToastContainer />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <Routes>
          <Route path={ROUTES.ROOT} element={withSuspense(<Login />)} />
          <Route path={ROUTES.LOGIN} element={withSuspense(<Login />)} />

          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={withSuspense(<WhatsAppHome />)} />
            <Route path={ROUTES.DASHBOARD} element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path={ROUTES.WHATSAPP} element={withSuspense(<WhatsAppCloudDashboard />)} />
            <Route path={ROUTES.WHATSAPP_CLOUD} element={withSuspense(<WhatsAppCloudDashboard />)} />
            <Route path={ROUTES.WHATSAPP_SEND} element={withSuspense(<WhatsAppSendPage />)} />
            <Route path={ROUTES.WHATSAPP_BULK} element={withSuspense(<WhatsAppBroadcastPage />)} />
            <Route path={ROUTES.FLOW_BUILDER} element={withSuspense(<FlowBuilderPage />)} />

            <Route path={ROUTE_ALIASES.WHATSAPP_LOGIN} element={<Navigate to={ROUTES.WHATSAPP} replace />} />
            <Route path={ROUTE_ALIASES.WHATSAPP_SESSION} element={<Navigate to={ROUTES.WHATSAPP} replace />} />
            <Route path={ROUTE_ALIASES.WHATSAPP_ADMIN} element={<Navigate to={ROUTES.WHATSAPP} replace />} />
            <Route path={ROUTE_ALIASES.HOME_ADMIN} element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path={ROUTE_ALIASES.HOME_VENDOR} element={<Navigate to={ROUTES.HOME} replace />} />
            <Route path={ROUTE_ALIASES.HOME_OLD} element={<Navigate to={ROUTES.HOME} replace />} />
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Box>
    </Router>
  );
}
