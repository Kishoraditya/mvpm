'use client';

import { useAnalytics } from '@/hooks/useAnalytics';

const CTAButton = ({ 
  children, 
  href, 
  onClick, 
  className = '', 
  location = 'unknown',
  ...props 
}) => {
  const { trackCTAClick } = useAnalytics();

  const handleClick = (e) => {
    // Track CTA click
    trackCTAClick(children, location);

    // Handle smooth scrolling for anchor links
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }

    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  const buttonProps = {
    className: `cta-button ${className}`,
    onClick: handleClick,
    ...props
  };

  if (href && !href.startsWith('#')) {
    return (
      <a href={href} {...buttonProps}>
        {children}
      </a>
    );
  }

  return (
    <button {...buttonProps}>
      {children}
    </button>
  );
};

export default CTAButton;
