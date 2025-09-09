'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getAnalytics } from '@/lib/analytics';

export const useAnalytics = () => {
  const analyticsRef = useRef(null);
  const initialized = useRef(false);
  const eventQueue = useRef(new Map());
  const lastEventTime = useRef(new Map());

  useEffect(() => {
    if (!initialized.current) {
      analyticsRef.current = getAnalytics();
      analyticsRef.current.init();
      initialized.current = true;
    }
  }, []);

  // Throttle function to prevent rapid-fire events
  const throttle = useCallback((key, fn, delay = 1000) => {
    const now = Date.now();
    const lastTime = lastEventTime.current.get(key) || 0;
    
    if (now - lastTime >= delay) {
      lastEventTime.current.set(key, now);
      fn();
    }
  }, []);

  // Debounce function for events that might fire multiple times
  const debounce = useCallback((key, fn, delay = 500) => {
    if (eventQueue.current.has(key)) {
      clearTimeout(eventQueue.current.get(key));
    }
    
    const timeoutId = setTimeout(() => {
      fn();
      eventQueue.current.delete(key);
    }, delay);
    
    eventQueue.current.set(key, timeoutId);
  }, []);

  const trackEvent = useCallback((eventName, properties = {}) => {
    if (!analyticsRef.current) return;
    
    const eventKey = `${eventName}_${JSON.stringify(properties)}`;
    
    // Throttle similar events to prevent spam
    throttle(eventKey, () => {
      analyticsRef.current.track(eventName, properties);
    }, 2000); // 2 second throttle
  }, [throttle]);

  const trackGameClick = useCallback((gameId, gameName) => {
    if (!analyticsRef.current) return;
    
    const eventKey = `game_click_${gameId}`;
    throttle(eventKey, () => {
      analyticsRef.current.trackGameClick(gameId, gameName);
    }, 1000);
  }, [throttle]);

  const trackFormSubmission = useCallback((formType, success = true, error = null) => {
    if (!analyticsRef.current) return;
    
    // Don't throttle form submissions as they're important
    analyticsRef.current.trackFormSubmission(formType, success, error);
  }, []);

  const trackCTAClick = useCallback((ctaText, ctaLocation) => {
    if (!analyticsRef.current) return;
    
    const eventKey = `cta_click_${ctaText}_${ctaLocation}`;
    throttle(eventKey, () => {
      analyticsRef.current.trackCTAClick(ctaText, ctaLocation);
    }, 1000);
  }, [throttle]);

  const trackScrollDepth = useCallback((depth) => {
    if (!analyticsRef.current) return;
    
    // Debounce scroll events as they fire rapidly
    debounce('scroll_depth', () => {
      analyticsRef.current.trackScrollDepth(depth);
    }, 1000);
  }, [debounce]);

  return {
    trackEvent,
    trackGameClick,
    trackFormSubmission,
    trackCTAClick,
    trackScrollDepth
  };
};
