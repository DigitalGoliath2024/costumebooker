import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import GuidelinesPage from './pages/GuidelinesPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import EditProfilePage from './pages/EditProfilePage';
import ManageImagesPage from './pages/ManageImagesPage';
import ManageSubscriptionPage from './pages/ManageSubscriptionPage';
import PreviewProfilePage from './pages/PreviewProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SafetyFirstPage from './pages/SafetyFirstPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/browse/:stateAbbr" element={<BrowsePage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/categories/:categoryName" element={<CategoryPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard/edit-profile" element={<EditProfilePage />} />
          <Route path="/dashboard/edit-profile/:id" element={<EditProfilePage />} />
          <Route path="/dashboard/manage-images" element={<ManageImagesPage />} />
          <Route path="/dashboard/subscription" element={<ManageSubscriptionPage />} />
          <Route path="/dashboard/preview" element={<PreviewProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/safety-first" element={<SafetyFirstPage />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;