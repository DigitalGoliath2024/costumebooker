import React from 'react';
import Layout from '../components/layout/Layout';

const TermsPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>
          
          <div className="prose max-w-none bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using CosplayConnect, you agree to be bound by these Terms of Service. These terms apply to all users, including performers and visitors.
            </p>

            <h2>2. Eligibility</h2>
            <p>
              Services are available only to users in the United States. You must be at least 18 years old to create a performer listing.
            </p>

            <h2>3. Listing Guidelines</h2>
            <p>
              Performers must adhere to the following guidelines:
            </p>
            <ul>
              <li>No use of trademarked character names or logos</li>
              <li>No claims of official affiliation with entertainment companies</li>
              <li>No use of copyrighted promotional materials</li>
              <li>All images must be your own original content</li>
              <li>Content must remain family-friendly</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              You may not use trademarked names, logos, or official promotional materials. Use generic descriptions for character types (e.g., "spider-themed hero" instead of specific character names).
            </p>

            <h2>5. Payment Terms</h2>
            <p>
              Listing fee is $29 per year, non-refundable. We do not process payments between performers and clients. All booking arrangements must be handled directly between parties.
            </p>

            <h2>6. Content Removal</h2>
            <p>
              We reserve the right to remove any content that violates these terms, including unauthorized use of trademarked material. Removal may occur without warning and will not result in refunds.
            </p>

            <h2>7. Account Termination</h2>
            <p>
              We may terminate accounts for:
            </p>
            <ul>
              <li>Repeated violations of content guidelines</li>
              <li>Use of trademarked material without authorization</li>
              <li>Misrepresentation of services</li>
              <li>Inappropriate or adult content</li>
            </ul>

            <h2>8. Limitation of Liability</h2>
            <p>
              We are not responsible for:
            </p>
            <ul>
              <li>Arrangements made between performers and clients</li>
              <li>Quality or safety of performances</li>
              <li>Disputes between users</li>
              <li>Content posted by users</li>
            </ul>

            <h2>9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.
            </p>

            <h2>10. Contact</h2>
            <p>
              For questions about these terms, contact support@cosplayconnect.com
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;