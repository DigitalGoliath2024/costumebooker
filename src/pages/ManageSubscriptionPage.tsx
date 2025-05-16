import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const ManageSubscriptionPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/dashboard" className="text-purple-700 hover:text-purple-800">
              &larr; Back to Dashboard
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Manage Subscription
            </h1>
            
            <div className="space-y-8">
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Subscription Status
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      This page is under construction. Soon you'll be able to:
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-600">
                      <li>• View your current subscription status</li>
                      <li>• Manage your payment method</li>
                      <li>• View billing history</li>
                      <li>• Cancel or renew your subscription</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Subscription Details
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="space-y-4">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Price</span>
                      <span className="font-medium text-gray-900">$29/year</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Renewal</span>
                      <span className="font-medium text-gray-900">Automatic</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Refund Policy</span>
                      <span className="font-medium text-gray-900">Non-refundable</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Link to="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
                <Button disabled>Update Subscription</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManageSubscriptionPage;