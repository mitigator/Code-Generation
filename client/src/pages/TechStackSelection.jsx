import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/LoadingSpinner';

// Enhanced tech options with descriptions and icons
const techOptions = {
  backend: [
    { name: 'Express.js', description: 'Fast, unopinionated, minimalist web framework for Node.js', icon: 'https://expressjs.com/images/express-facebook-share.png' },
    { name: 'Django', description: 'High-level Python web framework that encourages rapid development', icon: 'https://static.djangoproject.com/img/logos/django-logo-negative.png' },
    { name: 'Spring Boot', description: 'Java-based framework used to create micro-services', icon: 'https://spring.io/images/spring-logo-9146a4d3298760c2e7e49595184e1975.svg' },
    { name: 'Laravel', description: 'PHP framework for web artisans', icon: 'https://laravel.com/img/logomark.min.svg' },
    { name: 'Flask', description: 'Lightweight WSGI web application framework in Python', icon: 'https://flask.palletsprojects.com/en/2.0.x/_images/flask-logo.png' }
  ],
  frontend: [
    { name: 'React', description: 'JavaScript library for building user interfaces', icon: 'https://reactjs.org/logo-og.png' },
    { name: 'Angular', description: 'Platform for building mobile and desktop web applications', icon: 'https://angular.io/assets/images/logos/angular/angular.svg' },
    { name: 'Vue.js', description: 'Progressive JavaScript framework for building UIs', icon: 'https://vuejs.org/images/logo.png' },
    { name: 'Svelte', description: 'Radical new approach to building user interfaces', icon: 'https://svelte.dev/svelte-logo-horizontal.svg' },
    { name: 'Next.js', description: 'React framework for production', icon: 'https://nextjs.org/static/favicon/favicon-32x32.png' }
  ],
  database: [
    { name: 'MongoDB', description: 'Document-oriented NoSQL database', icon: 'https://webassets.mongodb.com/_com_assets/cms/MongoDB_Logo_FullColorBlack_RGB-4td3yuxzjs.png' },
    { name: 'PostgreSQL', description: 'Powerful, open source object-relational database', icon: 'https://www.postgresql.org/media/img/about/press/elephant.png' },
    { name: 'MySQL', description: 'Open-source relational database management system', icon: 'https://www.mysql.com/common/logos/logo-mysql-170x115.png' },
    { name: 'SQLite', description: 'C-language library that implements a SQL database engine', icon: 'https://sqlite.org/images/sqlite370_banner.gif' },
    { name: 'Firebase', description: 'Google\'s platform for mobile and web application development', icon: 'https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png' }
  ],
  authentication: [
    { name: 'JWT', description: 'Compact, URL-safe means of representing claims between two parties', icon: 'https://jwt.io/img/pic_logo.svg' },
    { name: 'OAuth', description: 'Open standard for access delegation', icon: 'https://oauth.net/images/oauth-2-sm.png' },
    { name: 'Firebase Auth', description: 'Authentication service provided by Firebase', icon: 'https://firebase.google.com/downloads/brand-guidelines/PNG/logo-logomark.png' },
    { name: 'Passport.js', description: 'Authentication middleware for Node.js', icon: 'http://passportjs.org/images/passport.png' },
    { name: 'Session', description: 'Traditional server-side session management', icon: '' }
  ]
};

function TechStackSelection() {
  const navigate = useNavigate();
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

  // Color Scheme (matching previous components)
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

  // Get SVG placeholder for tech icons
  const getTechIcon = (tech, category) => {
    // Return tech-specific icon if available
    const svgIcons = {
      'React': (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zM17.992 16.255l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 0 0-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 0 0-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 0 1 3.233-.501 24.847 24.847 0 0 1 2.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zM16.795 22.677c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 0 0 2.421-2.968l.135-.193.234-.02a23.63 23.63 0 0 0 3.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 0 1-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 0 1-3.234.501 24.674 24.674 0 0 1-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 0 0-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 0 0-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0 1 14.75 7.24zM7.206 22.677A2.38 2.38 0 0 1 6 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 0 0 2.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 0 1-2.052-2.545 24.976 24.976 0 0 1-3.233-.501zM12 16.878c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 0 1-1.35-2.122 30.354 30.354 0 0 1-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 0 1 1.166-2.228c.414-.716.869-1.43 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 0 1 5.033 0l.234.02.134.193a30.006 30.006 0 0 1 2.517 4.35l.101.213-.101.213a29.6 29.6 0 0 1-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 0 0 2.196-3.798 28.585 28.585 0 0 0-2.197-3.798 29.031 29.031 0 0 0-4.394 0 28.477 28.477 0 0 0-2.197 3.798 29.114 29.114 0 0 0 2.197 3.798z" />
        </svg>
      ),
      'Express.js': (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264" />
        </svg>
      ),
      'MongoDB': (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" />
        </svg>
      ),
      'PostgreSQL': (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
          <path d="M23.5594 14.7228a.4567.4567 0 00-.0334-.1015c-.0217-.0457-.0334-.0914-.0553-.1372-.0993-.2078-.2213-.4045-.3432-.6011-.1829-.2973-.3772-.5832-.5595-.8801a5.7776 5.7776 0 01-.324-.51c-.016-.027-.0443-.0521-.0553-.0812-.0197-.0521 0-.1015.0266-.1536a.9962.9962 0 00.0723-.1834 2.9467 2.9467 0 00.0932-.3863c.027-.1356.0682-.271.0932-.4065a19.1668 19.1668 0 00.1856-.9799c.1038-.5847.2200-1.169.3239-1.7537.1038-.5944.2076-1.1887.3114-1.7932.1039-.6042.2174-1.2084.3213-1.8231.0443-.2724.0866-.5461.135-.8185.0127-.0698.0266-.1397.0404-.2095.0189-.1129.0767-.2095.135-.3113a.3634.3634 0 01.1659-.1437c.0901-.0344.1909-.0472.2864-.0344a.7822.7822 0 01.324.0979 2.6742 2.6742 0 01.2786.1729 5.5795 5.5795 0 01.341.2437 2.68 2.68 0 00.2363.1756.7472.7472 0 00.319.0991.5709.5709 0 00.419-.0978 1.0087 1.0087 0 00.2519-.2462.8771.8771 0 00.1336-.2758.6032.6032 0 00-.016-.3038c-.0335-.1116-.0963-.2151-.1758-.3023-.0961-.1058-.1909-.2151-.2874-.3239a9.7632 9.7632 0 00-.3585-.3784c-.27-.2737-.5587-.5421-.8679-.7939a5.5113 5.5113 0 00-.4099-.3036 14.2768 14.2768 0 00-.7478-.5156 4.0563 4.0563 0 00-.8467-.4795 2.7628 2.7628 0 00-.8399-.2096h-.0044a1.8709 1.8709 0 00-.8309.2187 2.6426 2.6426 0 00-.6957.4908 3.2499 3.2499 0 00-.3222.3341 3.1308 3.1308 0 00-.3605.4908l-.0799.1318c-.1071.175-.2228.3443-.3251.5226-.1868.3264-.3697.6554-.5465.9856l-.5532 1.0526c-.3826.7301-.7697 1.4588-1.1497 2.1901-.1903.3666-.3798.7344-.5695 1.1023l-.0391.0775c-.1078.2168-.2194.4403-.315.6661a2.9038 2.9038 0 00-.1956.6251 1.3559 1.3559 0 00-.0189.7581c.0387.1741.1.3418.1871.4988a1.9571 1.9571 0 001.672.9365h.0097a3.4421 3.4421 0 001.4752-.3341 5.8395 5.8395 0 001.3641-.9233c.4188-.3366.8274-.6937 1.2063-1.0724.189-.1905.3793-.3823.5722-.571.3356-.3379.6908-.6779 1.0412-1.0211a3.3642 3.3642 0 00.0051-.0051 22.3927 22.3927 0 011.4957-1.4323.9946.9946 0 01.1164-.0905c.0315-.0178.0646-.0178.0961 0a.2425.2425 0 01.135.1446 6.1363 6.1363 0 01.0625.7812 5.2465 5.2465 0 01-.0189.6122 22.2316 22.2316 0 01-.152 1.971c-.0484.3802-.1142.7559-.1961 1.1316a22.2879 22.2879 0 01-.2467 1.1469c-.0484.1756-.092.3523-.1501.5278a14.9326 14.9326 0 01-.1771.5664 15.148 15.148 0 01-.7421 1.8432c-.1429.2999-.2916.5944-.4482.8865a19.3245 19.3245 0 01-1.2012 1.9321c-.2256.3367-.4669.6643-.7065.9931a7.6686 7.6686 0 01-.9338 1.0913 5.9615 5.9615 0 01-.8654.7514 4.0786 4.0786 0 01-1.0248.5741 3.0239 3.0239 0 01-1.1497.1654 2.614 2.614 0 01-1.0591-.248 3.0772 3.0772 0 01-.8476-.5883 3.4757 3.4757 0 01-.7949-1.0692 4.7048 4.7048 0 01-.4228-1.1887 7.0407 7.0407 0 01-.2115-1.2695 9.9923 9.9923 0 01-.0391-1.2453c.0088-.2979.0392-.5931.08-.888.0459-.3611.1078-.7222.1778-1.0795.0483-.2178.0932-.4368.1381-.656.0773-.4178.1594-.8331.2467-1.2492l.143-.6718c.0566-.2737.1145-.5474.1727-.8211.0589-.2965.1116-.5944.1647-.8904.0391-.2178.1038-.548.125-.779a.5346.5346 0 00-.1078-.373.7819.7819 0 00-.4397-.2868 1.186 1.186 0 00-.3184-.051 1.3138 1.3138 0 00-.5428.1654 2.3693 2.3693 0 00-.4026.2938c-.1367.1119-.2622.2343-.3747.367a4.8383 4.8383 0 00-.271.3366 6.7644 6.7644 0 00-.7463 1.1887c-.326.5893-.683 1.1621-.9719 1.77-.0775.1663-.1612.3313-.2268.5008a1.5117 1.5117 0 00-.1121.41v.0241a.3472.3472 0 00.0566.1729.4369.4369 0 00.2514.1398.5193.5193 0 00.1967.0115.6027.6027 0 00.2467-.1267 1.2506 1.2506 0 00.1189-.1233c.0599-.0621.113-.1276.1709-.1893a6.8289 6.8289 0 00.5252-.6147 13.021 13.021 0 00.6144-.8788c.0909-.1356.1795-.2737.2702-.4109.1772-.2686.3523-.532.5305-.7927a9.197 9.197 0 01.2504-.367.9298.9298 0 01.0837-.0839.3689.3689 0 01.1887-.1171.166.166 0 01.1604.0724.4294.4294 0 01.0289.2151c-.001.061-.0081.122-.0211.1816a1.9078 1.9078 0 01-.0669.2686c-.0323.1103-.0645.2219-.0961.3315-.0393.141-.0836.2804-.1278.4209a15.164 15.164 0 01-.4247 1.211 23.5225 23.5225 0 01-.6654 1.5435c-.2459.5335-.5138 1.0553-.8093 1.5639-.0741.1316-.1544.2607-.2383.3866-.096.1401-.196.2793-.3008.4153a4.7444 4.7444 0 01-.5587.6695 2.8613 2.8613 0 01-.8439.5945 1.3854 1.3854 0 01-.459.0851h-.0566a.8353.8353 0 01-.6957-.4147" />
          </svg>
      ),
      'JWT': (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.2 0v6.456L12 8.928l1.8-2.472V0zm3.6 6.456v3.072l2.904-.96L20.52 3.36l-2.928-2.136zM20.52 3.36v17.28l-2.928 2.136V9.456L13.8 12.6l-1.8 2.472-1.8-2.472-3.792-3.144v13.32L3.48 20.64V3.36L6.408 1.224 10.2 6.456l2.904-3.096zm-9.12 3.096l-2.904-.96V0h4.704zM6.408 22.776L9.336 24l2.664-3.672v-5.04l-2.664 3.672-2.928-2.136zm11.184 0L20.52 24V9.144L15.6 15.288v5.04zM15.6 20.328l2.928-2.136-2.928-4.032z" />
        </svg>
      ),
    };

    // Default icons by category
    const defaultIcons = {
      'backend': (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm14 1a1 1 0 11-2 0 1 1 0 012 0zM2 13a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2zm14 1a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
      'frontend': (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          <path d="M14 16H6a2 2 0 00-2 2v2h12v-2a2 2 0 00-2-2z" />
        </svg>
      ),
      'database': (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
      ),
      'authentication': (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    };

    // Return specific icon if available, otherwise fallback to category icon
    return svgIcons[tech] || defaultIcons[category];
  };

  return (
    <div 
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primaryLight}20 100%)`,
        color: colors.textPrimary 
      }}
    >
      {/* Progress tracker */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.success }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Project Setup</span>
            </div>
          </div>
          <div 
            className="flex-grow h-0.5 mx-4"
            style={{ backgroundColor: colors.success }}
          ></div>
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.success }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Entity Generation</span>
            </div>
          </div>
          <div 
            className="flex-grow h-0.5 mx-4"
            style={{ backgroundColor: colors.primary }}
          ></div>
          <div className="flex items-center">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: colors.primary }}
            >
              3
            </div>
            <div className="ml-3">
              <span className="text-sm font-medium">Tech Stack</span>
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
            className="max-w-7xl mx-auto mb-6 p-4 rounded-lg border flex items-start animate-bounce-once"
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
                className={`flex items-center px-4 py-2 whitespace-nowrap text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === category.id ? 'shadow-sm' : ''
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
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeTab === category.id ? 'shadow-sm' : ''
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
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
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
                    {techOptions.backend.map(tech => {
                      const techObj = typeof tech === 'string' ? { name: tech } : tech;
                      return (
                        <div
                          key={techObj.name}
                          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                            selectedStack.backend.includes(techObj.name) ? 'border-primary-500' : 'hover:border-primary-200'
                          }`}
                          style={{ 
                            borderColor: selectedStack.backend.includes(techObj.name) 
                              ? colors.primary 
                              : colors.borderDefault,
                            backgroundColor: selectedStack.backend.includes(techObj.name) 
                              ? `${colors.primary}05` 
                              : colors.surface
                          }}
                          onClick={() => handleTechSelect('backend', techObj.name)}
                        >
                          <div className="flex items-start">
                            <div 
                              className="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center mr-4"
                              style={{ 
                                backgroundColor: `${colors.primary}10`,
                                color: colors.primary
                              }}
                            >
                              {getTechIcon(techObj.name, 'backend')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 
                                  className="text-sm font-medium"
                                  style={{ color: colors.textPrimary }}
                                >
                                  {techObj.name}
                                </h3>
                                <input
                                  type="checkbox"
                                  checked={selectedStack.backend.includes(techObj.name)}
                                  onChange={() => {}}
                                  className="h-4 w-4 rounded"
                                  style={{ 
                                    color: colors.primary,
                                    borderColor: colors.borderDefault
                                  }}
                                />
                              </div>
                              <p 
                                className="mt-1 text-xs"
                                style={{ color: colors.textSecondary }}
                              >
                                {techObj.description || `A popular backend technology for building web applications.`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Frontend selection */}
                {activeTab === 'frontend' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {techOptions.frontend.map(tech => {
                      const techObj = typeof tech === 'string' ? { name: tech } : tech;
                      return (
                        <div
                          key={techObj.name}
                          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                            selectedStack.frontend.includes(techObj.name) ? 'border-primary-500' : 'hover:border-primary-200'
                          }`}
                          style={{ 
                            borderColor: selectedStack.frontend.includes(techObj.name) 
                              ? colors.primary 
                              : colors.borderDefault,
                            backgroundColor: selectedStack.frontend.includes(techObj.name) 
                              ? `${colors.primary}05` 
                              : colors.surface
                          }}
                          onClick={() => handleTechSelect('frontend', techObj.name)}
                        >
                          <div className="flex items-start">
                            <div 
                              className="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center mr-4"
                              style={{ 
                                backgroundColor: `${colors.secondary}10`,
                                color: colors.secondary
                              }}
                            >
                              {getTechIcon(techObj.name, 'frontend')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 
                                  className="text-sm font-medium"
                                  style={{ color: colors.textPrimary }}
                                >
                                  {techObj.name}
                                </h3>
                                <input
                                  type="checkbox"
                                  checked={selectedStack.frontend.includes(techObj.name)}
                                  onChange={() => {}}
                                  className="h-4 w-4 rounded"
                                  style={{ 
                                    color: colors.secondary,
                                    borderColor: colors.borderDefault
                                  }}
                                />
                              </div>
                              <p 
                                className="mt-1 text-xs"
                                style={{ color: colors.textSecondary }}
                              >
                                {techObj.description || `A powerful frontend framework for building dynamic user interfaces.`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Database selection */}
                {activeTab === 'database' && (
                  <div className="space-y-4">
                    {techOptions.database.map(tech => {
                      const techObj = typeof tech === 'string' ? { name: tech } : tech;
                      return (
                        <div
                          key={techObj.name}
                          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                            selectedStack.database === techObj.name ? 'border-primary-500' : 'hover:border-primary-200'
                          }`}
                          style={{ 
                            borderColor: selectedStack.database === techObj.name 
                              ? colors.info 
                              : colors.borderDefault,
                            backgroundColor: selectedStack.database === techObj.name 
                              ? `${colors.info}05` 
                              : colors.surface
                          }}
                          onClick={() => handleTechSelect('database', techObj.name)}
                        >
                          <div className="flex items-start">
                            <div 
                              className="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center mr-4"
                              style={{ 
                                backgroundColor: `${colors.info}10`,
                                color: colors.info
                              }}
                            >
                              {getTechIcon(techObj.name, 'database')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 
                                  className="text-sm font-medium"
                                  style={{ color: colors.textPrimary }}
                                >
                                  {techObj.name}
                                </h3>
                                <input
                                  type="radio"
                                  checked={selectedStack.database === techObj.name}
                                  onChange={() => {}}
                                  className="h-4 w-4"
                                  style={{ 
                                    color: colors.info,
                                    borderColor: colors.borderDefault
                                  }}
                                />
                              </div>
                              <p 
                                className="mt-1 text-xs"
                                style={{ color: colors.textSecondary }}
                              >
                                {techObj.description || `A reliable database system for managing application data.`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Authentication selection */}
                {activeTab === 'authentication' && (
                  <div className="space-y-4">
                    {techOptions.authentication.map(tech => {
                      const techObj = typeof tech === 'string' ? { name: tech } : tech;
                      return (
                        <div
                          key={techObj.name}
                          className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                            selectedStack.authentication === techObj.name ? 'border-primary-500' : 'hover:border-primary-200'
                          }`}
                          style={{ 
                            borderColor: selectedStack.authentication === techObj.name 
                              ? colors.warning 
                              : colors.borderDefault,
                            backgroundColor: selectedStack.authentication === techObj.name 
                              ? `${colors.warning}05` 
                              : colors.surface
                          }}
                          onClick={() => handleTechSelect('authentication', techObj.name)}
                        >
                          <div className="flex items-start">
                            <div 
                              className="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center mr-4"
                              style={{ 
                                backgroundColor: `${colors.warning}10`,
                                color: colors.warning
                              }}
                            >
                              {getTechIcon(techObj.name, 'authentication')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 
                                  className="text-sm font-medium"
                                  style={{ color: colors.textPrimary }}
                                >
                                  {techObj.name}
                                </h3>
                                <input
                                  type="radio"
                                  checked={selectedStack.authentication === techObj.name}
                                  onChange={() => {}}
                                  className="h-4 w-4"
                                  style={{ 
                                    color: colors.warning,
                                    borderColor: colors.borderDefault
                                  }}
                                />
                              </div>
                              <p 
                                className="mt-1 text-xs"
                                style={{ color: colors.textSecondary }}
                              >
                                {techObj.description || `A secure method for handling user authentication.`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

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
                className={`inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isStackValid() ? 'transform hover:translate-y-px' : ''
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