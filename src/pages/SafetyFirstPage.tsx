import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, DollarSign, MessageSquare, Calendar, CheckCircle2 } from 'lucide-react';
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
                <h1 className="text-3xl font-bold">How to Be a Successful Performer</h1>
              </div>
              <p className="text-lg opacity-90">
                Make Money, Stay Safe, and Have Fun Doing What You Love
              </p>
            </div>

            <div className="p-8">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-8">
                  So you've got a killer costume, a character voice that turns heads, and you're ready to get paid to entertain — let's make sure you do it right. This guide breaks down how to start, what to charge, and how to stay safe while building your performer profile on CostumeCameos.
                </p>

                <div className="space-y-8">
                  <section>
                    <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-6">
                      <CheckCircle2 className="h-6 w-6 text-teal-500" />
                      Getting Started
                    </h2>

                    <div className="bg-gradient-to-br from-teal-50 to-primary-50 rounded-lg p-6 space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Build a Strong Profile</h3>
                        <p className="text-gray-700 mb-4">Your profile is your first impression — make it count.</p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full" />
                            Upload high-quality photos of you in costume (at least 2-3)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full" />
                            Write a short, fun, and clear bio explaining who you are and what you offer</li> 
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full" />Do not use trademarked names, images, or say you are the trademarked character. Example: 'I am the Ice Queen' for the snow related princess we all know
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full" />
                            Add your social links like Instagram, TikTok, or YouTube for credibility
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full" />
                            Tag your location and costume style for better visibility in search
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Use a Performer Alias</h3>
                        <p className="text-gray-700 mb-4">Protect your privacy.</p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full" />
                            Use a separate email just for bookings
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full" />
                            Consider creating a performer name or alias
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-teal-500 rounded-full" />
                            Don't give out personal info unless necessary
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-6">
                      <DollarSign className="h-6 w-6 text-green-500" />
                      Setting Your Rates
                    </h2>

                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Know Your Worth</h3>
                        <p className="text-gray-700 mb-4">
                          Your time, talent, and costume investment matter. We recommend starting with $100–$150 per hour and setting a 2-hour minimum. Some events may offer more, but don't undercut yourself just to land a gig. The clients who value you will pay you.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">What to Include in Your Fee:</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Travel time (to/from the venue)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Time to prep and get into character
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Performance time, photo ops, and interaction
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Add-ons: custom shoutouts, themed games, special requests
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-6">
                      <Shield className="h-6 w-6 text-purple-500" />
                      Safety First – Always
                    </h2>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Confirm Details in Advance</h3>
                        <p className="text-gray-700 mb-4">Before accepting a gig, get all the key info:</p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            Event date, time, and exact location
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            Contact person's name and phone number
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            What's expected of you: appearance only, interaction, games, photos?
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Tell Someone</h3>
                        <p className="text-gray-700 mb-4">Always share your plans with a friend or family member.</p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            Send them the address and event time
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            Let them know when you expect to be done
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            Check in when you arrive and leave
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Trust Your Gut</h3>
                        <p className="text-gray-700 mb-4">If something feels sketchy, it probably is.</p>
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            Don't accept vague details or last-minute location changes
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            Don't go into a situation where you don't feel fully comfortable
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            It's okay to say no or back out
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-6">
                      <MessageSquare className="h-6 w-6 text-blue-500" />
                      Communication Tips
                    </h2>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          Be polite, professional, and clear in your messages
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          Confirm all event details in writing
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          Set boundaries early — this is a job, not a favor
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          Never send inappropriate content, even if asked
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-6">
                      <AlertTriangle className="h-6 w-6 text-amber-500" />
                      What Not to Do
                    </h2>

                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6">
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full" />
                          Don't undercharge just to get gigs — it hurts you and the whole community
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full" />
                          Don't show up unprepared or in a half-finished costume
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full" />
                          Don't give out your personal phone number too early
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full" />
                          Don't accept gigs that promise "exposure" instead of payment
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-amber-500 rounded-full" />
                          Don't walk into unknown environments without doing some research first
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900 mb-6">
                      <Calendar className="h-6 w-6 text-indigo-500" />
                      Stay Organized
                    </h2>

                    <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg p-6">
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                          Use a calendar to track bookings, availability, and deadlines
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                          Save important contacts and conversations
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                          Set up payment tracking (PayPal, CashApp, Venmo, etc.)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                          Follow up after events for reviews or referrals
                        </li>
                      </ul>
                    </div>
                  </section>

                  <div className="mt-12 bg-gradient-premium text-white p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Final Thought: You're the Talent — Act Like It</h2>
                    <p className="text-lg opacity-90">
                      This is your time to shine. You're not just showing up in costume — you're delivering a full experience. Charge what you're worth, set boundaries, stay safe, and keep it fun.
                    </p>
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