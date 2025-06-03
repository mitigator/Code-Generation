import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { themes, applyTheme } from '../assets/template';
import {useTheme} from '../services/ThemeContext'

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme, setCurrentTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  
  // Get current theme colors
  const colors = themes[currentTheme].colors;
  
  // Handle navigation bar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.theme-dropdown')) {
        setThemeDropdownOpen(false);
      }
      if (!event.target.closest('.mobile-menu')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleThemeChange = (themeKey) => {
    setCurrentTheme(themeKey);
    setThemeDropdownOpen(false);
  };

  const toggleThemeDropdown = () => {
    setThemeDropdownOpen(!themeDropdownOpen);
  };

  // Navigation items
  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '#tech-stack', label: 'Tech Stack' },
    { href: '#docs', label: 'Documentation' }
  ];

  return (
    <header className={`sticky top-0 z-40 py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
      scrolled ? 'shadow-md' : ''
    }`} style={{ 
      backgroundColor: scrolled ? colors.surface : 'transparent' 
    }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <div className="transform transition-transform hover:scale-110 duration-300">
            <svg className="h-8 w-8" fill={colors.primary} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="ml-2 text-xl font-bold" style={{ color: colors.textPrimary }}>CodePulse</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="text-sm font-medium transition-colors duration-200" 
              style={{ color: colors.textSecondary }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              {item.label}
            </a>
          ))}
          
          {/* Theme Dropdown */}
          <div className="relative theme-dropdown">
            <button
              onClick={toggleThemeDropdown}
              className="flex items-center text-sm font-medium transition-colors duration-200 px-3 py-1 rounded-md"
              style={{ 
                color: colors.textSecondary,
                backgroundColor: themeDropdownOpen ? `${colors.primary}10` : 'transparent'
              }}
              onMouseOver={(e) => {
                if (!themeDropdownOpen) {
                  e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                }
              }}
              onMouseOut={(e) => {
                if (!themeDropdownOpen) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className="mr-1">{themes[currentTheme].icon}</span>
              <span className="mr-1">Theme</span>
              <svg className={`w-4 h-4 transform transition-transform duration-200 ${themeDropdownOpen ? 'rotate-180' : ''}`} 
                   fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg z-50"
                   style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderDefault}` }}>
                <div className="py-1 max-h-80 overflow-y-auto">
                  <div className="px-3 py-2">
                    <h3 className="text-sm font-bold" style={{ color: colors.textPrimary }}>Choose Theme</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1 px-2">
                    {Object.entries(themes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => handleThemeChange(key)}
                        className={`p-2 rounded-md text-xs transition-all duration-200 text-left`}
                        style={{
                          backgroundColor: currentTheme === key ? `${colors.primary}15` : 'transparent',
                          border: currentTheme === key ? `1px solid ${colors.primary}` : `1px solid transparent`,
                          color: colors.textPrimary
                        }}
                        onMouseOver={(e) => {
                          if (currentTheme !== key) {
                            e.currentTarget.style.backgroundColor = `${colors.primary}05`;
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentTheme !== key) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                        title={theme.description}
                      >
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">{theme.icon}</span>
                          <span className="font-medium text-xs">{theme.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop Auth Buttons */}
        <div className="flex items-center space-x-4">
          {/* <button className="text-sm font-medium hidden sm:block transition-colors duration-200" 
            style={{ color: colors.primary }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = colors.primaryDark;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = colors.primary;
            }}
          >
            Sign In
          </button> */}
          {/* <button 
            className="text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transform hover:translate-y-px transition-all duration-200" 
            style={{ 
              backgroundColor: colors.primary, 
              color: colors.surface,
              boxShadow: `0 4px 6px -1px ${colors.primary}30, 0 2px 4px -1px ${colors.primary}20`
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryDark;
              e.currentTarget.style.boxShadow = `0 6px 8px -1px ${colors.primary}40, 0 3px 6px -1px ${colors.primary}30`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
              e.currentTarget.style.boxShadow = `0 4px 6px -1px ${colors.primary}30, 0 2px 4px -1px ${colors.primary}20`;
            }}
          >
            Sign Up
          </button> */}
          
          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="block md:hidden focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke={colors.textPrimary} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden mobile-menu ${mobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 rounded-lg shadow-md" style={{ backgroundColor: colors.surface }}>
          {navItems.map((item) => (
            <a 
              key={item.href}
              href={item.href} 
              className="block px-3 py-2 rounded-md text-base font-medium" 
              style={{ color: colors.textSecondary }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          
          {/* Mobile Theme Selector */}
          <div className="px-3 py-2">
            <button
              onClick={toggleThemeDropdown}
              className="flex items-center w-full text-base font-medium rounded-md px-2 py-1"
              style={{ 
                color: colors.textSecondary,
                backgroundColor: themeDropdownOpen ? `${colors.primary}10` : 'transparent'
              }}
            >
              <span className="mr-2">{themes[currentTheme].icon}</span>
              <span className="mr-auto">Theme</span>
              <svg className={`w-4 h-4 transform transition-transform duration-200 ${themeDropdownOpen ? 'rotate-180' : ''}`} 
                   fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {themeDropdownOpen && (
              <div className="mt-2 grid grid-cols-2 gap-1">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className="p-2 rounded-md text-xs transition-all duration-200 text-left"
                    style={{
                      backgroundColor: currentTheme === key ? `${colors.primary}15` : 'transparent',
                      border: currentTheme === key ? `1px solid ${colors.primary}` : `1px solid ${colors.borderDefault}`,
                      color: colors.textPrimary
                    }}
                    title={theme.description}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{theme.icon}</span>
                      <span className="font-medium text-xs">{theme.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* <a href="#" className="block px-3 py-2 rounded-md text-base font-medium" style={{ color: colors.primary }}>Sign In</a> */}
        </div>
      </div>
    </header>
  );
}

export default Navbar;