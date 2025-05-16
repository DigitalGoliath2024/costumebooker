import React from 'react';
import Layout from '../components/layout/Layout';

const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose max-w-none bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly:
            </p>
            <ul>
              <li>Account information (email, password)</li>
              <li>Profile information (display name, bio, location)</li>
              <li>Images you upload</li>
              <li>Messages sent through the platform</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use your information to:
            </p>
            <ul>
              <li>Provide and maintain the service</li>
              <li>Process your listing payments</li>
              <li>Send service updates and administrative messages</li>
              <li>Respond to your requests and inquiries</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We share information only:
            </p>
            <ul>
              <li>When you choose to make it public in your listing</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
            </ul>

            <h2>4. Data Storage</h2>
            <p>
              All data is stored in the United States. We do not transfer data internationally.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal information</li>
              <li>Update or correct your information</li>
              <li>Delete your account and data</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2>7. Children's Privacy</h2>
            <p>
              Our service is not directed to children under 18. We do not knowingly collect information from children under 18.
            </p>

            <h2>8. Changes to Privacy Policy</h2>
            <p>
              We may update this policy. We will notify you of material changes via email or through the platform.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              For privacy questions or concerns, contact privacy@cosplayconnect.com
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;