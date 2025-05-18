import React from 'react';
import Layout from '../components/layout/Layout';

const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-premium text-white p-8">
              <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-white/90">Last updated: May 16, 2025</p>
            </div>
            
            <div className="p-8">
              <div className="prose max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We collect information you provide directly:
                  </p>
                  <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Account information (email, password)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Profile information (display name, bio, location)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Images you upload
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      Messages sent through the platform
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We use your information to:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                        Provide and maintain the service
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                        Process your listing payments
                      </li>
                    </ul>
                    <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                        Send service updates
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                        Respond to your inquiries
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We share information only:
                  </p>
                  <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      When you choose to make it public in your listing
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      To comply with legal obligations
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                      To protect our rights and safety
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-600 leading-relaxed">
                      All data is stored in the United States. We do not transfer data internationally.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                        Access your personal information
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                        Update or correct your information
                      </li>
                    </ul>
                    <ul className="bg-gray-50 rounded-lg p-6 space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                        Delete your account and data
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                        Opt out of marketing communications
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-600 leading-relaxed">
                      We implement reasonable security measures to protect your information. However, no method of transmission over the internet is 100% secure.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
                  <div className="bg-red-50 rounded-lg p-6">
                    <p className="text-red-900">
                      Our service is not directed to children under 18. We do not knowingly collect information from children under 18.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Changes to Privacy Policy</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-600 leading-relaxed">
                      We may update this policy. We will notify you of material changes via email or through the platform.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <p className="text-purple-900">
                      For privacy questions or concerns, contact{' '}
                      <a href="mailto:privacy@costumecameos.com" className="text-purple-700 hover:text-purple-800 underline">
                        privacy@costumecameos.com
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

export default PrivacyPage;