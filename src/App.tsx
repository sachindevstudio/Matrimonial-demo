import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DemoBar } from './components/DemoBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

// Public layout wrapper: only used for public pages (Homepage, Register, Login)
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D2424]">
      {/* Public Navbar - Only on public pages */}
      <Navbar />

      {/* Main page content */}
      <div className="flex-1">{children}</div>

      {/* Public Footer - Only on public pages */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#FAF7F2] text-[#2D2424]">
          {/* Top Demo Presentation Controller (unobtrusive presentation switcher) */}
          <DemoBar />

          {/* Page Routing */}
          <Routes>
            {/* Public Pages with Public Navbar and Footer */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/register"
              element={
                <PublicLayout>
                  <RegisterPage />
                </PublicLayout>
              }
            />
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <LoginPage />
                </PublicLayout>
              }
            />

            {/* Dedicated SaaS Dashboards (NO public navbar, NO public footer) */}
            <Route path="/member" element={<MemberDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Toast Notifications */}
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
