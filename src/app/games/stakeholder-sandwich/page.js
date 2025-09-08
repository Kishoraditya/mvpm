'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackGameInteraction } from '@/lib/supabase';
import Link from 'next/link';
import './stakeholder-sandwich.css';

export default function StakeholderSandwichPage() {
  const [gameState, setGameState] = useState('loading'); // loading, playing, results
  const [timeLeft, setTimeLeft] = useState(45);
  const [scenario, setScenario] = useState(null);
  const [userResponse, setUserResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [userFeedback, setUserFeedback] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const timerRef = useRef(null);
  const { trackEvent } = useAnalytics();

  const scenarios = [
    {
      title: "The Impossible Trinity",
      text: "Sales needs the enterprise feature shipped yesterday, Engineering says it needs 6 more weeks for security review, and your CEO just promised it to our biggest prospect in the board meeting. The prospect represents 40% revenue growth but won't wait past Friday. Your move."
    },
    {
      title: "Feature Frankenstein",
      text: "Marketing wants A/B test results (which show 23% lower conversion), Design insists the new checkout flow improves UX (but increases steps from 2 to 4), and Finance demands we ship because we spent $200K on the redesign. Launch is tomorrow."
    },
    {
      title: "The Data Dilemma",
      text: "Legal says our new AI recommendation engine violates GDPR if we use purchase history, but without it, accuracy drops from 89% to 34%. Compliance audit is next week, and this feature drives 60% of our Q4 revenue target."
    },
    {
      title: "Resource Roulette",
      text: "Your top engineer just quit mid-sprint, QA found 23 critical bugs, launch is scheduled for Monday, and the client threatens to sue if we delay. Meanwhile, customer support is drowning with 400% higher ticket volume from the beta."
    },
    {
      title: "The Metrics Mismatch",
      text: "User engagement is up 45%, but revenue is down 12%. Growth team wants to double down on viral features, Finance wants to focus on monetization, and users are loving the free tier too much. Board meeting is in 3 days."
    }
  ];

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [initializeGame]);

  const initializeGame = useCallback(async () => {
    // Track game start
    trackEvent('game_started', { game_name: 'stakeholder_sandwich' });
    trackGameInteraction('stakeholder_sandwich', 'game_started');

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Select random scenario
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setScenario(randomScenario);
    setGameState('playing');
    startTimer();
  }, [startTimer, trackEvent, trackGameInteraction]);

  const analyzeResponse = useCallback(() => {
    const responses = userResponse.toLowerCase();
    let score = 7;
    let feedbackText = "Strong PM instincts! ";
    
    // Check for metrics
    if (responses.includes('%') || responses.includes('metric') || responses.includes('kpi') || responses.includes('data')) {
      score += 1;
      feedbackText += "Great use of data-driven reasoning. ";
    }
    
    // Check for alternatives
    if (responses.includes('alternative') || responses.includes('option') || responses.includes('instead') || responses.includes('pivot')) {
      score += 1;
      feedbackText += "Excellent strategic thinking with alternatives. ";
    }
    
    // Check for empathy
    if (responses.includes('understand') || responses.includes('team') || responses.includes('concern')) {
      score += 0.5;
      feedbackText += "Good stakeholder empathy. ";
    }
    
    // Length check
    const wordCount = userResponse.split(' ').length;
    if (wordCount >= 10 && wordCount <= 50) {
      score += 0.5;
      feedbackText += "Perfect brevity. ";
    } else if (wordCount > 50) {
      feedbackText += "Consider being more concise - PMs must communicate efficiently. ";
    }
    
    feedbackText += "You're in the top 10% of PMs, but the real challenges haven't even started. Can you maintain this excellence when the stakes are higher?";
    
    setFeedback(feedbackText);
    
    // Track completion
    trackEvent('game_completed', { 
      game_name: 'stakeholder_sandwich',
      time_spent: 45 - timeLeft,
      response_length: userResponse.length,
      score: score
    });
    trackGameInteraction('stakeholder_sandwich', 'game_completed', {
      time_spent: 45 - timeLeft,
      response_length: userResponse.length,
      score: score
    });
  }, [userResponse, timeLeft, trackEvent, trackGameInteraction]);

  const timeUp = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    analyzeResponse();
    setGameState('results');
  }, [analyzeResponse]);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          timeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timeUp]);

  const submitResponse = () => {
    if (!userResponse.trim()) {
      alert('Please provide a response before submitting!');
      return;
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    analyzeResponse();
    setGameState('results');
  };

  const skipChallenge = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setUserResponse("Skipped");
    setFeedback("No worries! Even the best PMs know when to step back and reassess. But remember - the AI revolution won't wait. Ready to try again with a different scenario?");
    setGameState('results');
    
    trackEvent('game_skipped', { game_name: 'stakeholder_sandwich' });
  };

  const restartGame = () => {
    setGameState('loading');
    setTimeLeft(45);
    setUserResponse('');
    setFeedback('');
    setUserFeedback('');
    setCharacterCount(0);
    setScenario(null);
    initializeGame();
  };

  const handleResponseChange = (e) => {
    const value = e.target.value;
    setUserResponse(value);
    setCharacterCount(value.length);
  };

  const submitUserFeedback = () => {
    if (userFeedback.trim()) {
      trackEvent('user_feedback_submitted', { 
        game_name: 'stakeholder_sandwich',
        feedback: userFeedback 
      });
      trackGameInteraction('stakeholder_sandwich', 'feedback_submitted', {
        feedback: userFeedback
      });
      alert('Thanks for helping us improve! Your feedback shapes our AI.');
      setUserFeedback('');
    }
  };

  const setupSocialSharing = () => {
    const timeSpent = 45 - timeLeft;
    const shareText = `Just crushed a Stakeholder Sandwich in ${timeSpent}s! Think you can handle impossible PM scenarios better? Try the MVPM challenge`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    
    return {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareText)}`
    };
  };

  const socialLinks = setupSocialSharing();

  return (
    <>
      <header className="game-header-nav">
        <nav>
          <Link href="/" className="logo">iterate</Link>
          <Link href="/" className="back-home">← Back to Home</Link>
        </nav>
      </header>

      <div className="game-container">
        <div className="game-header">
          <h1 className="game-title">Stakeholder Sandwich</h1>
          <p className="game-subtitle">45 seconds. One impossible request. Your reputation on the line.</p>
          <span className="brutal-timer">BRUTAL 45s</span>
        </div>

        {/* Loading State */}
        {gameState === 'loading' && (
          <div className="game-state active">
            <div className="loading-spinner"></div>
            <p className="loading-text">Generating your nightmare scenario...</p>
          </div>
        )}

        {/* Game State */}
        {gameState === 'playing' && scenario && (
          <div className="game-state active">
            <div className="scenario-box">
              <h3 className="scenario-title">🔥 Your Challenge</h3>
              <div className="scenario-text">{scenario.text}</div>
            </div>

            <div className="timer-display">
              <div className={`timer-circle ${timeLeft <= 10 ? 'warning' : ''}`}>
                {timeLeft}
              </div>
              <p className="timer-text">seconds remaining</p>
            </div>

            <div className="response-area">
              <label className="response-label">
                Draft your response (1-2 sentences, include a metric or alternative):
              </label>
              <textarea 
                className="response-input" 
                placeholder="Your response here... Remember: clarity, strategy, empathy, evidence, brevity."
                maxLength="500"
                value={userResponse}
                onChange={handleResponseChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    submitResponse();
                  }
                }}
              />
              <div className={`character-count ${characterCount > 400 ? 'warning' : ''}`}>
                {characterCount}/500 characters
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={submitResponse} className="btn btn-primary">
                Submit Response
              </button>
              <button onClick={skipChallenge} className="btn btn-secondary">
                Skip Challenge
              </button>
            </div>
          </div>
        )}

        {/* Results State */}
        {gameState === 'results' && (
          <div className="game-state active">
            <div className="results-content">
              <div className="performance-badge">
                🎯 Top 10% Performance
              </div>

              <div className="feedback-section">
                <h3 className="feedback-title">AI Analysis</h3>
                <div className="feedback-text">{feedback}</div>
              </div>

              <div className="social-share">
                <h3 className="social-title">🚀 Share Your MVPM Moment</h3>
                <div className="social-buttons">
                  <a href={socialLinks.linkedin} className="social-btn linkedin" target="_blank" rel="noopener noreferrer">
                    <span>📊</span> LinkedIn
                  </a>
                  <a href={socialLinks.twitter} className="social-btn twitter" target="_blank" rel="noopener noreferrer">
                    <span>🐦</span> Twitter
                  </a>
                  <a href={socialLinks.reddit} className="social-btn reddit" target="_blank" rel="noopener noreferrer">
                    <span>🤖</span> Reddit
                  </a>
                </div>
              </div>

              <div className="next-steps">
                <h3>🔥 This is just the beginning...</h3>
                <p>Think that was tough? The AI revolution demands cognitive excellence. Can you survive without cognitive atrophy? Help our AI improve by sharing feedback and conquering more challenges.</p>
                
                <div className="cta-grid">
                  <button onClick={restartGame} className="btn btn-primary">Play Again</button>
                  <Link href="/#signup" className="btn btn-secondary">Join Waitlist</Link>
                  <Link href="/#coming-soon" className="btn btn-secondary">Enterprise Arsenal</Link>
                  <Link href="/" className="btn btn-secondary">More Games</Link>
                </div>
              </div>

              {/* Feedback Form */}
              <div className="feedback-section">
                <h3 className="feedback-title">Help Us Improve</h3>
                <textarea 
                  className="response-input" 
                  placeholder="How was the challenge? Any suggestions for improvement? We're just starting out and your input shapes our AI..."
                  style={{minHeight: '80px'}}
                  value={userFeedback}
                  onChange={(e) => setUserFeedback(e.target.value)}
                />
                <div style={{textAlign: 'center', marginTop: '1rem'}}>
                  <button onClick={submitUserFeedback} className="btn btn-primary">
                    Send Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}