import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';

const SafetyFirstPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-premium text-white p-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Safety First: Booking Smart</h1>
              </div>
              <p className="text-lg opacity-90">
                Your safety is our top priority. Follow these essential guidelines when responding to booking requests and performing at events.
              </p>
            </div>

            <div className="p-8">
              <div className="prose max-w-none">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-6">
                  <span>🎭</span> Smart Booking & Performance Tips for Entertainers
                </h2>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">1. Research Your Contact</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Verify Identity:</strong> Before accepting any booking, research the individual or organization. Check their social media profiles, official websites, and online reviews.</li>
                      <li><strong>Look for Red Flags:</strong> Be cautious if they lack an online presence, have inconsistent information, or if their profiles were recently created.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">2. Communicate Clearly</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Use Official Channels:</strong> Whenever possible, communicate through official platforms or email addresses.</li>
                      <li><strong>Document Everything:</strong> Keep records of all communications, agreements, and transactions. </li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">3. Share Your Itinerary</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Inform Trusted Contacts:</strong> Always let a friend or family member know your schedule, including locations and times.</li>
                      <li><strong>Use Tracking Apps:</strong> Consider using apps that allow trusted individuals to track your location in real-time.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">4. Meet in Public First</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Initial Meetings:</strong> If possible, meet clients in public places before agreeing to perform at private venues.</li>
                      <li><strong>Bring a Companion:</strong> Having someone accompany you can deter potential threats and provide support.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">5. Assess the Venue</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Request Details:</strong> Ask for specific information about the venue, including address, parking, and entry points.</li>
                      <li><strong>Use Maps:</strong> Utilize online maps to view the location beforehand and assess the surrounding area.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">6. Secure Payment</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Upfront Deposits:</strong> Request a deposit before the performance to ensure commitment.</li>
                      <li><strong>Use Secure Methods:</strong> Opt for payment platforms that offer protection, such as PayPal or Venmo.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">7. Set Clear Boundaries</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Define Terms:</strong> Clearly outline the scope of your performance, including duration, content, and any restrictions.</li>
                      <li><strong>Stick to Agreements:</strong> Avoid making last-minute changes that haven't been agreed upon in writing.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">8. Stay Aware During Performances</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Monitor the Crowd:</strong> Keep an eye on your audience and be alert to any unusual behavior.</li>
                      <li><strong>Protect Your Belongings:</strong> Keep personal items and equipment secure and within sight.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">9. Know Local Regulations</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Permits and Licenses:</strong> Ensure you have the necessary permissions to perform in public spaces.</li>
                      <li><strong>Noise Ordinances:</strong> Be aware of local laws regarding sound levels and performance times.</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-gray-900">10. Trust Your Instincts</h3>
                    <ul className="mt-2 space-y-2">
                      <li><strong>Listen to Your Gut:</strong> If something feels off or unsafe, prioritize your well-being and reconsider the engagement.</li>
                      <li><strong>Have an Exit Plan:</strong> Always have a strategy to leave a situation quickly if needed.</li>
                    </ul>
                  </section>

                  <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-yellow-800">Disclaimer</h3>
                        <p className="mt-1 text-yellow-700">
                          This guide offers general advice based on common practices among entertainers. It does not guarantee safety and should not replace personal judgment or professional counsel. Always prioritize your safety and make decisions that best suit your circumstances.
                        </p>
                      </div>
                    </div>
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

export default SafetyFirstPage;