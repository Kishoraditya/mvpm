import appConfig from './config';

class Analytics {
  constructor() {
    this.initialized = false;
    this.providers = {
      ga4: false,
      posthog: false
    };
  }

  async init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Initialize Google Analytics 4
    await this.initGA4();
    
    // Initialize PostHog
    await this.initPostHog();

    this.initialized = true;
    if (appConfig.get('features.enableDebug')) {
      console.log('Analytics initialized:', this.providers);
    }

    // Track page view
    this.pageView();
  }

  async initGA4() {
    if (!appConfig.get('features.enableAnalytics')) return;
    
    const gaId = appConfig.get('analytics.googleAnalyticsId');
    if (!gaId) {
      console.warn('Google Analytics ID not configured');
      return;
    }

    try {
      // Load Google Analytics script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script1);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true, // GDPR compliance
        allow_google_signals: false // Privacy-focused
      });

      this.providers.ga4 = true;
      if (appConfig.get('features.enableDebug')) {
        console.log('Google Analytics 4 initialized');
      }
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  async initPostHog() {
    if (!appConfig.get('features.enableAnalytics')) return;
    
    const posthogKey = appConfig.get('analytics.posthogApiKey');
    const posthogHost = appConfig.get('analytics.posthogHost');
    
    if (!posthogKey) {
      console.warn('PostHog API key not configured');
      return;
    }

    try {
      // Load PostHog script
      await this.loadPostHogScript();

      // Initialize PostHog
      window.posthog.init(posthogKey, {
        api_host: posthogHost,
        autocapture: true,
        capture_pageview: false, // We'll handle this manually
        disable_session_recording: false, // Enable session recordings
        session_recording: {
          maskAllInputs: true, // Privacy: mask all input fields
          maskAllText: false,
          recordCrossOriginIframes: false
        },
        bootstrap: {
          distinctID: this.generateAnonymousId()
        }
      });

      this.providers.posthog = true;
      if (appConfig.get('features.enableDebug')) {
        console.log('PostHog initialized');
      }
    } catch (error) {
      console.error('Failed to initialize PostHog:', error);
    }
  }

  async loadPostHogScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://app.posthog.com/static/array.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  generateAnonymousId() {
    // Generate a consistent anonymous ID for the session
    let id = localStorage.getItem('mvpm_anonymous_id');
    if (!id) {
      id = 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('mvpm_anonymous_id', id);
    }
    return id;
  }

  // Track page views
  pageView(path = null, title = null) {
    if (typeof window === 'undefined') return;
    
    const pagePath = path || window.location.pathname;
    const pageTitle = title || document.title;

    // Google Analytics
    if (this.providers.ga4 && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath
      });
    }

    // PostHog
    if (this.providers.posthog && window.posthog) {
      window.posthog.capture('$pageview', {
        $current_url: window.location.href,
        $pathname: pagePath,
        title: pageTitle
      });
    }
  }

  // Track custom events
  track(eventName, properties = {}) {
    if (typeof window === 'undefined') return;
    
    const eventData = {
      ...properties,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      user_agent: navigator.userAgent
    };

    // Google Analytics
    if (this.providers.ga4 && window.gtag) {
      window.gtag('event', eventName, eventData);
    }

    // PostHog
    if (this.providers.posthog && window.posthog) {
      window.posthog.capture(eventName, eventData);
    }

    if (appConfig.get('features.enableDebug')) {
      console.log('Analytics event:', eventName, eventData);
    }
  }

  // Track game interactions
  trackGameClick(gameId, gameName) {
    this.track('game_click', {
      game_id: gameId,
      game_name: gameName,
      section: 'games_grid'
    });
  }

  // Track form submissions
  trackFormSubmission(formType, success = true, error = null) {
    this.track('form_submission', {
      form_type: formType,
      success: success,
      error: error
    });
  }

  // Track CTA clicks
  trackCTAClick(ctaText, ctaLocation) {
    this.track('cta_click', {
      cta_text: ctaText,
      cta_location: ctaLocation
    });
  }

  // Track scroll depth
  trackScrollDepth(depth) {
    this.track('scroll_depth', {
      depth_percentage: depth,
      page_height: document.body.scrollHeight,
      viewport_height: window.innerHeight
    });
  }

  // Track time on page
  trackTimeOnPage() {
    if (typeof window === 'undefined') return;
    
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      this.track('time_on_page', {
        seconds: timeSpent,
        minutes: Math.round(timeSpent / 60)
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }

  // Set user properties
  setUserProperties(properties) {
    if (typeof window === 'undefined') return;
    
    // PostHog
    if (this.providers.posthog && window.posthog) {
      window.posthog.people.set(properties);
    }

    // Google Analytics (using custom dimensions if configured)
    if (this.providers.ga4 && window.gtag) {
      window.gtag('config', appConfig.get('analytics.googleAnalyticsId'), {
        custom_map: properties
      });
    }
  }

  // Identify user (when they sign up)
  identify(userId, traits = {}) {
    if (typeof window === 'undefined') return;
    
    // PostHog
    if (this.providers.posthog && window.posthog) {
      window.posthog.identify(userId, traits);
    }

    // Google Analytics
    if (this.providers.ga4 && window.gtag) {
      window.gtag('config', appConfig.get('analytics.googleAnalyticsId'), {
        user_id: userId
      });
    }
  }
}

// Create singleton instance
let analyticsInstance = null;

export const getAnalytics = () => {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics();
  }
  return analyticsInstance;
};

export default getAnalytics;
