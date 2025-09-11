'use client';

import { useEffect, useState } from 'react';
import appConfig from '@/lib/config';
import getAnalytics from '@/lib/analytics';

/**
 * useFeatureFlag
 * - Reads feature flag values using central resolver with precedence: env > posthog > defaults
 * - Subscribes to PostHog feature flag updates when available to keep UI in sync
 * - Optionally tracks evaluations to Analytics (sampled)
 *
 * @param {string} key - Dotted key under features.flags (e.g., 'games.stakeholder_sandwich', 'ui.socialShare')
 * @param {boolean} defaultValue - Default value if not set; defaults to false when omitted
 * @param {{ track?: boolean }} options - Optional settings
 * @returns {boolean}
 */
export function useFeatureFlag(key, defaultValue = false, options = {}) {
  // Initial value from central resolver (env > posthog > defaults)
  const [value, setValue] = useState(() => appConfig.getFeatureFlag(key, defaultValue));

  useEffect(() => {
    // Evaluate immediately (covers cases where analytics initialized after first render)
    const v = appConfig.getFeatureFlag(key, defaultValue);
    setValue(v);

    // Subscribe to PostHog feature flag updates if available and remote flags enabled
    let unsub = null;
    try {
      if (typeof window !== 'undefined' && appConfig.get('features.enableRemoteFlags')) {
        const ph = window.posthog;
        if (ph && typeof ph.onFeatureFlags === 'function') {
          unsub = ph.onFeatureFlags(() => {
            // Re-resolve through central resolver (env has priority)
            const updated = appConfig.getFeatureFlag(key, defaultValue);
            setValue(updated);
          });
        }
      }
    } catch {
      // ignore
    }

    if (options.track && typeof window !== 'undefined') {
      try {
        // lightweight sampling: ~10%
        if (Math.random() < 0.1) {
          const analytics = getAnalytics();
          analytics.track('feature_flag_evaluated', {
            flag_key: key,
            flag_value: v,
            source: 'useFeatureFlag',
          });
        }
      } catch {
        // no-op
      }
    }

    return () => {
      if (typeof unsub === 'function') {
        try { unsub(); } catch {}
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

export default useFeatureFlag;
