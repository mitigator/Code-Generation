import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Loader from './LoadingSpinner';
import { themes } from '../assets/template';
import { useTheme } from '../services/ThemeContext';

function ProjectStartupPage() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [displayedDescription, setDisplayedDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  // Get current theme colors
  const colors = themes[currentTheme].colors;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const errorVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: { duration: 0.2 }
    }
  };

  // Steps configuration
  const steps = [
    { id: 1, name: 'Project Setup', current: true },
    { id: 2, name: 'Entity Generation', current: false },
    { id: 3, name: 'TechStack Selection', current: false },
    { id: 4, name: 'Folder Scaffolding', current: false },
    { id: 5, name: 'Code Generation', current: false },
    { id: 6, name: 'Code Refinement', current: false }
  ];

  // Typewriter effect for AI generated description
  const typewriterEffect = (text, callback) => {
    setIsTyping(true);
    setDisplayedDescription('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedDescription(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        if (callback) callback();
      }
    }, 30); // Adjust speed here (lower = faster)
  };

  useEffect(() => {
    // Try to load existing data if available
    axios.get('http://localhost:5000/api/entity-data')
      .then(response => {
        setProjectName(response.data.project_name);
        const description = response.data.project_description;
        setProjectDescription(description);
        setDisplayedDescription(description);
      })
      .catch(() => {
        // No existing data or error, continue with empty form
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleGenerate = async () => {
    if (!projectName || !projectDescription) {
      setError('Please fill in both fields');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const response = await axios.post('http://localhost:5000/api/description-generation', {
        project_name: projectName,
        project_description: projectDescription
      });

      const generatedText = response.data.text;
      setProjectDescription(generatedText);

      // Start typewriter effect for the generated description
      typewriterEffect(generatedText);
    } catch (error) {
      console.error('Error generating description:', error);
      setError('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndNext = async () => {
    if (!projectName || !projectDescription) {
      setError('Please fill in both fields');
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      await axios.post('http://localhost:5000/api/save-project', {
        project_name: projectName,
        project_description: projectDescription
      });

      navigate('/entity-generation');
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background }}>
        <Loader text="Loading your project..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col " style={{
      fontFamily: "'Inter', sans-serif",
      background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}30 100%)`
    }}>
      {/* Navbar */}
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8  ">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto "
        >
          {/* Progress tracker */}
          <div className="max-w-7xl mx-auto mb-8  ">
            <div className="bg-white rounded-lg shadow-sm p-6 " style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderDefault}` }}>
              <div className="flex items-center justify-between w-[70%]">
                {[
                  { id: 1, name: 'Project Setup', current: true, completed: false },
                  { id: 2, name: 'Entity Generation', current: false, completed: false },
                  { id: 3, name: 'TechStack Selection', current: false, completed: false },
                  { id: 4, name: 'Folder Scaffolding', current: false, completed: false },
                  { id: 5, name: 'Code Generation', current: false, completed: false },
                  { id: 6, name: 'Code Refinement', current: false, completed: false }
                ].map((step, stepIdx) => (
                  <React.Fragment key={step.id}>
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-200 ${step.completed || step.current ? 'text-white' : 'text-gray-500'
                          }`}
                        style={{
                          backgroundColor: step.completed
                            ? colors.success
                            : step.current
                              ? colors.primary
                              : `${colors.textLight}40`
                        }}
                      >
                        {step.completed ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="ml-3 hidden sm:block">
                        <span
                          className={`text-sm font-medium ${step.completed || step.current ? '' : 'opacity-50'
                            }`}
                          style={{
                            color: step.completed || step.current ? colors.textPrimary : colors.textLight
                          }}
                        >
                          {step.name}
                        </span>
                        {step.current && (
                          <div className="flex items-center mt-1">
                            <div className="flex space-x-1">
                              <div
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ backgroundColor: colors.primary }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{
                                  backgroundColor: colors.primary,
                                  animationDelay: '0.2s'
                                }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{
                                  backgroundColor: colors.primary,
                                  animationDelay: '0.4s'
                                }}
                              ></div>
                            </div>
                            <span
                              className="ml-2 text-xs"
                              style={{ color: colors.primary }}
                            >
                              In Progress
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {stepIdx < 5 && (
                      <div className="flex-1 mx-2 sm:mx-4">
                        <div
                          className="h-0.5 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: step.completed
                              ? colors.success
                              : step.current
                                ? `${colors.primary}50`
                                : `${colors.textLight}30`
                          }}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Mobile view - show only current step prominently */}
              <div className="sm:hidden mt-4 text-center">
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary
                  }}
                >
                  Step 2 of 6: Entity Generation
                </div>
              </div>
            </div>
          </div>

          <motion.div variants={itemVariants} className="text-center mb-10">
            <motion.h1
              className="text-3xl font-bold sm:text-4xl mb-4"
              style={{ color: colors.textPrimary }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Project Setup
            </motion.h1>
            <motion.p
              className="text-xl"
              style={{ color: colors.textSecondary }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Define your project details to get started with CodePulse
            </motion.p>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mb-6 p-4 rounded-lg border"
                style={{
                  backgroundColor: `${colors.error}10`,
                  borderColor: `${colors.error}30`
                }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5" style={{ color: colors.error }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium" style={{ color: colors.error }}>{error}</h3>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Form */}
          <motion.div
            variants={itemVariants}
            className="rounded-lg overflow-hidden shadow-lg transition-all duration-300"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.borderDefault,
              boxShadow: `0 10px 25px -5px ${colors.primary}15, 0 10px 10px -5px ${colors.primary}10`
            }}
            whileHover={{
              boxShadow: `0 20px 35px -5px ${colors.primary}20, 0 15px 20px -5px ${colors.primary}15`,
              y: -2
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 sm:p-8">
              <div className="space-y-6">
                {/* Project Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label htmlFor="projectName" className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Project Name
                  </label>
                  <motion.input
                    type="text"
                    id="projectName"
                    className="block w-full px-4 py-3 rounded-md border transition-all duration-200"
                    style={{
                      borderColor: colors.borderDefault,
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      color: colors.textPrimary,
                      backgroundColor: colors.surface
                    }}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Awesome Project"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                      e.target.style.boxShadow = `0 0 0 3px ${colors.primary}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.borderDefault;
                      e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                    }}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                </motion.div>

                {/* Project Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="projectDescription" className="block text-sm font-medium" style={{ color: colors.textPrimary }}>
                      Project Description
                    </label>
                    <motion.div
                      className="flex items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 1 }}
                    >
                      <span className="text-xs mr-2" style={{ color: colors.textSecondary }}>AI-Enhanced</span>
                      <motion.div
                        className="relative group"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <svg
                          className="h-4 w-4 cursor-pointer"
                          style={{ color: colors.info }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div
                          className="absolute hidden group-hover:block w-64 rounded-md shadow-lg p-3 z-10 right-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{
                            backgroundColor: colors.surface,
                            color: colors.textSecondary,
                            border: `1px solid ${colors.borderDefault}`
                          }}
                        >
                          Let our AI help you refine your project description.
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                  <div className="relative">
                    <motion.textarea
                      id="projectDescription"
                      rows={8}
                      className="block w-full px-4 py-3 rounded-md border transition-all duration-200"
                      style={{
                        borderColor: colors.borderDefault,
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        color: colors.textPrimary,
                        backgroundColor: colors.surface,
                        fontFamily: "'Inter', sans-serif",
                        resize: "vertical",
                        lineHeight: "1.5"
                      }}
                      value={isTyping ? displayedDescription : projectDescription}
                      onChange={(e) => {
                        if (!isTyping) {
                          setProjectDescription(e.target.value);
                          setDisplayedDescription(e.target.value);
                        }
                      }}
                      placeholder="Describe your project goals, requirements, and any specific details... The more detail you provide, the better the AI can help you generate your application."
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.primary;
                        e.target.style.boxShadow = `0 0 0 3px ${colors.primary}30`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = colors.borderDefault;
                        e.target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
                      }}
                      readOnly={isTyping}
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />

                    {/* Typing cursor animation */}
                    {isTyping && (
                      <motion.div
                        className="absolute"
                        style={{
                          right: '12px',
                          bottom: '40px',
                          width: '2px',
                          height: '20px',
                          backgroundColor: colors.primary
                        }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}

                    {/* Character count */}
                    <motion.div
                      className="absolute right-3 bottom-3 text-xs"
                      style={{ color: colors.textLight }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      {(isTyping ? displayedDescription : projectDescription).length} characters
                    </motion.div>
                  </div>

                  <motion.p
                    className="mt-2 text-sm flex items-center"
                    style={{ color: colors.textSecondary }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <svg
                      className="h-4 w-4 mr-1"
                      style={{ color: colors.primary }}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Be as detailed as possible for better AI generation results
                  </motion.p>
                </motion.div>

                {/* Example Section */}
                <motion.div
                  className="rounded-lg p-4 border"
                  style={{
                    backgroundColor: `${colors.primary}05`,
                    borderColor: `${colors.primary}20`
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Project Description Example
                  </h3>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    "I need an e-commerce platform for a small business selling handmade jewelry. It should include product listings with categories, a shopping cart, secure checkout with multiple payment options, user accounts, order tracking, and an admin dashboard to manage inventory and orders. The design should be mobile-responsive with a modern, elegant aesthetic that showcases product photography."
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="p-6 sm:px-8 sm:py-6 sm:flex sm:flex-row-reverse"
              style={{ backgroundColor: `${colors.background}` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <motion.button
                onClick={handleSaveAndNext}
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 sm:ml-3 disabled:opacity-75 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.surface,
                  boxShadow: `0 4px 6px -1px ${colors.primary}30, 0 2px 4px -1px ${colors.primary}20`
                }}
                onMouseOver={!isSaving ? (e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                  e.currentTarget.style.boxShadow = `0 6px 8px -1px ${colors.primary}40, 0 3px 6px -1px ${colors.primary}30`;
                } : undefined}
                onMouseOut={!isSaving ? (e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                  e.currentTarget.style.boxShadow = `0 4px 6px -1px ${colors.primary}30, 0 2px 4px -1px ${colors.primary}20`;
                } : undefined}
                whileHover={!isSaving ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isSaving ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isSaving ? (
                  <>
                    <motion.svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      style={{ color: colors.surface }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </motion.svg>
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <motion.svg
                      className="ml-2 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </motion.svg>
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={handleGenerate}
                disabled={isGenerating || isTyping}
                className="w-full mt-3 sm:mt-0 sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-lg text-base font-medium transition-all duration-300 border sm:mr-3 disabled:opacity-75 disabled:cursor-not-allowed"
                style={{
                  color: colors.primary,
                  borderColor: colors.borderDefault,
                  backgroundColor: colors.surface
                }}
                onMouseOver={!isGenerating && !isTyping ? (e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                  e.currentTarget.style.borderColor = colors.primary;
                } : undefined}
                onMouseOut={!isGenerating && !isTyping ? (e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.style.borderColor = colors.borderDefault;
                } : undefined}
                whileHover={!isGenerating && !isTyping ? { scale: 1.05, y: -2 } : {}}
                whileTap={!isGenerating && !isTyping ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {isGenerating ? (
                  <>
                    <motion.svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      style={{ color: colors.primary }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </motion.svg>
                    Enhancing with AI...
                  </>
                ) : (
                  <>
                    <motion.svg
                      className="mr-2 w-5 h-5"
                      style={{ color: colors.primary }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </motion.svg>
                    Enhance with AI
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="mt-8 flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            <motion.button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm font-medium transition-colors duration-200"
              style={{ color: colors.primary }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = colors.primaryDark;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = colors.primary;
              }}
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.svg
                className="mr-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                whileHover={{ x: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </motion.svg>
              Back to Home
            </motion.button>

            <div className="text-sm" style={{ color: colors.textLight }}>
              Step 1 of 6
            </div>
          </motion.div>
        </motion.div>

        {/* Tips Panel (floating) */}
        <motion.div
          className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-xs hidden md:block"
          style={{
            backgroundColor: colors.surface,
            borderLeft: `4px solid ${colors.secondary}`,
            boxShadow: `0 10px 25px -5px ${colors.secondary}20, 0 10px 10px -5px ${colors.secondary}10`
          }}
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 2, type: "spring", stiffness: 100, damping: 20 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-start">
            <motion.div
              className="flex-shrink-0 h-6 w-6 mr-2"
              style={{ color: colors.secondary }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <div>
              <h4 className="text-sm font-medium" style={{ color: colors.textPrimary }}>Tip: Let AI Help</h4>
              <p className="mt-1 text-xs" style={{ color: colors.textSecondary }}>
                Start with a basic description and click "Enhance with AI" to let our AI help you create a comprehensive project plan.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ProjectStartupPage;