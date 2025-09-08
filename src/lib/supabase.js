import { createClient } from '@supabase/supabase-js';
import appConfig from './config';

// Create Supabase client
let supabaseClient = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = appConfig.get('supabase.url');
    const supabaseKey = appConfig.get('supabase.anonKey');

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase configuration missing. Some features may not work.');
      return null;
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  return supabaseClient;
};

// Email signup for waitlist
export const addToWaitlist = async (email, source = 'landing_page') => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Service not available' };
  }

  try {
    const { data, error } = await client
      .from('waitlist')
      .insert([
        {
          email: email,
          source: source,
          created_at: new Date().toISOString(),
          metadata: {
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            referrer: typeof document !== 'undefined' ? document.referrer : 'unknown',
            timestamp: Date.now()
          }
        }
      ])
      .select();

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') {
        return { success: true, message: 'You\'re already on our waitlist!' };
      }
      throw error;
    }

    return { success: true, data, message: 'Successfully added to waitlist!' };
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return { success: false, error: error.message };
  }
};

// Track game interactions
export const trackGameInteraction = async (gameId, action, metadata = {}) => {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const { error } = await client
      .from('game_interactions')
      .insert([
        {
          game_id: gameId,
          action: action,
          metadata: {
            ...metadata,
            timestamp: Date.now(),
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            page_url: typeof window !== 'undefined' ? window.location.href : 'unknown'
          },
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Failed to track game interaction:', error);
    }
  } catch (error) {
    console.error('Game tracking error:', error);
  }
};

// Get user session (for future authentication features)
export const getSession = async () => {
  const client = getSupabaseClient();
  if (!client) return null;
  
  try {
    const { data: { session } } = await client.auth.getSession();
    return session;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
};

// Sign up user (for future features)
export const signUp = async (email, password, metadata = {}) => {
  const client = getSupabaseClient();
  if (!client) return { success: false, error: 'Service not available' };

  try {
    const { data, error } = await client.auth.signUp({
      email: email,
      password: password,
      options: {
        data: metadata
      }
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: error.message };
  }
};

const supabaseUtils = {
  getSupabaseClient,
  addToWaitlist,
  trackGameInteraction,
  getSession,
  signUp
};

export default supabaseUtils;
