'use client';

import { useEffect, useRef } from 'react';
import { getAnalytics } from '@/lib/analytics';

export const useAnalytics = () => {
  const analyticsRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      analyticsRef.current = getAnalytics();
      analyticsRef.current.init();
      initialized.current = true;
    }
  }, []);

  const trackEvent = (eventName, properties = {}) => {
    if (analyticsRef.current) {
      analyticsRef.current.track(eventName, properties);
    }
  };

  const trackGameClick = (gameId, gameName) => {
    if (analyticsRef.current) {
      analyticsRef.current.trackGameClick(gameId, gameName);
    }
  };

  const trackFormSubmission = (formType, success = true, error = null) => {
    if (analyticsRef.current) {
      analyticsRef.current.trackFormSubmission(formType, success, error);
    }
  };

  const trackCTAClick = (ctaText, ctaLocation) => {
    if (analyticsRef.current) {
      analyticsRef.current.trackCTAClick(ctaText, ctaLocation);
    }
  };

  const trackScrollDepth = (depth) => {
    if (analyticsRef.current) {
      analyticsRef.current.trackScrollDepth(depth);
    }
  };

  return {
    trackEvent,
    trackGameClick,
    trackFormSubmission,
    trackCTAClick,
    trackScrollDepth
  };
};
