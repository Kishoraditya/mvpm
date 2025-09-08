'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeckPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/slides');
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #667eea 50%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Redirecting to Slides...
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Taking you to the presentation deck
        </p>
      </div>
    </div>
  );
}
