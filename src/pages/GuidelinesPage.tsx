import React from 'react';
import Layout from '../components/layout/Layout';

const GuidelinesPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Content Guidelines
          </h1>
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Character Portrayals</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">
                  When creating your listing, use generic descriptions for character types instead of specific trademarked names:
                </p>
                <ul className="space-y-2 mb-4">
                  <li>✓ "Spider-themed hero" instead of specific spider-hero names</li>
                  <li>✓ "Patriotic super soldier" instead of specific soldier character names</li>
                  <li>✓ "Galactic warrior" instead of specific space saga character names</li>
                  <li>✓ "Magical wizard student" instead of specific wizard character names</li>
                </ul>
                <p>
                  Avoid claiming any official affiliation with entertainment companies or franchises.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Image Guidelines</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">All images must:</p>
                <ul className="space-y-2">
                  <li>✓ Be your own original content</li>
                  <li>✓ Show your actual costume</li>
                  <li>✓ Be family-friendly</li>
                  <li>✓ Not include copyrighted logos or trademarks</li>
                  <li>✗ No official promotional images</li>
                  <li>✗ No explicit or suggestive content</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Content</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">Your profile should:</p>
                <ul className="space-y-2">
                  <li>✓ Use clear, accurate descriptions of your services</li>
                  <li>✓ Include your actual performance experience</li>
                  <li>✓ Specify event types you're available for</li>
                  <li>✓ List your service area and travel limitations</li>
                  <li>✗ No misleading information</li>
                  <li>✗ No claims of official character representation</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing and Booking</h2>
              <div className="prose max-w-none text-gray-600">
                <ul className="space-y-2">
                  <li>✓ Clearly state your hourly rate range</li>
                  <li>✓ Specify any minimum booking requirements</li>
                  <li>✓ List any additional fees (travel, setup, etc.)</li>
                  <li>✓ Include your availability preferences</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Violations and Enforcement</h2>
              <div className="prose max-w-none text-gray-600">
                <p className="mb-4">The following actions may result in immediate listing removal:</p>
                <ul className="space-y-2">
                  <li>• Using trademarked character names</li>
                  <li>• Posting official promotional images</li>
                  <li>• Including explicit or inappropriate content</li>
                  <li>• Misrepresenting services or credentials</li>
                  <li>• Claiming official character representation</li>
                </ul>
                <p className="mt-4">
                  Multiple violations may result in permanent account suspension without refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GuidelinesPage;