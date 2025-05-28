import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../services/ThemeContext';
import { themes } from '../assets/template';
import Loader from '../components/LoadingSpinner';

// Enhanced tech options with descriptions and proper icons
const techOptions = {
  backend: [
    {
      name: 'Express.js',
      description: 'Fast, unopinionated, minimalist web framework for Node.js',
      icon: 'expressjs'
    },
    {
      name: 'Django',
      description: 'High-level Python web framework that encourages rapid development',
      icon: 'django'
    },
    {
      name: 'Spring Boot',
      description: 'Java-based framework used to create micro-services',
      icon: 'spring'
    },
    {
      name: 'Laravel',
      description: 'PHP framework for web artisans',
      icon: 'laravel'
    },
    {
      name: 'Flask',
      description: 'Lightweight WSGI web application framework in Python',
      icon: 'flask'
    }
  ],
  frontend: [
    {
      name: 'React',
      description: 'JavaScript library for building user interfaces',
      icon: 'react'
    },
    {
      name: 'Angular',
      description: 'Platform for building mobile and desktop web applications',
      icon: 'angular'
    },
    {
      name: 'Vue.js',
      description: 'Progressive JavaScript framework for building UIs',
      icon: 'vue'
    },
    {
      name: 'Svelte',
      description: 'Radical new approach to building user interfaces',
      icon: 'svelte'
    },
    {
      name: 'Next.js',
      description: 'React framework for production',
      icon: 'nextjs'
    }
  ],
  database: [
    {
      name: 'MongoDB',
      description: 'Document-oriented NoSQL database',
      icon: 'mongodb'
    },
    {
      name: 'PostgreSQL',
      description: 'Powerful, open source object-relational database',
      icon: 'postgresql'
    },
    {
      name: 'MySQL',
      description: 'Open-source relational database management system',
      icon: 'mysql'
    },
    {
      name: 'SQLite',
      description: 'C-language library that implements a SQL database engine',
      icon: 'sqlite'
    },
    {
      name: 'Firebase',
      description: 'Google\'s platform for mobile and web application development',
      icon: 'firebase'
    }
  ],
  authentication: [
    {
      name: 'JWT',
      description: 'Compact, URL-safe means of representing claims between two parties',
      icon: 'jwt'
    },
    {
      name: 'OAuth',
      description: 'Open standard for access delegation',
      icon: 'oauth'
    },
    {
      name: 'Firebase Auth',
      description: 'Authentication service provided by Firebase',
      icon: 'firebase'
    },
    {
      name: 'Passport.js',
      description: 'Authentication middleware for Node.js',
      icon: 'passport'
    },
    {
      name: 'Session',
      description: 'Traditional server-side session management',
      icon: 'session'
    }
  ]
};

function TechStackSelection() {
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const [selectedStack, setSelectedStack] = useState({
    backend: [],
    frontend: [],
    database: '',
    authentication: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('backend');
  const [stackCompletion, setStackCompletion] = useState(0);

  // Get current theme colors
  const colors = themes[currentTheme].colors;

  // Calculate stack completion percentage
  useEffect(() => {
    let progress = 0;
    if (selectedStack.backend.length > 0) progress += 25;
    if (selectedStack.frontend.length > 0) progress += 25;
    if (selectedStack.database) progress += 25;
    if (selectedStack.authentication) progress += 25;
    setStackCompletion(progress);
  }, [selectedStack]);

  const handleTechSelect = (category, value) => {
    if (category === 'database' || category === 'authentication') {
      setSelectedStack(prev => ({
        ...prev,
        [category]: value
      }));
    } else {
      setSelectedStack(prev => ({
        ...prev,
        [category]: prev[category].includes(value)
          ? prev[category].filter(item => item !== value)
          : [...prev[category], value]
      }));
    }
  };

  const handleFinalizeProject = async () => {
    if (!isStackValid()) {
      setError('Please select at least one option for each category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update the final_entities.json with the tech stack
      await axios.post('http://localhost:5000/api/finalize-project', {
        stack: {
          backend: selectedStack.backend,
          frontend: selectedStack.frontend,
          database: selectedStack.database
        },
        additional_config: {
          authentication: selectedStack.authentication,
          deployment: 'Docker' // Default value
        }
      });

      // Navigate to the final confirmation page
      navigate('/project-confirmation');
    } catch (error) {
      console.error('Error finalizing project:', error);
      setError('Failed to save project configuration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStackValid = () => {
    return (
      selectedStack.backend.length > 0 &&
      selectedStack.frontend.length > 0 &&
      selectedStack.database &&
      selectedStack.authentication
    );
  };

  const getTechCategories = () => {
    return [
      { id: 'backend', name: 'Backend', icon: 'server' },
      { id: 'frontend', name: 'Frontend', icon: 'desktop' },
      { id: 'database', name: 'Database', icon: 'database' },
      { id: 'authentication', name: 'Authentication', icon: 'shield' }
    ];
  };

  const renderCategoryIcon = (icon) => {
    switch (icon) {
      case 'server':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        );
      case 'desktop':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
          </svg>
        );
      case 'database':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
            <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
            <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get proper tech stack icons
  const getTechIcon = (iconName, category) => {
    const icons = {
      // Backend
      'expressjs': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264" />
        </svg>
      ),
      'django': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.051 1.707.204V0zm0 9.143a3.894 3.894 0 00-1.325-.204c-1.988 0-3.134 1.223-3.134 3.364 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.143zM21.314 6.06v9.098c0 3.134-.229 4.638-.917 5.937-.637 1.249-1.478 2.039-3.211 2.905l-3.644-1.733c1.733-.815 2.574-1.529 3.109-2.625.561-1.121.739-2.421.739-5.835V6.061h3.924zM17.39.021h3.924v4.026H17.39V.021z" />
        </svg>
      ),
      'spring': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M21.8537 1.4158a10.4504 10.4504 0 0 1-1.284 2.2471A11.9666 11.9666 0 1 0 3.8518 20.7757l.4445-.3951a19.9915 19.9915 0 0 1-2.6766-7.0192 10.7999 10.7999 0 0 0-.1327-.4834c-.0193-.1025-.0426-.2012-.0426-.3037C1.4444 5.8807 5.693 1.4158 11.2 1.4158c2.3574 0 4.5053.8182 6.1963 2.1816.0623.0508.1168.1094.1597.1769.0507.0819.0867.1717.1045.2656.0178.0939.0172.1908-.0019.2844-.0191.0936-.0557.1827-.1074.2622-.0517.0795-.1175.1481-.1929.2009-.0754.0528-.1587.0891-.2438.1063-.0851.0172-.1705.0151-.25-.0062-.0795-.0213-.1532-.0593-.2159-.1111-.5073-.4214-1.0651-.7851-1.6643-1.0851z" />
        </svg>
      ),
      'laravel': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.007-.013.016-.024.024-.036a.384.384 0 01.033-.045c.010-.013.023-.023.034-.034l.04-.035c.011-.01.024-.018.037-.027a.388.388 0 01.041-.027c.014-.006.027-.015.041-.02a.375.375 0 01.062-.016c.02-.002.040-.009.06-.009h5.765a.378.378 0 01.324.189l5.155 8.926 5.156-8.926a.378.378 0 01.323-.189h5.765c.02 0 .04.007.061.009.02.005.041.01.061.016.014.005.028.014.041.02.014.009.028.018.042.027.012.009.025.017.036.027.013.011.026.021.035.034.012.015.024.031.033.045.008.012.017.023.024.036.008.019.017.038.023.058.005.012.011.02.014.032.009.032.014.065.014.098z" />
        </svg>
      ),
      'flask': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M14.33 12.005L9.669 8.669l.001-5.617a.5.5 0 01.5-.5h3.66a.5.5 0 01.5.5v8.953zm-4.66 0L5.05 15.34A2.999 2.999 0 007.463 19.2h9.074a2.999 2.999 0 002.414-3.86l-4.621-7.335zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4z" />
        </svg>
      ),

      // Frontend
      'react': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278z" />
        </svg>
      ),
      'angular': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M9.93 12.645h4.134L12 9.315l-2.07 3.33zm.002-10.592L12 0l2.068 2.053L24 4.895l-1.935 16.047L12 24l-10.065-3.058L0 4.895l9.932-2.842zm7.064 18.31l1.668-13.853-8.978-2.4-9.04 2.4L1.31 20.362l10.69 3.028L22.996 20.363z" />
        </svg>
      ),
      'vue': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M24 1.61h-4.64L12 14.29 4.64 1.61H0L12 22.39L24 1.61zM3.68 1.61L12 15.39L20.32 1.61h-3.04L12 9.4 6.72 1.61H3.68z" />
        </svg>
      ),
      'svelte': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M10.354 21.125a2.847 2.847 0 01-4.041-.304A2.735 2.735 0 015.965 18.5L7.5 16.965a2.847 2.847 0 014.041.304 2.735 2.735 0 01.348 2.321L10.354 21.125zm8.191-3.792a5.695 5.695 0 01-.692-4.641c.397-1.041.94-1.99 1.608-2.812a8.297 8.297 0 000-5.76A5.695 5.695 0 0114.82 2.5a8.297 8.297 0 00-5.76 0 5.695 5.695 0 01-4.641.692c-1.041-.397-1.99-.94-2.812-1.608a8.297 8.297 0 000 5.76A5.695 5.695 0 012.5 9.18a8.297 8.297 0 005.76 0 5.695 5.695 0 014.641-.692c1.041.397 1.99.94 2.812 1.608a8.297 8.297 0 000 5.76 5.695 5.695 0 01.832 2.477z" />
        </svg>
      ),
      'nextjs': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.5429.0445h-.4571z" />
        </svg>
      ),

      // Database
      'mongodb': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" />
        </svg>
      ),
      'postgresql': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M23.111 5.948c-.148-1.396-1.046-2.455-2.404-2.836-1.061-.298-2.407-.298-3.831.074-1.297.339-2.518.892-3.534 1.601-.717.501-1.383 1.084-1.97 1.725-.587-.641-1.253-1.224-1.97-1.725-1.016-.709-2.237-1.262-3.534-1.601-1.424-.372-2.77-.372-3.831-.074C.679 3.493-.219 4.552-.367 5.948c-.223 2.109.297 4.292 1.425 5.987.672 1.011 1.533 1.871 2.516 2.518.983.647 2.086 1.081 3.239 1.273 1.153.191 2.345.139 3.498-.154 1.153-.294 2.267-.822 3.264-1.548.997-.726 1.877-1.651 2.573-2.707.696-1.056 1.209-2.241 1.503-3.468.294-1.227.369-2.495.208-3.735-.161-1.24-.582-2.444-1.235-3.537-1.129-1.695-.647-3.878-.424-5.987z" />
        </svg>
      ),
      'mysql': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.274.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.684 72.684 0 00-.195 4.41H.054c.067-1.593.135-3.187.2-4.778h1.274c.367 1.214.77 2.435 1.134 3.68h.27c.433-1.252.867-2.467 1.14-3.68h1.287c.086 1.593.158 3.185.226 4.778h-.015z" />
        </svg>
      ),
      'sqlite': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M21.678 4.856c-1.447-.494-3.24-.84-5.27-1.012-.405-.035-.82-.058-1.246-.07C13.942 1.424 12.244 0 10.5 0c-1.928 0-3.5 1.569-3.5 3.5 0 .034.007.066.008.1-2.378.127-4.548.463-6.33 1.007-1.447.442-2.453 1.05-2.453 1.747 0 .232.102.44.27.614v.029c0 0-.027.056-.027.125 0 .346.28.625.625.625s.625-.279.625-.625c0-.069-.027-.125-.027-.125V6.84c.168-.174.27-.382.27-.614 0-.697-1.006-1.305-2.453-1.747z" />
        </svg>
      ),
      'firebase': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M5.016 4.756L6.624 1.32a.63.63 0 011.101 0l1.608 3.436-4.317 6.372-4.872-6.372zm-.234 7.566L12 20.604 4.15 12.322a.63.63 0 01.632-.754zM18.75 12.322L12 20.604l6.75-8.282a.63.63 0 01.632.754zM13.314 1.32a.63.63 0 011.101 0L22.852 12l-9.538-3.564L13.314 1.32zM12 13.506L1.148 12l9.538 3.564L12 13.506z" />
        </svg>
      ),

      // Authentication
      'jwt': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M10.2 0v6.456L12 8.928l1.8-2.472V0zm3.6 6.456v3.072l2.904-.96L20.52 3.36l-2.928-2.136zM20.52 3.36v17.28l-2.928 2.136V9.456L13.8 12.6zm-9.12 3.096l-2.904-.96V0h4.704zm-2.904-.96L3.48 3.36 6.408 1.224 10.2 6.456zM6.408 22.776L9.336 24l2.664-3.672v-5.04l-2.664 3.672zm11.184 0L20.52 24V9.144L15.6 15.288v5.04z" />
        </svg>
      ),
      'oauth': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169-.331-.455-.613-.797-.781C15.851 6.999 14.917 6.88 14 7.08c-.917.2-1.747.64-2.386 1.266-.639.626-1.078 1.44-1.266 2.34-.188.9-.124 1.817.184 2.653.308.836.82 1.575 1.474 2.127.654.552 1.42.903 2.207.997.787.094 1.577-.067 2.285-.465.708-.398 1.31-.99 1.74-1.711.43-.72.673-1.534.7-2.355.027-.821-.166-1.641-.57-2.372z" />
        </svg>
      ),
      'passport': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.4c5.302 0 9.6 4.298 9.6 9.6s-4.298 9.6-9.6 9.6S2.4 17.302 2.4 12 6.698 2.4 12 2.4zm-1.2 3.6v1.2h2.4V6h-2.4zm0 2.4v7.2h2.4V8.4h-2.4z" />
        </svg>
      ),
      'session': (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      )
    };

    // Default fallback icons
    const defaultIcons = {
      'backend': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
      'frontend': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          <path d="M14 16H6a2 2 0 00-2 2v2h12v-2a2 2 0 00-2-2z" />
        </svg>
      ),
      'database': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
      ),
      'authentication': (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    };

    // Return specific icon if available, otherwise fallback to category icon
    return icons[iconName] || defaultIcons[category];
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}20 100%)`,
        color: colors.textPrimary
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress tracker */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6" style={{ backgroundColor: colors.surface, border: `1px solid ${colors.borderDefault}` }}>
            <div className="flex items-center justify-between">
              {[
                { id: 1, name: 'Project Setup', current: false, completed: true },
                { id: 2, name: 'Entity Generation', current: false, completed: true },
                { id: 3, name: 'TechStack Selection', current: true, completed: false },
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
                Step 3 of 6: TechStack Selection
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold sm:text-4xl"
              style={{ color: colors.textPrimary }}
            >
              Tech Stack Selection
            </h1>
            <p
              className="mt-3 text-xl"
              style={{ color: colors.textSecondary }}
            >
              Choose the technologies for your project
            </p>
          </div>

          {/* Stack completion progress bar */}
          <div className="max-w-xl mx-auto mb-10">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-sm font-medium"
                style={{ color: colors.textSecondary }}
              >
                Stack Completion
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: stackCompletion === 100 ? colors.success : colors.primary }}
              >
                {stackCompletion}%
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stackCompletion}%`,
                  backgroundColor: stackCompletion === 100 ? colors.success : colors.primary
                }}
              ></div>
            </div>
          </div>

          {error && (
            <div
              className="max-w-7xl mx-auto mb-6 p-4 rounded-lg border flex items-start"
              style={{
                backgroundColor: `${colors.error}10`,
                borderColor: `${colors.error}30`
              }}
            >
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5"
                  style={{ color: colors.error }}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm" style={{ color: colors.error }}>{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto"
                style={{ color: colors.error }}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tabs for mobile */}
            <div className="flex overflow-x-auto lg:hidden p-1 mb-4 rounded-lg" style={{ backgroundColor: `${colors.primary}10` }}>
              {getTechCategories().map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center px-4 py-2 whitespace-nowrap text-sm font-medium rounded-md transition-all duration-200 ${activeTab === category.id ? 'shadow-sm' : ''
                    }`}
                  style={{
                    backgroundColor: activeTab === category.id ? colors.surface : 'transparent',
                    color: activeTab === category.id ? colors.primary : colors.textSecondary
                  }}
                >
                  <span className="mr-2">{renderCategoryIcon(category.icon)}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sidebar for desktop */}
            <div className="hidden lg:block w-64 shrink-0">
              <div
                className="p-4 rounded-lg sticky top-8"
                style={{ backgroundColor: colors.surface, boxShadow: `0 4px 6px -1px ${colors.primary}10` }}
              >
                <h3
                  className="text-lg font-medium mb-4 pb-2 border-b"
                  style={{ color: colors.textPrimary, borderColor: colors.borderDefault }}
                >
                  Categories
                </h3>
                <div className="space-y-1">
                  {getTechCategories().map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === category.id ? 'shadow-sm' : ''
                        }`}
                      style={{
                        backgroundColor: activeTab === category.id ? `${colors.primary}10` : 'transparent',
                        color: activeTab === category.id ? colors.primary : colors.textSecondary
                      }}
                    >
                      <span className="mr-3">{renderCategoryIcon(category.icon)}</span>
                      {category.name}
                      {category.id === 'backend' && selectedStack.backend.length > 0 && (
                        <span
                          className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full"
                          style={{ backgroundColor: colors.primary, color: colors.surface }}
                        >
                          {selectedStack.backend.length}
                        </span>
                      )}
                      {category.id === 'frontend' && selectedStack.frontend.length > 0 && (
                        <span
                          className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full"
                          style={{ backgroundColor: colors.primary, color: colors.surface }}
                        >
                          {selectedStack.frontend.length}
                        </span>
                      )}
                      {category.id === 'database' && selectedStack.database && (
                        <svg className="ml-auto w-5 h-5" style={{ color: colors.success }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {category.id === 'authentication' && selectedStack.authentication && (
                        <svg className="ml-auto w-5 h-5" style={{ color: colors.success }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>

                {/* Your Stack Summary */}
                <div className="mt-8 space-y-4">
                  <h3
                    className="text-sm font-medium mb-2 pb-2 border-b"
                    style={{ color: colors.textPrimary, borderColor: colors.borderDefault }}
                  >
                    Your Stack
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4
                        className="text-xs font-medium uppercase"
                        style={{ color: colors.textLight }}
                      >
                        Backend
                      </h4>
                      <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: selectedStack.backend.length ? colors.textPrimary : colors.textLight }}
                      >
                        {selectedStack.backend.length ? selectedStack.backend.join(', ') : 'None selected'}
                      </p>
                    </div>
                    <div>
                      <h4
                        className="text-xs font-medium uppercase"
                        style={{ color: colors.textLight }}
                      >
                        Frontend
                      </h4>
                      <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: selectedStack.frontend.length ? colors.textPrimary : colors.textLight }}
                      >
                        {selectedStack.frontend.length ? selectedStack.frontend.join(', ') : 'None selected'}
                      </p>
                    </div>
                    <div>
                      <h4
                        className="text-xs font-medium uppercase"
                        style={{ color: colors.textLight }}
                      >
                        Database
                      </h4>
                      <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: selectedStack.database ? colors.textPrimary : colors.textLight }}
                      >
                        {selectedStack.database || 'None selected'}
                      </p>
                    </div>
                    <div>
                      <h4
                        className="text-xs font-medium uppercase"
                        style={{ color: colors.textLight }}
                      >
                        Authentication
                      </h4>
                      <p
                        className="mt-1 text-sm font-medium"
                        style={{ color: selectedStack.authentication ? colors.textPrimary : colors.textLight }}
                      >
                        {selectedStack.authentication || 'None selected'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div
                className="shadow-lg rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: colors.surface,
                  boxShadow: `0 10px 15px -3px ${colors.primary}15, 0 4px 6px -2px ${colors.primary}10`
                }}
              >
                <div
                  className="px-6 py-4 border-b"
                  style={{ borderColor: colors.borderDefault }}
                >
                  <h2
                    className="text-xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    {activeTab === 'backend' && 'Backend Technologies'}
                    {activeTab === 'frontend' && 'Frontend Technologies'}
                    {activeTab === 'database' && 'Database Selection'}
                    {activeTab === 'authentication' && 'Authentication Method'}
                  </h2>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {activeTab === 'backend' && 'Select one or more server-side frameworks for your project'}
                    {activeTab === 'frontend' && 'Choose the client-side technologies for your user interface'}
                    {activeTab === 'database' && 'Pick a database system that best fits your project needs'}
                    {activeTab === 'authentication' && 'Select a method to handle user authentication'}
                  </p>
                </div>

                <div className="p-6">
                  {/* Backend selection */}
                  {activeTab === 'backend' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {techOptions.backend.map(tech => (
                        <div
                          key={tech.name}
                          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md`}
                          style={{
                            borderColor: selectedStack.backend.includes(tech.name)
                              ? colors.primary
                              : colors.borderDefault,
                            backgroundColor: selectedStack.backend.includes(tech.name)
                              ? `${colors.primary}05`
                              : colors.surface
                          }}
                          onClick={() => handleTechSelect('backend', tech.name)}
                        >
                          <div className="flex items-start">
                            <div
                              className="flex-shrink-0 h-12 w-12 rounded-md flex items-center justify-center mr-4"
                              style={{
                                backgroundColor: `${colors.primary}10`,
                                color: colors.primary
                              }}
                            >
                              {getTechIcon(tech.icon, 'backend')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3
                                  className="text-sm font-medium"
                                  style={{ color: colors.textPrimary }}
                                >
                                  {tech.name}
                                </h3>
                                <input
                                  type="checkbox"
                                  checked={selectedStack.backend.includes(tech.name)}
                                  onChange={() => { }}
                                  className="h-4 w-4 rounded"
                                  style={{
                                    accentColor: colors.primary
                                  }}
                                />
                              </div>
                              <p
                                className="mt-1 text-xs"
                                style={{ color: colors.textSecondary }}
                              >
                                {tech.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Frontend selection */}
                  {activeTab === 'frontend' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {techOptions.frontend.map(tech => (
                        <div
                          key={tech.name}
                          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md`}
                          style={{
                            borderColor: selectedStack.frontend.includes(tech.name)
                              ? colors.secondary
                              : colors.borderDefault,
                            backgroundColor: selectedStack.frontend.includes(tech.name)
                              ? `${colors.secondary}05`
                              : colors.surface
                          }}
                          onClick={() => handleTechSelect('frontend', tech.name)}
                        >
                          <div className="flex items-start">
                            <div
                              className="flex-shrink-0 h-12 w-12 rounded-md flex items-center justify-center mr-4"
                              style={{
                                backgroundColor: `${colors.secondary}10`,
                                color: colors.secondary
                              }}
                            >
                              {getTechIcon(tech.icon, 'frontend')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3
                                  className="text-sm font-medium"
                                  style={{ color: colors.textPrimary }}
                                >
                                  {tech.name}
                                </h3>
                                <input
                                  type="checkbox"
                                  checked={selectedStack.frontend.includes(tech.name)}
                                  onChange={() => { }}
                                  className="h-4 w-4 rounded"
                                  style={{
                                    accentColor: colors.secondary
                                  }}
                                />
                              </div>
                              <p
                                className="mt-1 text-xs"
                                style={{ color: colors.textSecondary }}
                              >
                                {tech.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Database selection */}
                  {activeTab === 'database' && (
                    <div className="space-y-4">
                      {techOptions.database.map(tech => (
                        <div
                          key={tech.name}
                          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md`}
                          style={{
                            borderColor: selectedStack.database === tech.name
                              ? colors.info
                              : colors.borderDefault,
                            backgroundColor: selectedStack.database === tech.name
                              ? `${colors.info}05`
                              : colors.surface
                          }}
                          onClick={() => handleTechSelect('database', tech.name)}
                        >
                          <div className="flex items-start">
                            <div
                              className="flex-shrink-0 h-12 w-12 rounded-md flex items-center justify-center mr-4"
                              style={{
                                backgroundColor: `${colors.info}10`,
                                color: colors.info
                              }}
                            >
                              {getTechIcon(tech.icon, 'database')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3
                                  className="text-sm font-medium"
                                  style={{ color: colors.textPrimary }}
                                >
                                  {tech.name}
                                </h3>
                                <input
                                  type="radio"
                                  checked={selectedStack.database === tech.name}
                                  onChange={() => { }}
                                  className="h-4 w-4"
                                  style={{
                                    accentColor: colors.info
                                  }}
                                />
                              </div>
                              <p
                                className="mt-1 text-xs"
                                style={{ color: colors.textSecondary }}
                              >
                                {tech.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Authentication selection */}
                  {activeTab === 'authentication' && (
                    <div className="space-y-4">
                      {techOptions.authentication.map(tech => (
                        <div
                          key={tech.name}
                          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md`}
                          style={{
                            borderColor: selectedStack.authentication === tech.name
                              ? colors.warning
                              : colors.borderDefault,
                            backgroundColor: selectedStack.authentication === tech.name
                              ? `${colors.warning}05`
                              : colors.surface
                          }}
                          onClick={() => handleTechSelect('authentication', tech.name)}
                        >
                          <div className="flex items-start">
                            <div
                              className="flex-shrink-0 h-12 w-12 rounded-md flex items-center justify-center mr-4"
                              style={{
                                backgroundColor: `${colors.warning}10`,
                                color: colors.warning
                              }}
                            >
                              {getTechIcon(tech.icon, 'authentication')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3
                                  className="text-sm font-medium"
                                  style={{ color: colors.textPrimary }}
                                >
                                  {tech.name}
                                </h3>
                                <input
                                  type="radio"
                                  checked={selectedStack.authentication === tech.name}
                                  onChange={() => { }}
                                  className="h-4 w-4"
                                  style={{
                                    accentColor: colors.warning
                                  }}
                                />
                              </div>
                              <p
                                className="mt-1 text-xs"
                                style={{ color: colors.textSecondary }}
                              >
                                {tech.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="mt-8 flex flex-col sm:flex-row justify-between">
                <button
                  onClick={() => navigate('/entity-generation')}
                  className="mb-4 sm:mb-0 inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    color: colors.primary,
                    borderColor: colors.borderDefault
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = colors.borderDefault;
                  }}
                >
                  <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Entity Generation
                </button>

                <button
                  onClick={handleFinalizeProject}
                  disabled={loading || !isStackValid()}
                  className={`inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isStackValid() ? 'transform hover:translate-y-px' : ''
                    }`}
                  style={{
                    color: colors.surface,
                    backgroundColor: isStackValid() ? colors.secondary : colors.textLight,
                    borderColor: 'transparent',
                    boxShadow: isStackValid() ? `0 4px 6px -1px ${colors.secondary}30, 0 2px 4px -1px ${colors.secondary}20` : 'none'
                  }}
                  onMouseOver={isStackValid() ? (e) => {
                    e.currentTarget.style.backgroundColor = colors.secondaryDark;
                    e.currentTarget.style.boxShadow = `0 6px 8px -1px ${colors.secondary}40, 0 3px 6px -1px ${colors.secondary}30`;
                  } : undefined}
                  onMouseOut={isStackValid() ? (e) => {
                    e.currentTarget.style.backgroundColor = colors.secondary;
                    e.currentTarget.style.boxShadow = `0 4px 6px -1px ${colors.secondary}30, 0 2px 4px -1px ${colors.secondary}20`;
                  } : undefined}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Finalizing Project...
                    </>
                  ) : (
                    <>
                      Finalize Project
                      <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile summary */}
          <div className="lg:hidden mt-8 p-4 rounded-lg shadow-lg" style={{ backgroundColor: colors.surface }}>
            <h3
              className="text-sm font-medium mb-4 pb-2 border-b"
              style={{ color: colors.textPrimary, borderColor: colors.borderDefault }}
            >
              Your Tech Stack Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4
                  className="text-xs font-medium uppercase"
                  style={{ color: colors.textLight }}
                >
                  Backend
                </h4>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: selectedStack.backend.length ? colors.textPrimary : colors.textLight }}
                >
                  {selectedStack.backend.length ? selectedStack.backend.join(', ') : 'None selected'}
                </p>
              </div>
              <div>
                <h4
                  className="text-xs font-medium uppercase"
                  style={{ color: colors.textLight }}
                >
                  Frontend
                </h4>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: selectedStack.frontend.length ? colors.textPrimary : colors.textLight }}
                >
                  {selectedStack.frontend.length ? selectedStack.frontend.join(', ') : 'None selected'}
                </p>
              </div>
              <div>
                <h4
                  className="text-xs font-medium uppercase"
                  style={{ color: colors.textLight }}
                >
                  Database
                </h4>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: selectedStack.database ? colors.textPrimary : colors.textLight }}
                >
                  {selectedStack.database || 'None selected'}
                </p>
              </div>
              <div>
                <h4
                  className="text-xs font-medium uppercase"
                  style={{ color: colors.textLight }}
                >
                  Authentication
                </h4>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: selectedStack.authentication ? colors.textPrimary : colors.textLight }}
                >
                  {selectedStack.authentication || 'None selected'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating help button */}
      <div
        className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-20 cursor-pointer transition-transform duration-300 hover:scale-110"
        style={{
          backgroundColor: colors.primary,
          color: colors.surface,
          boxShadow: `0 10px 15px -3px ${colors.primary}30, 0 4px 6px -2px ${colors.primary}20`
        }}
        onClick={() => {
          window.open('https://docs.flowiseai.com/tech-stack-guide', '_blank');
        }}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

export default TechStackSelection;