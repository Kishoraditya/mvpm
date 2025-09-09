'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackGameInteraction } from '@/lib/supabase';
import Link from 'next/link';
import './chart-in-10.css';

// Chart scenarios with different business contexts
const CHART_SCENARIOS = [
  {
    id: 1,
    title: "Q3 User Acquisition Funnel",
    chartType: "funnel",
    description: "Marketing spend vs conversion rates across channels",
    chartData: {
      labels: ["Paid Social", "Google Ads", "Organic", "Referral", "Email"],
      spend: [45000, 62000, 0, 8000, 12000],
      conversions: [1200, 1850, 890, 340, 280],
      costs: [37.5, 33.5, 0, 23.5, 42.9]
    },
    context: "Your CMO wants to double down on the highest performing channel for Q4.",
    correctAnswer: "google_ads",
    explanation: "Google Ads has the best cost per conversion ($33.5) with high volume (1850 conversions). While Referral has lower cost ($23.5), the volume is too low to scale effectively.",
    options: [
      { id: "paid_social", text: "Paid Social - Highest spend shows confidence", points: 0 },
      { id: "google_ads", text: "Google Ads - Best cost/conversion ratio at scale", points: 2 },
      { id: "organic", text: "Organic - Free traffic is always best", points: 0 },
      { id: "referral", text: "Referral - Lowest cost per conversion", points: 1 }
    ]
  },
  {
    id: 2,
    title: "Feature Adoption Cohort Analysis",
    chartType: "cohort",
    description: "New feature usage over 8 weeks post-launch",
    chartData: {
      weeks: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
      adoption: [23, 31, 28, 19, 15, 12, 8, 6],
      retention: [100, 67, 45, 32, 28, 25, 23, 22]
    },
    context: "Engineering wants to know if they should invest more time in this feature.",
    correctAnswer: "pause_investment",
    explanation: "Classic adoption cliff after Week 2 with poor retention (22% by Week 8). The feature isn't sticky enough to justify continued investment without major UX improvements.",
    options: [
      { id: "double_down", text: "Double down - Early adoption shows promise", points: 0 },
      { id: "pause_investment", text: "Pause investment - Poor retention signals", points: 2 },
      { id: "minor_tweaks", text: "Make minor UX tweaks and monitor", points: 1 },
      { id: "sunset_feature", text: "Sunset the feature immediately", points: 0 }
    ]
  },
  {
    id: 3,
    title: "Revenue Impact by Customer Segment",
    chartType: "segment",
    description: "ARR growth and churn by customer size",
    chartData: {
      segments: ["Enterprise", "Mid-Market", "SMB", "Startup"],
      arr_growth: [145, 89, 34, -12],
      churn_rate: [3, 8, 18, 35],
      customer_count: [23, 156, 890, 2340]
    },
    context: "Sales wants to shift focus to the most profitable segment for next quarter.",
    correctAnswer: "mid_market",
    explanation: "Mid-Market offers the best balance: strong ARR growth (89%), manageable churn (8%), and scalable volume (156 customers). Enterprise has higher growth but limited scale.",
    options: [
      { id: "enterprise", text: "Enterprise - Highest ARR growth", points: 1 },
      { id: "mid_market", text: "Mid-Market - Best growth/churn/scale balance", points: 2 },
      { id: "smb", text: "SMB - Largest customer base", points: 0 },
      { id: "startup", text: "Startup - Untapped potential", points: 0 }
    ]
  },
  {
    id: 4,
    title: "Product Performance Dashboard",
    chartType: "performance",
    description: "Key metrics across product lines",
    chartData: {
      products: ["Core Platform", "Analytics Add-on", "Mobile App", "API Service"],
      revenue: [2.3, 0.8, 0.4, 1.1],
      growth_rate: [12, 45, -8, 67],
      margin: [78, 92, 34, 85]
    },
    context: "The board wants to know which product line to prioritize for investment.",
    correctAnswer: "api_service",
    explanation: "API Service shows explosive growth (67%) with excellent margins (85%) and solid revenue base ($1.1M). This combination suggests strong market fit and scalability.",
    options: [
      { id: "core_platform", text: "Core Platform - Highest revenue base", points: 1 },
      { id: "analytics", text: "Analytics Add-on - Best margins", points: 0 },
      { id: "mobile_app", text: "Mobile App - Needs turnaround focus", points: 0 },
      { id: "api_service", text: "API Service - High growth + margins", points: 2 }
    ]
  },
  {
    id: 5,
    title: "Customer Support Ticket Analysis",
    chartType: "support",
    description: "Ticket volume and resolution trends",
    chartData: {
      categories: ["Bug Reports", "Feature Requests", "Account Issues", "Integration Help"],
      volume: [340, 180, 95, 220],
      avg_resolution: [2.3, 8.7, 0.8, 4.2],
      satisfaction: [6.2, 8.9, 9.1, 7.8]
    },
    context: "Support team is overwhelmed. Which area needs immediate PM attention?",
    correctAnswer: "bug_reports",
    explanation: "Bug Reports have highest volume (340) with lowest satisfaction (6.2). This indicates systemic quality issues that require immediate PM intervention to prevent churn.",
    options: [
      { id: "bug_reports", text: "Bug Reports - High volume, low satisfaction", points: 2 },
      { id: "feature_requests", text: "Feature Requests - Longest resolution time", points: 1 },
      { id: "account_issues", text: "Account Issues - Highest satisfaction", points: 0 },
      { id: "integration", text: "Integration Help - Balanced metrics", points: 0 }
    ]
  }
];

