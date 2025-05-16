import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SignInForm from '../components/auth/SignInForm';

const SignInPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-600 mt-2">
              Access your cosplay performer account
            </p>
          </div>

          <SignInForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-purple-700 hover:text-purple-800 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignInPage;