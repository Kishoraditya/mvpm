// Configuration management for Next.js environment
class AppConfig {
  constructor() {
    this.config = {
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
      analytics: {
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        posthogApiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      },
      app: {
        env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
        name: process.env.NEXT_PUBLIC_APP_NAME || 'iterate',
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      features: {
        enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
        enableSupabase: process.env.NEXT_PUBLIC_ENABLE_SUPABASE === 'true',
        enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
      }
    };
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  }

  isDevelopment() {
    return this.config.app.env === 'development';
  }

  isProduction() {
    return this.config.app.env === 'production';
  }

  getAll() {
    return this.config;
  }
}

// Create singleton instance
const appConfig = new AppConfig();

export default appConfig;
