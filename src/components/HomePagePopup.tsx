import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const HomePagePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Welcome to CostumeCameos.com – We're in Open Beta! 🎭
            </h2>
          </div>

          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>
              Hey everyone, I'm Tim – the creator of this platform. After years of struggling to find reliable cosplay performers for my kids' parties and events, I finally said… "Screw it, I'll build it myself." My background is in digital marketing and web development, and love to cosplay too... so here we are.
            </p>

            <p>
              If you love to dress up and bring characters to life – superheroes, princesses, pirates, you name it – and you'd like to get paid doing it, this site is for you.
            </p>

            <div className="bg-purple-50 p-6 rounded-lg my-6">
              <p className="text-purple-900 font-semibold text-lg mb-2">
                👉 We're opening up the first 150 listings for FREE.
              </p>
              <p className="text-purple-800">
                Whether you've got a decent social following or you're just starting your small biz journey, now's your chance.
              </p>
            </div>

            <div className="text-center mt-8">
              <p className="font-medium text-gray-900 mb-4">
                Ready to get listed?
              </p>
              <Link to="/free-listing">
                <Button size="lg" onClick={handleClose}>
                  📩 Contact Us & Claim Your Free Listing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePagePopup;