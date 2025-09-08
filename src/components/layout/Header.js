'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

const Header = () => {
  const { trackEvent } = useAnalytics();

  const handleNavClick = (linkText, targetSection) => {
    trackEvent('navigation_click', {
      link_text: linkText,
      target_section: targetSection
    });

    // Smooth scroll to target
    const target = document.querySelector(targetSection);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header>
      <nav>
        <a href="#" className="logo">iterate</a>
        <ul className="nav-links">
          <li>
            <a 
              href="#games" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('games');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  trackEvent('navigation_click', { destination: 'games' });
                }
              }}
            >
              The Challenge
            </a>
          </li>
          <li>
            <a 
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('How It Works', '#how-it-works');
              }}
            >
              How It Works
            </a>
          </li>
          <li>
            <a 
              href="#coming-soon"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('Coming Soon', '#coming-soon');
              }}
            >
              Coming Soon
            </a>
          </li>
          <li>
            <a 
              href="#signup"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('Early Access', '#signup');
              }}
            >
              Early Access
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
