import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';

const ResetPasswordPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Password</h1>
            <p className="text-gray-600 mt-2">
              Enter your new password below
            </p>
          </div>

          <ResetPasswordForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Remember your password?{' '}
              <Link to="/signin" className="text-purple-700 hover:text-purple-800 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;