export default function ChartIn10Page() {
  const [gameState, setGameState] = useState('loading'); // loading, ready, playing, results
  const [currentScenario, setCurrentScenario] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [gameResults, setGameResults] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const timerRef = useRef(null);
  const { trackEvent } = useAnalytics();

  // Initialize game
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState('ready');
    }, 1500);

    trackEvent('game_loaded', { game: 'chart-in-10' });
    trackGameInteraction('chart-in-10', 'game_loaded');

    return () => clearTimeout(timer);
  }, [trackEvent]);

  const startGame = useCallback(() => {
    const randomScenario = CHART_SCENARIOS[Math.floor(Math.random() * CHART_SCENARIOS.length)];
    setCurrentScenario(randomScenario);
    setGameState('playing');
    setTimeLeft(10);
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    trackEvent('game_started', { game: 'chart-in-10', scenario: randomScenario.id });
    trackGameInteraction('chart-in-10', 'game_started', { scenario_id: randomScenario.id });
  }, [trackEvent]);

  // Handle timer separately to avoid circular dependency
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Handle time up directly here to avoid circular dependency
            if (selectedAnswer) {
              // Will trigger handleAnswerSubmit via useEffect
              setGameState('submitting');
            } else {
              setGameResults({
                score: 0,
                scenario: currentScenario,
                selectedAnswer: null,
                timeUp: true
              });
              setGameState('results');
              trackEvent('game_timeout', { game: 'chart-in-10', scenario: currentScenario?.id });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, timeLeft, selectedAnswer, currentScenario, trackEvent]);

  // Handle submission when state changes to submitting
  useEffect(() => {
    if (gameState === 'submitting' && selectedAnswer && currentScenario) {
      handleAnswerSubmit();
    }
  }, [gameState, selectedAnswer, currentScenario, handleAnswerSubmit]);

  const handleAnswerSelect = useCallback((answerId) => {
    if (gameState !== 'playing' || timeLeft === 0) return;
    setSelectedAnswer(answerId);
  }, [gameState, timeLeft]);

  const handleAnswerSubmit = useCallback(() => {
    if (!selectedAnswer || !currentScenario) return;

    clearInterval(timerRef.current);
    
    const selectedOption = currentScenario.options.find(opt => opt.id === selectedAnswer);
    const earnedScore = selectedOption?.points || 0;
    const timeBonus = timeLeft > 5 ? 1 : 0; // Bonus point for quick decisions
    const totalScore = earnedScore + timeBonus;

    setScore(totalScore);
    setGameResults({
      score: totalScore,
      scenario: currentScenario,
      selectedAnswer: selectedAnswer,
      selectedOption: selectedOption,
      timeBonus: timeBonus,
      timeUsed: 10 - timeLeft
    });
    
    setGameState('results');
    setShowExplanation(true);

    trackEvent('game_completed', { 
      game: 'chart-in-10', 
      scenario: currentScenario.id,
      score: totalScore,
      answer: selectedAnswer,
      time_used: 10 - timeLeft
    });
    
    trackGameInteraction('chart-in-10', 'game_completed', {
      scenario_id: currentScenario.id,
      score: totalScore,
      answer: selectedAnswer,
      time_used: 10 - timeLeft
    });
  }, [selectedAnswer, currentScenario, timeLeft, trackEvent]);

  const resetGame = useCallback(() => {
    setGameState('ready');
    setCurrentScenario(null);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setScore(0);
    setGameResults(null);
    setShowExplanation(false);
    clearInterval(timerRef.current);
  }, []);

  const shareScore = useCallback((platform) => {
    const shareText = `I just analyzed a business chart in ${10 - (gameResults?.timeUsed || 0)} seconds and scored ${score}/3 points on Chart-in-10! 📊 Think you can beat my PM instincts?`;
    const shareUrl = 'https://mvpm.app/games/chart-in-10';
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`
    };

    window.open(urls[platform], '_blank');
    trackEvent('score_shared', { game: 'chart-in-10', platform, score });
  }, [score, gameResults, trackEvent]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const renderChart = () => {
    if (!currentScenario) return null;

    const { chartData, chartType } = currentScenario;

    switch (chartType) {
      case 'funnel':
        return (
          <div className="chart-container funnel-chart">
            <div className="chart-bars">
              {chartData.labels.map((label, index) => (
                <div key={label} className="funnel-bar">
                  <div className="bar-label">{label}</div>
                  <div className="bar-metrics">
                    <div className="metric">
                      <span className="metric-label">Spend:</span>
                      <span className="metric-value">${chartData.spend[index].toLocaleString()}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Conversions:</span>
                      <span className="metric-value">{chartData.conversions[index]}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Cost/Conv:</span>
                      <span className="metric-value">${chartData.costs[index]}</span>
                    </div>
                  </div>
                  <div 
                    className="bar-visual"
                    style={{ width: `${(chartData.conversions[index] / Math.max(...chartData.conversions)) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'cohort':
        return (
          <div className="chart-container cohort-chart">
            <div className="cohort-metrics">
              <div className="metric-row">
                <span className="metric-title">Weekly Adoption:</span>
                <div className="metric-bars">
                  {chartData.adoption.map((value, index) => (
                    <div key={index} className="cohort-bar">
                      <div className="bar-value">{value}%</div>
                      <div 
                        className="bar-visual adoption"
                        style={{ height: `${(value / Math.max(...chartData.adoption)) * 60}px` }}
                      />
                      <div className="bar-label">{chartData.weeks[index]}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="metric-row">
                <span className="metric-title">Retention Rate:</span>
                <div className="metric-bars">
                  {chartData.retention.map((value, index) => (
                    <div key={index} className="cohort-bar">
                      <div className="bar-value">{value}%</div>
                      <div 
                        className="bar-visual retention"
                        style={{ height: `${value * 0.6}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'segment':
        return (
          <div className="chart-container segment-chart">
            <div className="segment-grid">
              {chartData.segments.map((segment, index) => (
                <div key={segment} className="segment-card">
                  <div className="segment-name">{segment}</div>
                  <div className="segment-metrics">
                    <div className="metric">
                      <span className="label">ARR Growth:</span>
                      <span className={`value ${chartData.arr_growth[index] > 0 ? 'positive' : 'negative'}`}>
                        {chartData.arr_growth[index] > 0 ? '+' : ''}{chartData.arr_growth[index]}%
                      </span>
                    </div>
                    <div className="metric">
                      <span className="label">Churn:</span>
                      <span className="value">{chartData.churn_rate[index]}%</span>
                    </div>
                    <div className="metric">
                      <span className="label">Customers:</span>
                      <span className="value">{chartData.customer_count[index]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="chart-container performance-chart">
            <div className="performance-grid">
              {chartData.products.map((product, index) => (
                <div key={product} className="performance-card">
                  <div className="product-name">{product}</div>
                  <div className="performance-metrics">
                    <div className="metric">
                      <span className="label">Revenue:</span>
                      <span className="value">${chartData.revenue[index]}M</span>
                    </div>
                    <div className="metric">
                      <span className="label">Growth:</span>
                      <span className={`value ${chartData.growth_rate[index] > 0 ? 'positive' : 'negative'}`}>
                        {chartData.growth_rate[index] > 0 ? '+' : ''}{chartData.growth_rate[index]}%
                      </span>
                    </div>
                    <div className="metric">
                      <span className="label">Margin:</span>
                      <span className="value">{chartData.margin[index]}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="chart-container support-chart">
            <div className="support-metrics">
              {chartData.categories.map((category, index) => (
                <div key={category} className="support-row">
                  <div className="category-name">{category}</div>
                  <div className="category-metrics">
                    <div className="metric">
                      <span className="label">Volume:</span>
                      <span className="value">{chartData.volume[index]}</span>
                      <div 
                        className="bar volume-bar"
                        style={{ width: `${(chartData.volume[index] / Math.max(...chartData.volume)) * 100}%` }}
                      />
                    </div>
                    <div className="metric">
                      <span className="label">Avg Resolution:</span>
                      <span className="value">{chartData.avg_resolution[index]}d</span>
                    </div>
                    <div className="metric">
                      <span className="label">Satisfaction:</span>
                      <span className={`value ${chartData.satisfaction[index] >= 8 ? 'high' : chartData.satisfaction[index] >= 7 ? 'medium' : 'low'}`}>
                        {chartData.satisfaction[index]}/10
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="chart-in-10-game">
      <div className="game-header">
        <Link href="/" className="back-link">← Back to Games</Link>
        <h1>Chart-in-10</h1>
        <p className="game-subtitle">10 seconds to read a chart. Keep or kill? Your call could make or break the quarter.</p>
      </div>

      {gameState === 'loading' && (
        <div className="game-state loading-state">
          <div className="loading-spinner"></div>
          <h2>Loading Chart Analysis Engine...</h2>
          <p>Preparing business intelligence scenarios</p>
        </div>
      )}

      {gameState === 'ready' && (
        <div className="game-state ready-state">
          <div className="ready-content">
            <h2>Ready to Analyze?</h2>
            <p>You'll see a business chart with context. You have <strong>10 seconds</strong> to make the right call.</p>
            <div className="game-rules">
              <h3>Scoring:</h3>
              <ul>
                <li><strong>2 points:</strong> Perfect analysis</li>
                <li><strong>1 point:</strong> Reasonable but not optimal</li>
                <li><strong>0 points:</strong> Wrong call</li>
                <li><strong>+1 bonus:</strong> Quick decision (5+ seconds left)</li>
              </ul>
            </div>
            <button className="start-button" onClick={startGame}>
              Start Analysis
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && currentScenario && (
        <div className="game-state playing-state">
          <div className="game-timer">
            <div className={`timer-circle ${timeLeft <= 3 ? 'warning' : ''}`}>
              <span className="timer-number">{timeLeft}</span>
            </div>
            <div className="timer-bar">
              <div 
                className="timer-progress"
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="scenario-content">
            <div className="scenario-header">
              <h2>{currentScenario.title}</h2>
              <p className="scenario-description">{currentScenario.description}</p>
            </div>

            {renderChart()}

            <div className="scenario-context">
              <p><strong>Context:</strong> {currentScenario.context}</p>
            </div>

            <div className="answer-options">
              <h3>Your Decision:</h3>
              <div className="options-grid">
                {currentScenario.options.map((option) => (
                  <button
                    key={option.id}
                    className={`option-button ${selectedAnswer === option.id ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(option.id)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              
              {selectedAnswer && (
                <button className="submit-button" onClick={handleAnswerSubmit}>
                  Submit Decision
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {gameState === 'results' && gameResults && (
        <div className="game-state results-state">
          <div className="results-content">
            <div className="score-display">
              <h2>Analysis Complete!</h2>
              <div className="final-score">
                <span className="score-number">{score}</span>
                <span className="score-total">/3</span>
              </div>
              <div className="score-breakdown">
                {gameResults.selectedOption && (
                  <div className="score-item">
                    <span>Decision: {gameResults.selectedOption.points} points</span>
                  </div>
                )}
                {gameResults.timeBonus > 0 && (
                  <div className="score-item bonus">
                    <span>Speed Bonus: +{gameResults.timeBonus} point</span>
                  </div>
                )}
                {gameResults.timeUp && (
                  <div className="score-item penalty">
                    <span>Time's up! No decision made.</span>
                  </div>
                )}
              </div>
            </div>

            {showExplanation && gameResults.scenario && (
              <div className="explanation-section">
                <h3>The Right Call:</h3>
                <p>{gameResults.scenario.explanation}</p>
                
                <div className="scenario-recap">
                  <h4>Your Analysis:</h4>
                  <p><strong>Chart:</strong> {gameResults.scenario.title}</p>
                  <p><strong>Your Decision:</strong> {gameResults.selectedOption?.text || 'No decision made'}</p>
                  <p><strong>Time Used:</strong> {gameResults.timeUsed || 10} seconds</p>
                </div>
              </div>
            )}

            <div className="results-actions">
              <div className="social-sharing">
                <h3>Share Your Analysis:</h3>
                <div className="share-buttons">
                  <button className="share-btn twitter" onClick={() => shareScore('twitter')}>
                    Share on Twitter
                  </button>
                  <button className="share-btn linkedin" onClick={() => shareScore('linkedin')}>
                    Share on LinkedIn
                  </button>
                  <button className="share-btn reddit" onClick={() => shareScore('reddit')}>
                    Share on Reddit
                  </button>
                </div>
              </div>

              <div className="game-actions">
                <button className="play-again-button" onClick={resetGame}>
                  Analyze Another Chart
                </button>
                <Link href="/games/sprint-simulator" className="next-game-link">
                  Try Sprint Simulator →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
