import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Color Scheme
  const colors = {
    primary: "#3B82F6",
    primaryDark: "#1D4ED8",
    primaryLight: "#93C5FD",
    secondary: "#10B981",
    secondaryDark: "#059669",
    secondaryLight: "#6EE7B7",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    darkSurface: "#1F2937",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    textLight: "#9CA3AF",
    textOnDark: "#F3F4F6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    borderDefault: "#E5E7EB",
    borderFocus: "#93C5FD",
    borderDark: "#374151"
  };
  
  // Handle navigation bar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/project-startup');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ 
      fontFamily: "'Inter', sans-serif",
      background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}30 100%)` 
    }}>
      {/* Navigation - with scroll effect and mobile responsiveness */}
      <header className={`sticky top-0 z-50 py-4 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="transform transition-transform hover:scale-110 duration-300">
              <svg className="h-8 w-8" fill={colors.primary} viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold" style={{ color: colors.textPrimary }}>CodePulse</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors duration-200" 
              style={{ color: colors.textSecondary, position: 'relative' }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 hover:w-full"
                style={{ backgroundColor: colors.primary }}
                onMouseOver={(e) => {
                  e.currentTarget.style.width = '100%';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.width = '0';
                }}
              ></span>
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors duration-200" 
              style={{ color: colors.textSecondary, position: 'relative' }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 hover:w-full"
                style={{ backgroundColor: colors.primary }}
                onMouseOver={(e) => {
                  e.currentTarget.style.width = '100%';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.width = '0';
                }}
              ></span>
            </a>
            <a href="#docs" className="text-sm font-medium hover:text-primary transition-colors duration-200" 
              style={{ color: colors.textSecondary, position: 'relative' }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              Documentation
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 hover:w-full"
                style={{ backgroundColor: colors.primary }}
                onMouseOver={(e) => {
                  e.currentTarget.style.width = '100%';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.width = '0';
                }}
              ></span>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium hidden sm:block hover:text-primaryDark transition-colors duration-200" 
              style={{ color: colors.primary }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = colors.primaryDark;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
            >
              Sign In
            </button>
            <button 
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
            </button>
            <button onClick={toggleMobileMenu} className="block md:hidden focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke={colors.textPrimary} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-md">
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium" style={{ color: colors.textSecondary }}>Features</a>
            <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium" style={{ color: colors.textSecondary }}>Pricing</a>
            <a href="#docs" className="block px-3 py-2 rounded-md text-base font-medium" style={{ color: colors.textSecondary }}>Documentation</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium" style={{ color: colors.primary }}>Sign In</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Column - Hero Text */}
            <div className="max-w-2xl text-center lg:text-left">
              <div 
                className="inline-flex items-center px-3 py-1 rounded-full mb-8 transform hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}
              >
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Code Generation Simplified</span>
              </div>
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in" 
                style={{ color: colors.textPrimary, lineHeight: '1.2' }}
              >
                <span className="block">Supercharge Your</span>
                <span className="block" style={{ color: colors.primary }}>Project Creation</span>
              </h1>
              <p 
                className="mt-6 text-lg sm:text-xl" 
                style={{ 
                  color: colors.textSecondary, 
                  lineHeight: '1.5', 
                  maxWidth: '520px', 
                  margin: '0 auto', 
                  marginBottom: '2rem' 
                }}
              >
                Generate and refine project code with the power of FlowiseAI. Create professional applications in minutes, not hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleGetStarted}
                  className="flex items-center justify-center px-8 py-3 rounded-xl shadow-lg transform hover:translate-y-1 transition-all duration-300"
                  style={{ 
                    backgroundColor: colors.primary, 
                    color: colors.surface, 
                    boxShadow: `0 10px 15px -3px ${colors.primary}50`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }}
                >
                  Get Started
                  <svg className="ml-2 w-5 h-5 animate-bounce-x" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  className="flex items-center justify-center px-8 py-3 rounded-xl transition-all"
                  style={{ 
                    color: colors.primary, 
                    backgroundColor: `${colors.primary}10` 
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primary}20`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                  }}
                >
                  <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  View Demo
                </button>
              </div>
              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 justify-center lg:justify-start">
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>10x</p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Faster Development</p>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>99%</p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Accuracy Rate</p>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <p className="text-2xl font-bold" style={{ color: colors.primary }}>24/7</p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Support</p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Hero Image */}
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl transform hover:scale-105 transition-transform duration-500">
              <div 
                className="rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300" 
                style={{ 
                  backgroundColor: colors.surface, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 25px 50px -12px ${colors.primary}30`
                }}
              >
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: colors.textSecondary }}>code-generator.js</div>
                </div>
                <div 
                  className="p-4 overflow-hidden" 
                  style={{ 
                    fontFamily: "'JetBrains Mono', monospace", 
                    backgroundColor: colors.darkSurface, 
                    color: colors.textOnDark, 
                    height: '320px' 
                  }}
                >
                  <pre className="text-xs sm:text-sm" style={{ lineHeight: '1.7' }}>
                    <span style={{ color: '#64748B' }}>// CodePulse : A Code Generator</span>
                    <br />
                    <span style={{ color: '#38BDF8' }}>import</span> <span style={{ color: '#E2E8F0' }}>&#123; createProject &#125;</span> <span style={{ color: '#38BDF8' }}>from</span> <span style={{ color: '#A3E635' }}>'@flowise/core'</span>;
                    <br /><br />
                    <span style={{ color: '#F472B6' }}>async</span> <span style={{ color: '#38BDF8' }}>function</span> <span style={{ color: '#38BDF8' }}>generateApp</span><span>(requirements) &#123;</span>
                    <br />
                    <span>  </span><span style={{ color: '#38BDF8' }}>const</span> <span>project = </span><span style={{ color: '#38BDF8' }}>await</span> <span style={{ color: '#F472B6' }}>createProject</span><span>(&#123;</span>
                    <br />
                    <span>    name: </span><span style={{ color: '#A3E635' }}>'e-commerce-platform'</span><span>,</span>
                    <br />
                    <span>    type: </span><span style={{ color: '#A3E635' }}>'react-application'</span><span>,</span>
                    <br />
                    <span>    features: [</span>
                    <br />
                    <span>      </span><span style={{ color: '#A3E635' }}>'user-authentication'</span><span>,</span>
                    <br />
                    <span>      </span><span style={{ color: '#A3E635' }}>'product-catalog'</span><span>,</span>
                    <br />
                    <span>      </span><span style={{ color: '#A3E635' }}>'shopping-cart'</span><span>,</span>
                    <br />
                    <span>      </span><span style={{ color: '#A3E635' }}>'payment-processing'</span>
                    <br />
                    <span>    ],</span>
                    <br />
                    <span>    database: </span><span style={{ color: '#A3E635' }}>'mongodb'</span>
                    <br />
                    <span>  &#125;);</span>
                    <br /><br />
                    <span>  </span><span style={{ color: '#38BDF8' }}>return</span> <span>project;</span>
                    <br />
                    <span>&#125;</span>
                    <br /><br />
                    <span style={{ color: '#38BDF8' }}>const</span> <span>result = </span><span style={{ color: '#F472B6' }}>generateApp</span><span>(userRequirements);</span>
                    <br />
                    <span style={{ color: '#F472B6' }}>console</span>.<span style={{ color: '#F472B6' }}>log</span><span>(</span><span style={{ color: '#A3E635' }}>'✅ Project generated successfully!'</span><span>);</span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div id="features" className="py-16" style={{ backgroundColor: colors.surface }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Why Choose FlowiseAI?</h2>
              <p className="mt-4 text-lg" style={{ color: colors.textSecondary }}>All the tools you need to accelerate your development workflow</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div 
                className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.background, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.primary}20, 0 4px 6px -2px ${colors.primary}10`;
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" 
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <svg className="w-6 h-6" fill={colors.primary} viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>AI-Powered Generation</h3>
                <p style={{ color: colors.textSecondary }}>Leverage advanced AI to generate production-ready code based on your project requirements.</p>
              </div>
              
              {/* Feature 2 */}
              <div 
                className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.background, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.secondary}20, 0 4px 6px -2px ${colors.secondary}10`;
                  e.currentTarget.style.borderColor = colors.secondary;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" 
                  style={{ backgroundColor: `${colors.secondary}15` }}
                >
                  <svg className="w-6 h-6" fill={colors.secondary} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Smart Customization</h3>
                <p style={{ color: colors.textSecondary }}>Easily customize generated code to match your specific project needs and preferences.</p>
              </div>
              
              {/* Feature 3 */}
              <div 
                className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.background, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.success}20, 0 4px 6px -2px ${colors.success}10`;
                  e.currentTarget.style.borderColor = colors.success;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" 
                  style={{ backgroundColor: `${colors.success}15` }}
                >
                  <svg className="w-6 h-6" fill={colors.success} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Multiple Templates</h3>
                <p style={{ color: colors.textSecondary }}>Choose from a wide range of pre-built templates for web, mobile, and backend applications.</p>
              </div>
            </div>
            
            {/* Additional Features - 3 more features with nice hover effects */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {/* Feature 4 */}
              <div 
                className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.background, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.info}20, 0 4px 6px -2px ${colors.info}10`;
                  e.currentTarget.style.borderColor = colors.info;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" 
                  style={{ backgroundColor: `${colors.info}15` }}
                >
                  <svg className="w-6 h-6" fill={colors.info} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>API Integration</h3>
                <p style={{ color: colors.textSecondary }}>Connect your applications with external services using seamless API integrations.</p>
              </div>
              
              {/* Feature 5 */}
              <div 
                className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.background, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.warning}20, 0 4px 6px -2px ${colors.warning}10`;
                  e.currentTarget.style.borderColor = colors.warning;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" 
                  style={{ backgroundColor: `${colors.warning}15` }}
                >
                  <svg className="w-6 h-6" fill={colors.warning} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Performance Optimized</h3>
                <p style={{ color: colors.textSecondary }}>All generated code is optimized for maximum performance and efficiency.</p>
              </div>
              
              {/* Feature 6 */}
              <div 
                className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.background, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.primaryDark}20, 0 4px 6px -2px ${colors.primaryDark}10`;
                  e.currentTarget.style.borderColor = colors.primaryDark;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div 
                  className="w-12 h-12 flex items-center justify-center rounded-lg mb-4" 
                  style={{ backgroundColor: `${colors.primaryDark}15` }}
                >
                  <svg className="w-6 h-6" fill={colors.primaryDark} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>Intelligent Testing</h3>
                <p style={{ color: colors.textSecondary }}>Automated testing ensures your generated code works flawlessly from day one.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-16" style={{ backgroundColor: `${colors.primary}05` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>How CodePulse Works</h2>
              <p className="mt-4 text-lg" style={{ color: colors.textSecondary }}>A simple three-step process to generate your application</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                {/* Step connector - visible on md screens and up */}
                <div className="hidden md:block absolute top-10 right-0 w-full h-1" style={{ backgroundColor: `${colors.primary}30` }}>
                  <div className="animate-pulse absolute right-0 top-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-primary to-transparent" style={{ animation: 'pulse 1.5s infinite' }}></div>
                </div>
                <div 
                  className="p-6 rounded-xl bg-white relative z-10 transform transition-all duration-300 hover:scale-105"
                  style={{ 
                    boxShadow: `0 10px 15px -3px ${colors.primary}20, 0 4px 6px -2px ${colors.primary}10`,
                    border: `1px solid ${colors.borderDefault}`
                  }}
                >
                  <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full mb-4 text-white font-bold" style={{ backgroundColor: colors.primary }}>1</div>
                  <h3 className="text-xl font-bold text-center mb-2" style={{ color: colors.textPrimary }}>Describe Your Project</h3>
                  <p className="text-center" style={{ color: colors.textSecondary }}>Tell us what you want to build using natural language or answer a few simple questions.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                {/* Step connector - visible on md screens and up */}
                <div className="hidden md:block absolute top-10 right-0 w-full h-1" style={{ backgroundColor: `${colors.primary}30` }}>
                  <div className="animate-pulse absolute right-0 top-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-primary to-transparent" style={{ animation: 'pulse 1.5s infinite 0.5s' }}></div>
                </div>
                <div 
                  className="p-6 rounded-xl bg-white relative z-10 transform transition-all duration-300 hover:scale-105"
                  style={{ 
                    boxShadow: `0 10px 15px -3px ${colors.primary}20, 0 4px 6px -2px ${colors.primary}10`,
                    border: `1px solid ${colors.borderDefault}`
                  }}
                >
                  <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full mb-4 text-white font-bold" style={{ backgroundColor: colors.primary }}>2</div>
                  <h3 className="text-xl font-bold text-center mb-2" style={{ color: colors.textPrimary }}>Customize Options</h3>
                  <p className="text-center" style={{ color: colors.textSecondary }}>Choose your tech stack, components, and styling preferences for your project.</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div 
                  className="p-6 rounded-xl bg-white relative z-10 transform transition-all duration-300 hover:scale-105"
                  style={{ 
                    boxShadow: `0 10px 15px -3px ${colors.primary}20, 0 4px 6px -2px ${colors.primary}10`,
                    border: `1px solid ${colors.borderDefault}`
                  }}
                >
                  <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full mb-4 text-white font-bold" style={{ backgroundColor: colors.primary }}>3</div>
                  <h3 className="text-xl font-bold text-center mb-2" style={{ color: colors.textPrimary }}>Generate & Deploy</h3>
                  <p className="text-center" style={{ color: colors.textSecondary }}>Review your generated code, make final adjustments, and deploy your application.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials Section with improved styling and animations */}
        <div className="py-16" style={{ backgroundColor: colors.surface }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>What Our Users Say</h2>
              <p className="mt-4 text-lg" style={{ color: colors.textSecondary }}>Trusted by developers worldwide</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div 
                className="p-6 rounded-xl transform transition-all duration-300 hover:-translate-y-2"
                style={{ 
                  backgroundColor: colors.surface, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.primary}20, 0 4px 6px -2px ${colors.primary}10`;
                  e.currentTarget.style.borderColor = colors.primary;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <span className="font-bold">SJ</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold" style={{ color: colors.textPrimary }}>Sarah Johnson</h4>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>Senior Developer</p>
                  </div>
                </div>
                <p style={{ color: colors.textSecondary }}>
                  <span className="text-xl" style={{ color: colors.primary }}>"</span>
                  FlowiseAI has completely transformed our development workflow. We've reduced our project setup time by 80%.
                  <span className="text-xl" style={{ color: colors.primary }}>"</span>
                </p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5" fill={colors.warning} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div 
                className="p-6 rounded-xl transform transition-all duration-300 hover:-translate-y-2"
                style={{ 
                  backgroundColor: colors.surface, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.secondary}20, 0 4px 6px -2px ${colors.secondary}10`;
                  e.currentTarget.style.borderColor = colors.secondary;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    <span className="font-bold">MC</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold" style={{ color: colors.textPrimary }}>Michael Chen</h4>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>Frontend Lead</p>
                  </div>
                </div>
                <p style={{ color: colors.textSecondary }}>
                  <span className="text-xl" style={{ color: colors.secondary }}>"</span>
                  The code quality is impressive. It's like having a senior developer on the team who writes clean, maintainable code.
                  <span className="text-xl" style={{ color: colors.secondary }}>"</span>
                </p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5" fill={colors.warning} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div 
                className="p-6 rounded-xl transform transition-all duration-300 hover:-translate-y-2"
                style={{ 
                  backgroundColor: colors.surface, 
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.success}20, 0 4px 6px -2px ${colors.success}10`;
                  e.currentTarget.style.borderColor = colors.success;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white"
                    style={{ backgroundColor: colors.success }}
                  >
                    <span className="font-bold">LR</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold" style={{ color: colors.textPrimary }}>Lisa Rodriguez</h4>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>CTO, StartupX</p>
                  </div>
                </div>
                <p style={{ color: colors.textSecondary }}>
                  <span className="text-xl" style={{ color: colors.success }}>"</span>
                  As a startup, we need to move fast. FlowiseAI helps us prototype new features in hours instead of days.
                  <span className="text-xl" style={{ color: colors.success }}>"</span>
                </p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5" fill={colors.warning} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="py-16" style={{ backgroundColor: colors.background }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg" style={{ color: colors.textSecondary }}>Choose the plan that fits your needs</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div 
                className="rounded-xl p-6 relative transform transition-all duration-500 hover:-translate-y-1 hover:scale-105"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.primary}20, 0 4px 6px -2px ${colors.primary}10`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>Free</h3>
                  <p className="text-4xl font-bold" style={{ color: colors.primary }}>$0</p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>Forever</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    5 projects per month
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Basic templates
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Community support
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.error} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Advanced customization
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.error} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
                <button 
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{ 
                    border: `1px solid ${colors.primary}`,
                    color: colors.primary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Get Started
                </button>
              </div>
              
              {/* Pro Plan - Most Popular */}
              <div 
                className="rounded-xl p-6 relative transform transition-all duration-500 hover:-translate-y-1 hover:scale-105 z-10"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `2px solid ${colors.primary}`,
                  boxShadow: `0 10px 25px -5px ${colors.primary}30, 0 10px 10px -5px ${colors.primary}20`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 25px -5px ${colors.primary}40, 0 10px 10px -5px ${colors.primary}30`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 25px -5px ${colors.primary}30, 0 10px 10px -5px ${colors.primary}20`;
                }}
              >
                <div 
                  className="absolute top-0 right-0 bg-primary text-white text-xs font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg" 
                  style={{ backgroundColor: colors.primary }}
                >
                  MOST POPULAR
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>Pro</h3>
                  <p className="text-4xl font-bold" style={{ color: colors.primary }}>$29</p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>per month</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Unlimited projects
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    All templates
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Advanced customization
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    API access
                  </li>
                </ul>
                <button 
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium text-white transition-all duration-300"
                  style={{ 
                    backgroundColor: colors.primary,
                    boxShadow: `0 4px 6px -1px ${colors.primary}40, 0 2px 4px -1px ${colors.primary}30`
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                    e.currentTarget.style.boxShadow = `0 6px 8px -1px ${colors.primary}50, 0 3px 6px -1px ${colors.primary}40`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.boxShadow = `0 4px 6px -1px ${colors.primary}40, 0 2px 4px -1px ${colors.primary}30`;
                  }}
                >
                  Get Started
                </button>
              </div>
              
              {/* Enterprise Plan */}
              <div 
                className="rounded-xl p-6 relative transform transition-all duration-500 hover:-translate-y-1 hover:scale-105"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.borderDefault}`,
                  boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 15px -3px ${colors.secondary}20, 0 4px 6px -2px ${colors.secondary}10`;
                  e.currentTarget.style.borderColor = colors.secondary;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>Enterprise</h3>
                  <p className="text-4xl font-bold" style={{ color: colors.secondary }}>$99</p>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>per month</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Everything in Pro
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Dedicated account manager
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Custom integrations
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Enterprise SLA
                  </li>
                  <li className="flex items-center text-sm" style={{ color: colors.textSecondary }}>
                    <svg className="w-5 h-5 mr-2" fill={colors.success} viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    White-labeling options
                  </li>
                </ul>
                <button 
                  className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{ 
                    border: `1px solid ${colors.secondary}`,
                    color: colors.secondary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.secondary}10`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: colors.primary }}>
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10 bg-white"></div>
            <div className="absolute top-40 -right-20 w-60 h-60 rounded-full opacity-10 bg-white"></div>
            <div className="absolute -bottom-40 left-20 w-80 h-80 rounded-full opacity-10 bg-white"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to supercharge your development?</h2>
            <p className="text-lg text-white opacity-90 mb-8">Start generating high-quality code in minutes. No credit card required.</p>
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-primary bg-white hover:bg-gray-100 focus:outline-none transition-all duration-300 transform hover:scale-105"
              style={{ color: colors.primary }}
            >
              Get Started For Free
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: colors.darkSurface }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center">
                  <svg className="h-8 w-8" fill="white" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-white">CodePulse</span>
                </div>
                <p className="mt-4 text-sm" style={{ color: colors.textLight }}>
                  Building the future of development with AI-powered tools.
                </p>
                <div className="mt-6 flex space-x-5">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.017 3.747 11.657 11.657 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.093 4.093 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.615 11.615 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Use Cases</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Integrations</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">API Reference</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Community</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">© {new Date().getFullYear()} FlowiseAI. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;