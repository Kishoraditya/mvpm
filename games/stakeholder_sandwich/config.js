// Configuration and Environment Variables for Stakeholder Sandwich Game

// Environment configuration - uses same keys as root Next.js project
const ENV_CONFIG = {
    // Analytics - using existing root project keys
    GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    
    // Supabase - using existing root project keys
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    
    // App Configuration - using existing root project keys
    APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'iterate',
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    
    // Feature Flags - using existing root project keys
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false',
    ENABLE_SUPABASE: process.env.NEXT_PUBLIC_ENABLE_SUPABASE !== 'false',
    ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
    
    // Game Configuration
    GAME_TIMER_DURATION: parseInt(process.env.NEXT_PUBLIC_GAME_TIMER_DURATION) || 45,
    MAX_RESPONSE_LENGTH: parseInt(process.env.NEXT_PUBLIC_MAX_RESPONSE_LENGTH) || 500,
    WARNING_THRESHOLD: parseInt(process.env.NEXT_PUBLIC_WARNING_THRESHOLD) || 10,
    
    // API Endpoints
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.mvpm.com',
    SCENARIO_ENDPOINT: process.env.NEXT_PUBLIC_SCENARIO_ENDPOINT || '/api/scenarios',
    ANALYSIS_ENDPOINT: process.env.NEXT_PUBLIC_ANALYSIS_ENDPOINT || '/api/analyze',
    
    // Game-specific Feature Flags (with sensible defaults)
    ENABLE_AI_SCENARIOS: process.env.NEXT_PUBLIC_ENABLE_AI_SCENARIOS === 'true',
    ENABLE_REAL_TIME_ANALYSIS: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_ANALYSIS === 'true',
    ENABLE_SOCIAL_SHARING: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_SHARING !== 'false',
    ENABLE_USER_FEEDBACK: process.env.NEXT_PUBLIC_ENABLE_USER_FEEDBACK !== 'false',
    
    // Development
    DEBUG_MODE: process.env.NODE_ENV === 'development' || ENV_CONFIG?.ENABLE_DEBUG,
    LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info'
};

// Game configuration object
const GAME_CONFIG = {
    timer: {
        duration: ENV_CONFIG.GAME_TIMER_DURATION,
        warningThreshold: ENV_CONFIG.WARNING_THRESHOLD,
        updateInterval: 1000
    },
    response: {
        maxLength: ENV_CONFIG.MAX_RESPONSE_LENGTH,
        warningThreshold: Math.floor(ENV_CONFIG.MAX_RESPONSE_LENGTH * 0.8),
        minWords: 10,
        maxWords: 50
    },
    scoring: {
        baseScore: 7,
        metricBonus: 1,
        alternativeBonus: 1,
        empathyBonus: 0.5,
        brevityBonus: 0.5
    },
    features: {
        aiScenarios: ENV_CONFIG.ENABLE_AI_SCENARIOS,
        realTimeAnalysis: ENV_CONFIG.ENABLE_REAL_TIME_ANALYSIS,
        socialSharing: ENV_CONFIG.ENABLE_SOCIAL_SHARING,
        userFeedback: ENV_CONFIG.ENABLE_USER_FEEDBACK
    }
};

// Analytics configuration
const ANALYTICS_CONFIG = {
    google: {
        measurementId: ENV_CONFIG.GA_MEASUREMENT_ID,
        enabled: !!ENV_CONFIG.GA_MEASUREMENT_ID && ENV_CONFIG.GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX'
    },
    posthog: {
        key: ENV_CONFIG.POSTHOG_KEY,
        host: ENV_CONFIG.POSTHOG_HOST,
        enabled: !!ENV_CONFIG.POSTHOG_KEY && ENV_CONFIG.POSTHOG_KEY !== 'phc_xxxxxxxxxx'
    },
    supabase: {
        url: ENV_CONFIG.SUPABASE_URL,
        anonKey: ENV_CONFIG.SUPABASE_ANON_KEY,
        enabled: !!ENV_CONFIG.SUPABASE_URL && ENV_CONFIG.SUPABASE_URL !== 'https://your-project.supabase.co'
    }
};

// Utility functions
const ConfigUtils = {
    // Get configuration value with fallback
    get(key, fallback = null) {
        return ENV_CONFIG[key] || fallback;
    },
    
    // Check if feature is enabled
    isFeatureEnabled(feature) {
        return GAME_CONFIG.features[feature] || false;
    },
    
    // Get analytics provider status
    getAnalyticsStatus() {
        return {
            google: ANALYTICS_CONFIG.google.enabled,
            posthog: ANALYTICS_CONFIG.posthog.enabled,
            supabase: ANALYTICS_CONFIG.supabase.enabled
        };
    },
    
    // Log configuration (for debugging)
    logConfig() {
        if (ENV_CONFIG.DEBUG_MODE) {
            console.log('Game Configuration:', GAME_CONFIG);
            console.log('Analytics Status:', this.getAnalyticsStatus());
        }
    }
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ENV_CONFIG,
        GAME_CONFIG,
        ANALYTICS_CONFIG,
        ConfigUtils
    };
} else if (typeof window !== 'undefined') {
    window.GameConfig = {
        ENV_CONFIG,
        GAME_CONFIG,
        ANALYTICS_CONFIG,
        ConfigUtils
    };
}