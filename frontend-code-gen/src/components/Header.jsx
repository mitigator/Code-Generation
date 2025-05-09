// src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { authAPI } from '../services/api';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    authAPI.logout();
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          AI Code Generator
        </Link>
        <nav>
          <ul className="flex space-x-6">
            {user ? (
              <>
                <li>
                  <Link to="/" className="hover:text-blue-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/projects/new" className="hover:text-blue-200">
                    New Project
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-blue-200"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-200">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;