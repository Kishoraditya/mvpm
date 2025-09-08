// Analytics Integration for Stakeholder Sandwich Game

// Import configuration
let ANALYTICS_CONFIG, ConfigUtils;
if (typeof window !== 'undefined' && window.GameConfig) {
    ANALYTICS_CONFIG = window.GameConfig.ANALYTICS_CONFIG;
    ConfigUtils = window.GameConfig.ConfigUtils;
} else if (typeof require !== 'undefined') {
    const config = require('./config.js');
    ANALYTICS_CONFIG = config.ANALYTICS_CONFIG;
    ConfigUtils = config.ConfigUtils;
}

// Analytics Manager Class
class GameAnalytics {
    constructor() {
        this.initialized = false;
        this.providers = {
            google: null,
            posthog: null,
            supabase: null
        };
        
        this.init();
    }

    async init() {
        if (this.initialized) return;
        
        try {
            await this.initializeProviders();
            this.initialized = true;
            
            if (ConfigUtils?.get('DEBUG_MODE')) {
                console.log('Analytics initialized:', ConfigUtils.getAnalyticsStatus());
            }
        } catch (error) {
            console.error('Analytics initialization failed:', error);
        }
    }

    async initializeProviders() {
        // Initialize Google Analytics
        if (ANALYTICS_CONFIG?.google?.enabled) {
            await this.initGoogleAnalytics();
        }

        // Initialize PostHog
        if (ANALYTICS_CONFIG?.posthog?.enabled) {
            await this.initPostHog();
        }

        // Initialize Supabase
        if (ANALYTICS_CONFIG?.supabase?.enabled) {
            await this.initSupabase();
        }
    }

    async initGoogleAnalytics() {
        try {
            // Load Google Analytics script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.google.measurementId}`;
            document.head.appendChild(script);

            // Initialize gtag
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            
            gtag('js', new Date());
            gtag('config', ANALYTICS_CONFIG.google.measurementId, {
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
            });

            this.providers.google = gtag;
        } catch (error) {
            console.error('Google Analytics initialization failed:', error);
        }
    }

    async initPostHog() {
        try {
            // Load PostHog script
            const script = document.createElement('script');
            script.innerHTML = `
                !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);var n=t;if("undefined"!=typeof e)try{n=t[e]}catch(t){return}var p=n;if("function"==typeof p)return function(){p.apply(n,arguments)}}var u=e;for(void 0!==a&&(u=e[a]=[]),t="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),o=0;o<t.length;o++)g(u,t[o]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            `;
            document.head.appendChild(script);

            // Initialize PostHog
            window.posthog.init(ANALYTICS_CONFIG.posthog.key, {
                api_host: ANALYTICS_CONFIG.posthog.host,
                capture_pageview: true,
                capture_pageleave: true,
                session_recording: {
                    maskAllInputs: true,
                    maskTextSelector: '.sensitive'
                }
            });

            this.providers.posthog = window.posthog;
        } catch (error) {
            console.error('PostHog initialization failed:', error);
        }
    }

    async initSupabase() {
        try {
            // Load Supabase client
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            document.head.appendChild(script);

            await new Promise((resolve) => {
                script.onload = resolve;
            });

            if (window.supabase) {
                this.providers.supabase = window.supabase.createClient(
                    ANALYTICS_CONFIG.supabase.url,
                    ANALYTICS_CONFIG.supabase.anonKey
                );
            }
        } catch (error) {
            console.error('Supabase initialization failed:', error);
        }
    }

    // Track game events
    trackGameEvent(eventName, properties = {}) {
        const eventData = {
            ...properties,
            timestamp: new Date().toISOString(),
            game_name: 'stakeholder_sandwich',
            user_agent: navigator.userAgent,
            url: window.location.href
        };

        // Google Analytics
        if (this.providers.google) {
            this.providers.google('event', eventName, {
                custom_parameters: eventData
            });
        }

        // PostHog
        if (this.providers.posthog) {
            this.providers.posthog.capture(eventName, eventData);
        }

        // Supabase
        if (this.providers.supabase) {
            this.trackToSupabase(eventName, eventData);
        }
    }

    async trackToSupabase(eventName, eventData) {
        try {
            await this.providers.supabase
                .from('game_interactions')
                .insert({
                    game_id: 'stakeholder_sandwich',
                    event_type: eventName,
                    event_data: eventData,
                    created_at: new Date().toISOString()
                });
        } catch (error) {
            console.error('Supabase tracking failed:', error);
        }
    }

    // Specific game tracking methods
    trackGameStart() {
        this.trackGameEvent('game_started', {
            game_version: '1.0.0'
        });
    }

    trackScenarioGenerated(scenario) {
        this.trackGameEvent('scenario_generated', {
            scenario_title: scenario.title,
            scenario_length: scenario.text.length
        });
    }

    trackTimerUpdate(timeLeft) {
        // Only track at specific intervals to avoid spam
        if (timeLeft % 10 === 0 || timeLeft <= 5) {
            this.trackGameEvent('timer_update', {
                time_remaining: timeLeft
            });
        }
    }

    trackResponseSubmitted(response, timeSpent) {
        this.trackGameEvent('response_submitted', {
            response_length: response.length,
            word_count: response.split(' ').length,
            time_spent: timeSpent,
            completion_rate: ((45 - timeSpent) / 45) * 100
        });
    }

    trackGameCompleted(score, feedback, timeSpent) {
        this.trackGameEvent('game_completed', {
            score: score,
            time_spent: timeSpent,
            feedback_length: feedback.length,
            completion_status: 'completed'
        });
    }

    trackGameSkipped(timeSpent) {
        this.trackGameEvent('game_skipped', {
            time_spent: timeSpent,
            completion_status: 'skipped'
        });
    }

    trackSocialShare(platform) {
        this.trackGameEvent('social_share', {
            platform: platform
        });
    }

    trackUserFeedback(feedback) {
        this.trackGameEvent('user_feedback_submitted', {
            feedback_length: feedback.length,
            feedback_type: 'user_improvement_suggestion'
        });
    }

    trackError(error, context = {}) {
        this.trackGameEvent('game_error', {
            error_message: error.message,
            error_stack: error.stack,
            context: context
        });
    }

    // Page tracking
    trackPageView(page = 'game') {
        this.trackGameEvent('page_view', {
            page: page,
            referrer: document.referrer
        });
    }

    // User engagement tracking
    trackEngagement() {
        let startTime = Date.now();
        let isActive = true;

        // Track time on page
        const trackTimeSpent = () => {
            if (isActive) {
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                this.trackGameEvent('engagement_update', {
                    time_on_page: timeSpent,
                    is_active: isActive
                });
            }
        };

        // Track every 30 seconds
        setInterval(trackTimeSpent, 30000);

        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            isActive = !document.hidden;
            if (!isActive) {
                trackTimeSpent();
            } else {
                startTime = Date.now();
            }
        });

        // Track before unload
        window.addEventListener('beforeunload', trackTimeSpent);
    }
}

// Create global analytics instance
let gameAnalytics;

function initializeAnalytics() {
    if (!gameAnalytics) {
        gameAnalytics = new GameAnalytics();
        
        // Start engagement tracking
        gameAnalytics.trackEngagement();
        
        // Track initial page view
        gameAnalytics.trackPageView();
    }
    return gameAnalytics;
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameAnalytics,
        initializeAnalytics
    };
} else if (typeof window !== 'undefined') {
    window.GameAnalytics = GameAnalytics;
    window.initializeAnalytics = initializeAnalytics;
}