import React from 'react';
import Layout from '../components/layout/Layout';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Contact Us
          </h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  Have questions about CostumeCameos? We're here to help! Choose the most convenient way to reach us.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-purple-600 mt-1" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Email</h3>
                      <p className="text-gray-600">
                        General Inquiries: <a href="mailto:support@costumecameos.com" className="text-purple-600 hover:text-purple-700">support@costumecameos.com</a>
                      </p>
                      <p className="text-gray-600">
                        Business: <a href="mailto:partners@costumecameos.com" className="text-purple-600 hover:text-purple-700">partners@costumecameos.com</a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-purple-600 mt-1" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                      <p className="text-gray-600">
                        Support Hours: Mon-Fri, 9am-5pm EST<br />
                        <a href="tel:1-800-555-0123" className="text-purple-600 hover:text-purple-700">1-800-555-0123</a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-purple-600 mt-1" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Location</h3>
                      <p className="text-gray-600">
                        Winter Haven, Florida
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Support</h3>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li>
                        <a href="/faq" className="text-purple-600 hover:text-purple-700">FAQ</a>
                      </li>
                      <li>
                        <a href="/guidelines" className="text-purple-600 hover:text-purple-700">Content Guidelines</a>
                      </li>
                      <li>
                        <a href="/terms" className="text-purple-600 hover:text-purple-700">Terms of Service</a>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">For Performers</h3>
                    <ul className="mt-2 space-y-2 text-gray-600">
                      <li>
                        <a href="/signup" className="text-purple-600 hover:text-purple-700">Create a Listing</a>
                      </li>
                      <li>
                        <a href="/dashboard/subscription" className="text-purple-600 hover:text-purple-700">Pricing</a>
                      </li>
                      <li>
                        <a href="/guidelines" className="text-purple-600 hover:text-purple-700">Listing Guidelines</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;