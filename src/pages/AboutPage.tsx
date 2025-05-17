import React from 'react';
import Layout from '../components/layout/Layout';
import { VenetianMask as Mask } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Mask className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About CostumeCameos
            </h1>
            <p className="text-xl text-gray-600">
              Connecting cosplay performers with fans and event organizers across the United States
            </p>
          </div>
          
          <div className="space-y-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                CostumeCameos is dedicated to creating meaningful connections between talented cosplay performers and those seeking unique entertainment for their events. We believe in fostering a vibrant community where creativity, professionalism, and passion come together.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">For Performers</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Professional profile listings</li>
                    <li>• Direct client inquiries</li>
                    <li>• Location-based visibility</li>
                    <li>• Category-based searching</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">For Event Organizers</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Easy performer discovery</li>
                    <li>• Direct communication</li>
                    <li>• Verified profiles</li>
                    <li>• Detailed performer information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600">
                    Building a supportive and inclusive environment for all cosplay enthusiasts.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
                  <p className="text-gray-600">
                    Maintaining high standards for performer listings and user experience.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety</h3>
                  <p className="text-gray-600">
                    Prioritizing user safety and secure communications between parties.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  For general inquiries: <a href="mailto:support@costumecameos.com" className="text-purple-600 hover:text-purple-700">support@costumecameos.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
