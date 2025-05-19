import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/layout/Layout';
import FreeListingContactForm from '../components/FreeListingContactForm';

const FreeListingContactPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Claim Your Free Listing | CostumeCameos</title>
        <meta name="description" content="Join CostumeCameos as a cosplay performer. Get discovered by clients and grow your entertainment business with a free listing." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Claim Your Free Listing
              </h1>
              <p className="text-lg text-gray-600">
                Join our growing community of cosplay performers and get discovered by clients in your area.
              </p>
            </div>

            <FreeListingContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FreeListingContactPage;