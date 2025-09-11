'use client';

import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useScrollEffects } from '@/hooks/useScrollEffects';
import appConfig from '@/lib/config';

const AnalyticsProvider = ({ children }) => {
  // Ensure self opt-out is applied as early as possible
  if (typeof window !== 'undefined') {
    try {
      if (appConfig.get('features.selfOptOut')) {
        localStorage.setItem('disable_posthog', 'true');
      }
    } catch {
      // no-op
    }
  }

  const { trackScrollDepth } = useAnalytics();
  useScrollEffects();

  useEffect(() => {
    // Track scroll depth events
    const handleScrollDepth = (event) => {
      trackScrollDepth(event.detail);
    };

    window.addEventListener('scrollDepth', handleScrollDepth);
    
    // Track time on page
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (window.analytics) {
        window.analytics.track('time_on_page', {
          seconds: timeSpent,
          minutes: Math.round(timeSpent / 60)
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scrollDepth', handleScrollDepth);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trackScrollDepth]);

  return <>{children}</>;
};

export default AnalyticsProvider;
