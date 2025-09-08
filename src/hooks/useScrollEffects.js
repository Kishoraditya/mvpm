'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const useScrollEffects = () => {
  const [scrollY, setScrollY] = useState(0);
  const maxScrollDepth = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
      
      // Track scroll depth
      const scrollTop = window.pageYOffset;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScrollDepth.current && scrollPercent % 25 === 0) {
        maxScrollDepth.current = scrollPercent;
        // Emit scroll depth event
        window.dispatchEvent(new CustomEvent('scrollDepth', { detail: scrollPercent }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY };
};

export const useParallax = (speed = 0.3) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};

export const useInViewAnimation = (options = {}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true,
    ...options
  });

  return { ref, inView };
};

export const useTypingAnimation = (text, speed = 30, delay = 1000) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    setDisplayText('');
    setIsComplete(false);

    const timer = setTimeout(() => {
      let i = 0;
      const typeTimer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeTimer);
          setIsComplete(true);
        }
      }, speed);

      return () => clearInterval(typeTimer);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay]);

  return { displayText, isComplete };
};
