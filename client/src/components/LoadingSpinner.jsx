import React from 'react';
import { useTheme } from '../services/ThemeContext';
import { themes } from '../assets/template';

function Loader({ text = 'Loading...', size = 'large', showBackground = true }) {
  const { currentTheme } = useTheme();
  const colors = themes[currentTheme].colors;
  const themeInfo = themes[currentTheme];

  // Size configurations
  const sizeConfig = {
    small: {
      spinner: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-sm',
      container: 'p-4'
    },
    medium: {
      spinner: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-base',
      container: 'p-6'
    },
    large: {
      spinner: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-lg',
      container: 'p-8'
    }
  };

  const config = sizeConfig[size];

  // Enhanced spinning icon with theme-specific design
  const SpinnerIcon = () => {
    // Different spinner styles based on theme category
    const category = themeInfo.category?.toLowerCase();
    
    if (category === 'cyber' || category === 'tech') {
      return (
        <div className="relative">
          {/* Outer ring */}
          <div 
            className={`${config.spinner} border-4 rounded-full animate-spin`}
            style={{ 
              borderColor: `${colors.primary}30`,
              borderTopColor: colors.primary,
              borderRightColor: colors.secondary || colors.primary
            }}
          ></div>
          {/* Inner pulsing dot */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
          >
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.primary }}
            ></div>
          </div>
        </div>
      );
    }
    
    if (category === 'futuristic' || category === 'advanced') {
      return (
        <div className="relative">
          {/* Multiple rotating rings */}
          <div 
            className={`${config.spinner} border-4 rounded-full animate-spin`}
            style={{ 
              borderColor: 'transparent',
              borderTopColor: colors.primary,
              borderRightColor: colors.secondary || colors.primary
            }}
          ></div>
          <div 
            className={`${config.spinner} border-2 rounded-full animate-spin absolute inset-0`}
            style={{ 
              borderColor: 'transparent',
              borderBottomColor: colors.primaryLight,
              animationDirection: 'reverse',
              animationDuration: '1.5s'
            }}
          ></div>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg">{themeInfo.icon}</span>
          </div>
        </div>
      );
    }
    
    if (category === 'fantasy' || category === 'retro') {
      return (
        <div className="relative">
          {/* Magical pulse effect */}
          <div 
            className={`${config.spinner} border-4 rounded-full animate-spin`}
            style={{ 
              borderColor: `${colors.primary}20`,
              borderTopColor: colors.primary,
              borderBottomColor: colors.secondary || colors.primary,
              background: `radial-gradient(circle, ${colors.primary}10 0%, transparent 70%)`
            }}
          ></div>
          {/* Sparkle effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse">
              <span 
                className="text-xl"
                style={{ color: colors.primary }}
              >
                {themeInfo.icon}
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    // Default modern spinner for professional/industrial themes
    return (
      <div className="relative">
        {/* Main spinner */}
        <div 
          className={`${config.spinner} border-4 rounded-full animate-spin`}
          style={{ 
            borderColor: `${colors.primary}30`,
            borderTopColor: colors.primary
          }}
        ></div>
        {/* Center logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className={config.icon} 
            fill={colors.primary} 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  };

  // Background overlay component
  const BackgroundOverlay = () => {
    if (!showBackground) return null;
    
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
        style={{ 
          backgroundColor: `${colors.background}95` 
        }}
      >
        <LoaderContent />
      </div>
    );
  };

  // Main loader content
  const LoaderContent = () => (
    <div className={`text-center ${config.container}`}>
      <div className="inline-block relative mb-4">
        <SpinnerIcon />
      </div>
      
      {/* Loading text with theme colors */}
      <div className="space-y-2">
        <p 
          className={`${config.text} font-semibold`}
          style={{ color: colors.textPrimary }}
        >
          {text}
        </p>
        
        {/* Theme-specific subtitle */}
        <p 
          className="text-sm opacity-75"
          style={{ color: colors.textSecondary }}
        >
          {getThemeSubtitle()}
        </p>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: colors.primary,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  // Get theme-appropriate subtitle
  function getThemeSubtitle() {
    const category = themeInfo.category?.toLowerCase();
    
    const subtitles = {
      industrial: "Forging your code...",
      tech: "Processing circuits...",
      futuristic: "Initializing systems...",
      ai: "Training algorithms...",
      fantasy: "Casting spells...",
      cyber: "Hacking the matrix...",
      scientific: "Running experiments...",
      retro: "Compiling programs...",
      technical: "Drawing blueprints...",
      professional: "Building architecture...",
      advanced: "Quantum processing...",
      system: "Compiling modules...",
      data: "Streaming data...",
      security: "Securing vault...",
      default: "Please wait..."
    };
    
    return subtitles[category] || subtitles.default;
  }

  // Return appropriate component based on showBackground prop
  if (showBackground) {
    return <BackgroundOverlay />;
  }

  return <LoaderContent />;
}

export default Loader;