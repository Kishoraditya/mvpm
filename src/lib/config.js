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
        // New: allow developers to opt-out analytics on their own device via .env.local
        selfOptOut: process.env.NEXT_PUBLIC_ANALYTICS_OPT_OUT === 'true',
        // New: allow remote (PostHog) feature flags; env can disable this entirely
        enableRemoteFlags: process.env.NEXT_PUBLIC_ENABLE_REMOTE_FLAGS !== 'false',
        // New: Feature flags with safe defaults; can be overridden via NEXT_PUBLIC_FLAG_*
        flags: {
          games: {
            stakeholder_sandwich: true,
            sprint_simulator: true,
            assumption_sniper: true,
            chart_in_10: true,
          },
          ui: {
            socialShare: true,
            faq: true,
          },
        },
      }
    };
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  }

  // Map dotted key to PostHog feature flag key
  // Example: games.stakeholder_sandwich -> mvpm_games_stakeholder_sandwich
  //          ui.socialShare -> mvpm_ui_socialshare
  mapToPosthogKey(key) {
    return 'mvpm_' + key.replaceAll('.', '_').replaceAll(/([A-Z])/g, (m) => m.toLowerCase());
  }

  // Resolve feature flags with precedence: env > posthog > defaults > fallback(false)
  // Key is a dotted path under features.flags, e.g. "games.stakeholder_sandwich" or "ui.socialShare".
  // Env override format: NEXT_PUBLIC_FLAG_GAMES_STAKEHOLDER_SANDWICH=true
  getFeatureFlag(key, fallback = undefined) {
    // 1) Env override (highest precedence)
    const envKey = 'NEXT_PUBLIC_FLAG_' + key.replaceAll('.', '_').toUpperCase();
    const envVal = process.env[envKey];
    if (envVal === 'true') return true;
    if (envVal === 'false') return false;

    // 2) PostHog (if enabled and available on client and not opted-out)
    try {
      if (typeof window !== 'undefined' && this.get('features.enableRemoteFlags')) {
        const selfOptOut = !!this.get('features.selfOptOut');
        const localOptOut = (typeof localStorage !== 'undefined' && localStorage.getItem('disable_posthog') === 'true');
        if (!selfOptOut && !localOptOut && window.posthog && typeof window.posthog.isFeatureEnabled === 'function') {
          const phKey = this.mapToPosthogKey(key);
          const phVal = window.posthog.isFeatureEnabled(phKey);
          if (phVal === true) return true;
          if (phVal === false) return false;
          // if undefined, fall through to defaults
        }
      }
    } catch {
      // ignore PostHog errors and fall back
    }

    // 3) Defaults from config
    const valueFromConfig = this.get(`features.flags.${key}`);
    if (typeof valueFromConfig === 'boolean') return valueFromConfig;

    // 4) Fallback if provided, else default to false for safety
    if (typeof fallback === 'boolean') return fallback;
    return false;
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
