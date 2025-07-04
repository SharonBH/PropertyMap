import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TenantProvider } from "@/contexts/TenantContext";
import { AuthProviderWithRouter } from "@/contexts/AuthProviderWithRouter";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
//import FallbackIndex from "./pages/FallbackIndex";
import PropertyDetails from "./pages/PropertyDetails";
import Properties from "./pages/Properties";
import NeighborhoodMap from "./pages/NeighborhoodMap";
import ManageListings from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AddProperty from "./pages/AddProperty";
import LoginPage from "./pages/LoginPageIntegratedTenant";
import EditProperty from "./pages/EditProperty";
import AgentProfile from "./pages/AgentProfile";
import SessionExpiryHandler from "@/components/SessionExpiryHandler";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import AddUserPage from "./pages/admin/AddUserPage";
import EditUserPage from "./pages/admin/EditUserPage";
import RolesPage from "./pages/admin/RolesPage";
import TenantsPage from "./pages/admin/TenantsPage";
import AddTenantPage from "./pages/admin/AddTenantPage";
import AgenciesPage from "./pages/admin/AgenciesPage";
import NeighborhoodsPage from "./pages/admin/NeighborhoodsPage";
import LookupsPage from "./pages/admin/LookupsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">      <TooltipProvider>
        <TenantProvider>
          <BrowserRouter>
            <AuthProviderWithRouter>
              <SessionExpiryHandler />
              <Toaster />
              <Sonner />
              <Routes>
                {/* <Route path="/" element={<FallbackIndex />} /> */}
                <Route path="/" element={
                    <ProtectedRoute>
                      <ManageListings />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/properties" element={<Properties />} />
                <Route path="/property/:id" element={<PropertyDetails />} />              <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/property/add" 
                  element={
                    <ProtectedRoute>
                      <AddProperty />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/neighborhood" 
                  element={
                    <ProtectedRoute>
                      <NeighborhoodMap />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/contact" element={<ContactPage />} />                <Route 
                  path="/edit-property/:id" 
                  element={
                    <ProtectedRoute>
                      <EditProperty />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <AgentProfile />
                    </ProtectedRoute>
                  }
                />                <Route 
                  path="/add-property" 
                  element={
                    <ProtectedRoute>
                      <AddProperty />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <AdminRoute>
                      <UsersPage />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/users/new" 
                  element={
                    <AdminRoute>
                      <AddUserPage />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/users/:userId/edit" 
                  element={
                    <AdminRoute>
                      <EditUserPage />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/roles" 
                  element={
                    <AdminRoute>
                      <RolesPage />
                    </AdminRoute>
                  } 
                />                <Route 
                  path="/admin/tenants" 
                  element={
                    <AdminRoute>
                      <TenantsPage />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/tenants/new" 
                  element={
                    <AdminRoute>
                      <AddTenantPage />
                    </AdminRoute>
                  } 
                />                <Route 
                  path="/admin/agencies" 
                  element={
                    <AdminRoute>
                      <AgenciesPage />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/neighborhoods" 
                  element={
                    <AdminRoute>
                      <NeighborhoodsPage />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/lookups" 
                  element={
                    <AdminRoute>
                      <LookupsPage />
                    </AdminRoute>
                  } 
                />

                <Route path="*" element={<NotFound />} /></Routes>
            </AuthProviderWithRouter>
          </BrowserRouter>
        </TenantProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
