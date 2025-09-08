'use client';

import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { addToWaitlist } from '@/lib/supabase';

const EmailForm = ({ source = 'landing_page', className = '' }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { trackFormSubmission, trackEvent } = useAnalytics();

  const validateEmail = (email) => {
    return email && email.includes('@') && email.includes('.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      trackFormSubmission('waitlist', false, 'invalid_email');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await addToWaitlist(email, source);
      
      if (result.success) {
        setMessage('🚀 ' + (result.message || 'Thanks! You\'ll be first to know when we launch enterprise features.'));
        setEmail('');
        
        // Track successful signup
        trackFormSubmission('waitlist', true);
        trackEvent('waitlist_signup_success', { 
          email_domain: email.split('@')[1],
          source 
        });
      } else {
        throw new Error(result.error || 'Failed to add to waitlist');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Sorry, there was an issue adding you to the waitlist. Please try again.');
      
      // Track failed signup
      trackFormSubmission('waitlist', false, error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`signup-form ${className}`}>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          className="email-input"
          placeholder="your.email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          className="cta-button"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.7 : 1,
            pointerEvents: isLoading ? 'none' : 'auto'
          }}
        >
          {isLoading ? 'Adding...' : 'Get Early Access'}
        </button>
      </form>
      {message && (
        <p className={`form-message ${message.includes('🚀') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default EmailForm;
