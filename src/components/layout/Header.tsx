import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      // Always navigate home after sign out attempt, regardless of success/failure
      navigate('/');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src="https://i.ibb.co/XkyZrxvH/costumecameos-logo-1200x1200.png" 
                alt="CostumeCameos Logo" 
                className="h-13 w-13 object-contain"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">CostumeCameos</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/browse"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-purple-500"
              >
                Browse
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-purple-500"
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2 border-transparent hover:border-purple-500"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            <div className="flex-shrink-0">
              <Link to="/search">
                <Button variant="ghost" size="sm" className="mr-2">
                  <Search className="h-5 w-5" />
                </Button>
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleSignOut} variant="ghost" size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/signin">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center md:hidden">
            <Link to="/search" className="mr-2">
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/browse"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            <Link
              to="/categories"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-gray-800"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/signin"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-purple-500 hover:text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;