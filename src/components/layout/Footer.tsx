import React from 'react';
import { Link } from 'react-router-dom';
import { VenetianMask as Mask, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <Mask className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold">CostumeCameos</span>
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Connecting cosplay performers with fans and event organizers across the United States.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="https://facebook.com/costumecameos" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/costumecameos" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/costumecameos" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Browse</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-white">
                  By Location
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white">
                  By Category
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-white">
                  Featured Performers
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-white">
                  New Listings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">For Performers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-white">
                  Create a Listing
                </Link>
              </li>
              <li>
                <Link to="/dashboard/subscription" className="text-gray-400 hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-gray-400 hover:text-white">
                  Content Guidelines
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} CostumeCameos. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 text-center mt-2">
            This site does not process payments or bookings. Please coordinate directly with the performer.
          </p>
          <p className="text-xs text-gray-500 text-center mt-2">
            All character descriptions are generic and not affiliated with any trademarked properties.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;