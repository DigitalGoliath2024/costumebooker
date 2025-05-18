import React from 'react';
import Layout from '../components/layout/Layout';

const TermsPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-premium text-white p-8">
              <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
              <p className="text-white/90">Last updated: May 16, 2025</p>
            </div>
            
            <div className="p-8">
              <div className="prose max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-600 leading-relaxed">
                    By accessing or using CostumeCameos, you agree to be bound by these Terms of Service. These terms apply to all users, including performers and visitors.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Eligibility</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Services are available only to users in the United States. You must be at least 18 years old to create a performer listing.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Listing Guidelines</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Performers must adhere to the following guidelines:
                  </p>
                  <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      No use of trademarked character names or logos
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      No claims of official affiliation with entertainment companies
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      No use of copyrighted promotional materials
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      All images must be your own original content
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Content must remain family-friendly
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
                  <p className="text-gray-600 leading-relaxed">
                    You may not use trademarked names, logos, or official promotional materials. Use generic descriptions for character types (e.g., "spider-themed hero" instead of specific character names).
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-600 leading-relaxed">
                      Listing fee is $29 per year, non-refundable. We do not process payments between performers and clients. All booking arrangements must be handled directly between parties.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Content Removal</h2>
                  <p className="text-gray-600 leading-relaxed">
                    We reserve the right to remove any content that violates these terms, including unauthorized use of trademarked material. Removal may occur without warning and will not result in refunds.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Account Termination</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We may terminate accounts for:
                  </p>
                  <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Repeated violations of content guidelines
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Use of trademarked material without authorization
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Misrepresentation of services
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                      Inappropriate or adult content
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We are not responsible for:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Arrangements made between performers and clients
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Quality or safety of performances
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Disputes between users
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Content posted by users
                      </li>
                    </ul>
                    <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Background checks or identity verification
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Accuracy of pricing or availability
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Failure to perform or cancellations
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                        Losses or legal issues from interactions
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-600 leading-relaxed">
                      We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <p className="text-purple-900">
                      For questions about these terms, contact{' '}
                      <a href="mailto:support@costumecameos.com" className="text-purple-700 hover:text-purple-800 underline">
                        support@costumecameos.com
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;