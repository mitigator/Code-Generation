import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { themes } from '../assets/template';
import { useTheme } from '../services/ThemeContext';

function Home() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme()
  
  // Get current theme colors
  const colors = themes[currentTheme].colors;
  
  // Tech stack data
  const techStacks = {
    backend: [
      { name: 'Express.js', description: 'Fast, unopinionated, minimalist web framework for Node.js', icon: '🚀' },
      { name: 'Django', description: 'High-level Python web framework that encourages rapid development', icon: '🐍' },
      { name: 'Spring Boot', description: 'Java-based framework used to create micro-services', icon: '☕' },
      { name: 'Laravel', description: 'PHP framework for web artisans', icon: '🎨' },
      { name: 'Flask', description: 'Lightweight WSGI web application framework in Python', icon: '🌶️' }
    ],
    frontend: [
      { name: 'React', description: 'JavaScript library for building user interfaces', icon: '⚛️' },
      { name: 'Angular', description: 'Platform for building mobile and desktop web applications', icon: '🅰️' },
      { name: 'Vue.js', description: 'Progressive JavaScript framework for building UIs', icon: '💚' },
      { name: 'Svelte', description: 'Radical new approach to building user interfaces', icon: '🔥' },
      { name: 'Next.js', description: 'React framework for production', icon: '▲' }
    ],
    database: [
      { name: 'MongoDB', description: 'Document-oriented NoSQL database', icon: '🍃' },
      { name: 'PostgreSQL', description: 'Powerful, open source object-relational database', icon: '🐘' },
      { name: 'MySQL', description: 'Open-source relational database management system', icon: '🐬' },
      { name: 'SQLite', description: 'C-language library that implements a SQL database engine', icon: '📦' },
      { name: 'Firebase', description: 'Google\'s platform for mobile and web application development', icon: '🔥' }
    ],
    authentication: [
      { name: 'JWT', description: 'Compact, URL-safe means of representing claims between two parties', icon: '🎫' },
      { name: 'OAuth', description: 'Open standard for access delegation', icon: '🔐' },
      { name: 'Firebase Auth', description: 'Authentication service provided by Firebase', icon: '🔥' },
      { name: 'Passport.js', description: 'Authentication middleware for Node.js', icon: '🛂' },
      { name: 'Session', description: 'Traditional server-side session management', icon: '💾' }
    ]
  };

  const handleGetStarted = () => {
    navigate('/project-startup');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ 
      fontFamily: "'Inter', sans-serif",
      background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}30 100%)` 
    }}>
      {/* Navbar */}
      <Navbar/>

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
                Generate and refine project code with the power of CodePulse. Create professional applications in minutes, not hours.
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
                <div className="px-4 py-2 flex items-center" style={{ background: `linear-gradient(to right, ${colors.borderDefault}, ${colors.borderDark})` }}>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.error }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.warning }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.success }}></div>
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
                    <span style={{ color: colors.textLight }}>// CodePulse : A Code Generator</span>
                    <br />
                    <span style={{ color: colors.info }}>import</span> <span style={{ color: colors.textPrimary }}>&#123; createProject &#125;</span> <span style={{ color: colors.info }}>from</span> <span style={{ color: colors.success }}>'@flowise/core'</span>;
                    <br /><br />
                    <span style={{ color: colors.secondary }}>async</span> <span style={{ color: colors.info }}>function</span> <span style={{ color: colors.info }}>generateApp</span><span>(requirements) &#123;</span>
                    <br />
                    <span>  </span><span style={{ color: colors.info }}>const</span> <span>project = </span><span style={{ color: colors.info }}>await</span> <span style={{ color: colors.secondary }}>createProject</span><span>(&#123;</span>
                    <br />
                    <span>    name: </span><span style={{ color: colors.success }}>'e-commerce-platform'</span><span>,</span>
                    <br />
                    <span>    type: </span><span style={{ color: colors.success }}>'react-application'</span><span>,</span>
                    <br />
                    <span>    features: [</span>
                    <br />
                    <span>      </span><span style={{ color: colors.success }}>'user-authentication'</span><span>,</span>
                    <br />
                    <span>      </span><span style={{ color: colors.success }}>'product-catalog'</span><span>,</span>
                    <br />
                    <span>      </span><span style={{ color: colors.success }}>'shopping-cart'</span><span>,</span>
                    <br />
                    <span>      </span><span style={{ color: colors.success }}>'payment-processing'</span>
                    <br />
                    <span>    ],</span>
                    <br />
                    <span>    database: </span><span style={{ color: colors.success }}>'mongodb'</span>
                    <br />
                    <span>  &#125;);</span>
                    <br /><br />
                    <span>  </span><span style={{ color: colors.info }}>return</span> <span>project;</span>
                    <br />
                    <span>&#125;</span>
                    <br /><br />
                    <span style={{ color: colors.info }}>const</span> <span>result = </span><span style={{ color: colors.secondary }}>generateApp</span><span>(userRequirements);</span>
                    <br />
                    <span style={{ color: colors.secondary }}>console</span>.<span style={{ color: colors.secondary }}>log</span><span>(</span><span style={{ color: colors.success }}>'✅ Project generated successfully!'</span><span>);</span>
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
              <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Why Choose CodePulse ?</h2>
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
                  <svg className="w-6 h-6" fill={colors.primary} viewBox="00 20 20">
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
           
           {/* Additional Features - 3 more features */}
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
               <div className="hidden md:block absolute top-10 right-0 w-full h-1" style={{ backgroundColor: `${colors.primary}30` }}>
                 <div className="animate-pulse absolute right-0 top-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-primary to-transparent" style={{ animation: 'pulse 1.5s infinite' }}></div>
               </div>
               <div 
                 className="p-6 rounded-xl relative z-10 transform transition-all duration-300 hover:scale-105"
                 style={{ 
                   backgroundColor: colors.surface,
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
               <div className="hidden md:block absolute top-10 right-0 w-full h-1" style={{ backgroundColor: `${colors.primary}30` }}>
                 <div className="animate-pulse absolute right-0 top-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-primary to-transparent" style={{ animation: 'pulse 1.5s infinite 0.5s' }}></div>
               </div>
               <div 
                 className="p-6 rounded-xl relative z-10 transform transition-all duration-300 hover:scale-105"
                 style={{ 
                   backgroundColor: colors.surface,
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
                 className="p-6 rounded-xl relative z-10 transform transition-all duration-300 hover:scale-105"
                 style={{ 
                   backgroundColor: colors.surface,
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

       {/* Tech Stack Section */}
       <div id="tech-stack" className="py-16" style={{ backgroundColor: colors.surface }}>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Tech Stack We Support</h2>
             <p className="mt-4 text-lg" style={{ color: colors.textSecondary }}>Generate code with your favorite technologies</p>
           </div>
           
           {Object.entries(techStacks).map(([category, stacks]) => (
             <div key={category} className="mb-12">
               <h3 className="text-2xl font-bold mb-8 text-center capitalize" style={{ color: colors.primary }}>
                 {category}
               </h3>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                 {stacks.map((tech, index) => (
                   <div 
                     key={index}
                     className="p-6 rounded-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
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
                     <div className="text-center">
                       <div 
                         className="w-16 h-16 mx-auto flex items-center justify-center rounded-lg mb-4 text-3xl" 
                         style={{ backgroundColor: `${colors.primary}10` }}
                       >
                         {tech.icon}
                       </div>
                       <h4 className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                         {tech.name}
                       </h4>
                       <p className="text-sm" style={{ color: colors.textSecondary }}>
                         {tech.description}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </div>

       {/* CTA Section */}
       <div className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: colors.primary }}>
         {/* Animated background particles */}
         <div className="absolute inset-0 overflow-hidden">
           <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: colors.surface }}></div>
           <div className="absolute top-40 -right-20 w-60 h-60 rounded-full opacity-10" style={{ backgroundColor: colors.surface }}></div>
           <div className="absolute -bottom-40 left-20 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: colors.surface }}></div>
         </div>
         
         <div className="max-w-4xl mx-auto text-center relative z-10">
           <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: colors.surface }}>Ready to supercharge your development?</h2>
           <p className="text-lg mb-8" style={{ color: colors.surface, opacity: 0.9 }}>Start generating high-quality code in minutes. No credit card required.</p>
           <button 
             onClick={handleGetStarted}
             className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg focus:outline-none transition-all duration-300 transform hover:scale-105"
             style={{ 
               color: colors.primary, 
               backgroundColor: colors.surface,
               border: `1px solid ${colors.surface}`
             }}
             onMouseOver={(e) => {
               e.currentTarget.style.backgroundColor = colors.background;
             }}
             onMouseOut={(e) => {
               e.currentTarget.style.backgroundColor = colors.surface;
             }}
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
                 <svg className="h-8 w-8" fill={colors.surface} viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                 </svg>
                 <span className="ml-2 text-xl font-bold" style={{ color: colors.surface }}>CodePulse</span>
               </div>
               <p className="mt-4 text-sm" style={{ color: colors.textLight }}>
                 Building the future of development with AI-powered tools.
               </p>
               <div className="mt-6 flex space-x-5">
                 <a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                    onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>
                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.017 3.747 11.657 11.657 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.093 4.093 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.615 11.615 0 006.29 1.84" />
                   </svg>
                 </a>
                 <a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                    onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>
                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                   </svg>
                 </a>
                 <a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                    onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                    onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>
                   <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                   </svg>
                 </a>
               </div>
             </div>
             
             <div>
               <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: colors.surface }}>Product</h3>
               <ul className="space-y-2 text-sm">
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Features</a></li>
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Tech Stack</a></li>
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Use Cases</a></li>
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Integrations</a></li>
               </ul>
             </div>
             
             <div>
               <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: colors.surface }}>Resources</h3>
               <ul className="space-y-2 text-sm">
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Documentation</a></li>
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>API Reference</a></li>
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Blog</a></li>
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Community</a></li>
               </ul>
             </div>
             
             <div>
               <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: colors.surface }}>Company</h3>
               <ul className="space-y-2 text-sm">
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>About Us</a></li>
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Careers</a></li>
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Contact</a></li>
                 <li><a href="#" className="transition-colors duration-300" style={{ color: colors.textLight }}
                        onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Privacy Policy</a></li>
               </ul>
             </div>
           </div>
           
           <div className="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center" 
                style={{ borderTop: `1px solid ${colors.borderDark}` }}>
             <p className="text-sm" style={{ color: colors.textLight }}>© {new Date().getFullYear()} CodePulse. All rights reserved.</p>
             <div className="flex space-x-6 mt-4 md:mt-0">
               <a href="#" className="transition-colors duration-300 text-sm" style={{ color: colors.textLight }}
                  onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Terms of Service</a>
               <a href="#" className="transition-colors duration-300 text-sm" style={{ color: colors.textLight }}
                  onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Privacy Policy</a>
               <a href="#" className="transition-colors duration-300 text-sm" style={{ color: colors.textLight }}
                  onMouseOver={(e) => { e.currentTarget.style.color = colors.surface; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = colors.textLight; }}>Cookie Policy</a>
             </div>
           </div>
         </div>
       </footer>
     </main>
   </div>
 );
}

export default Home;