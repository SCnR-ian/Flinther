import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ClubProvider } from '@/context/ClubContext'
import { ProtectedRoute, AdminRoute, CoachRoute } from '@/routes/ProtectedRoute'
import LandingPage        from '@/pages/LandingPage'
import LoginPage          from '@/pages/LoginPage'
import RegisterPage       from '@/pages/RegisterPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage  from '@/pages/ResetPasswordPage'
import OAuthCallbackPage  from '@/pages/OAuthCallbackPage'
import SSOCallbackPage    from '@/pages/SSOCallbackPage'
import OnboardingPage     from '@/pages/OnboardingPage'
import VerifyEmailPage   from '@/pages/VerifyEmailPage'
import DashboardPage      from '@/pages/DashboardPage'
import AdminDashboard     from '@/pages/admin/AdminDashboard'
import FinanceReportPage  from '@/pages/admin/FinanceReportPage'
import CoachPortal        from '@/pages/CoachPortal'

const router = createBrowserRouter([
  { path: '/',                element: <LandingPage /> },
  { path: '/login',           element: <LoginPage /> },
  { path: '/register',        element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password',  element: <ResetPasswordPage /> },
  { path: '/auth/callback',   element: <OAuthCallbackPage /> },
  { path: '/auth/sso',        element: <SSOCallbackPage /> },
  { path: '/verify-email',     element: <VerifyEmailPage /> },
  { path: '/onboarding',      element: <ProtectedRoute><OnboardingPage /></ProtectedRoute> },
  { path: '/admin',           element: <AdminRoute><AdminDashboard /></AdminRoute> },
  { path: '/admin/finance',   element: <AdminRoute><FinanceReportPage /></AdminRoute> },
  { path: '/coach',           element: <CoachRoute><CoachPortal /></CoachRoute> },
  { path: '/dashboard',       element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: '*',                element: <LandingPage /> },
])

export default function App() {
  return (
    <ClubProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ClubProvider>
  )
}
