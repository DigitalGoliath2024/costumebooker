import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SignUpForm from '../components/auth/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
            <p className="text-gray-600 mt-2">
              Join our directory of cosplay performers
            </p>
          </div>

          <SignUpForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-purple-700 hover:text-purple-800 font-medium">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Why Join CosplayConnect?
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Create a professional profile to showcase your cosplay talents</li>
              <li>• Connect with event organizers and fans in your area</li>
              <li>• Receive booking inquiries directly to your email</li>
              <li>• Gain visibility in our searchable directory</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              Listings are just $29 per year. You'll be prompted to complete your profile and payment after creating your account.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUpPage;