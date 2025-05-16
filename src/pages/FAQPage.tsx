import React from 'react';
import Layout from '../components/layout/Layout';

const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "What kind of characters can I portray?",
      answer: "You can portray generic character types like spider-themed heroes, bat-inspired vigilantes, magical wizards, space warriors, etc. For trademark reasons, avoid using specific trademarked character names or claiming to be official versions of copyrighted characters."
    },
    {
      question: "Can I use photos of my cosplay costumes?",
      answer: "Yes, you can use photos of your own custom-made or purchased costumes. However, avoid using official promotional images or claiming any affiliation with entertainment companies or franchises."
    },
    {
      question: "What happens if I violate the content guidelines?",
      answer: "Violations of our content guidelines, including unauthorized use of trademarked characters or inappropriate content, will result in immediate listing removal without refund. Multiple violations may lead to permanent account suspension."
    },
    {
      question: "How much does it cost to list my services?",
      answer: "Listings cost $29 per year. This fee is non-refundable, including cases where listings are removed due to guideline violations."
    },
    {
      question: "Do you handle payments between performers and clients?",
      answer: "No, we do not process payments between performers and clients. All booking arrangements and payments should be handled directly between the parties involved."
    },
    {
      question: "Can I list services for adult events?",
      answer: "Yes, you can indicate that you perform at 18+ events. However, all content must remain family-friendly, and no explicit or adult content is allowed in photos or descriptions."
    },
    {
      question: "What are the photo guidelines?",
      answer: "Photos must be: your own original content, family-friendly, show your actual costume (no official promotional images), and not include copyrighted logos or trademarks."
    },
    {
      question: "How do I describe trademarked characters?",
      answer: "Use generic descriptions instead of trademarked names. For example:\n- 'Spider-themed hero' instead of specific spider-hero names\n- 'Patriotic super soldier' instead of specific soldier character names\n- 'Galactic warrior' instead of specific space saga character names"
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h1>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage;