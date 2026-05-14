import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { DashboardPage } from './pages/DashboardPage'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { ServicesPage } from './pages/ServicesPage'
import { SchedulePage } from './pages/SchedulePage'
import { ClientsPage } from './pages/ClientsPage';
import { FinancePage } from './pages/FinancePage';
import { GalleryPage } from './pages/GalleryPage';
import BarberProfilePage from './pages/BarberProfilePage';
import MarketplacePage from './pages/MarketplacePage';
import ReportsPage from './pages/ReportsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/barberos/:id" element={<BarberProfilePage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/citas"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AppointmentsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/servicios"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ServicesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/horarios"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SchedulePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ClientsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/finanzas"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FinancePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/galeria"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <GalleryPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ReportsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/barberos" element={<MarketplacePage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App