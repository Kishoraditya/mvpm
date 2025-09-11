'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackGameInteraction } from '@/lib/supabase';
import Link from 'next/link';
import './assumption-sniper.css';
import appConfig from '@/lib/config';

const SCENARIOS = [
    {
        title: "SaaS Dashboard Redesign",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=top",
        description: `Your team just launched a "streamlined" dashboard redesign for your enterprise SaaS platform. The PM pitched it as reducing cognitive load with cleaner visuals and fewer clicks. Initial user testing showed 15% faster task completion.<br/><br/><strong>The Situation:</strong> After two weeks in production, support tickets are up 40%, feature adoption dropped 25%, and three major clients threatened to churn. The CEO wants answers in tomorrow's board meeting.`,
        challenge: `🎯 <strong>Your Mission:</strong> Identify exactly 3 hidden assumptions in this dashboard redesign that could explain the business crisis. Think like the PM who has to save their career - and the company's quarter.`
    }
];

// Fallback AI analysis for when API is unavailable
const analyzeAssumptionsLocally = (assumptions) => {
    const keywords = {
        user_behavior: ['user', 'behavior', 'habit', 'workflow', 'process', 'training'],
        data_interpretation: ['data', 'metric', 'testing', 'sample', 'bias', 'context'],
        stakeholder_needs: ['stakeholder', 'client', 'customer', 'requirement', 'expectation'],
        technical_constraints: ['technical', 'system', 'infrastructure', 'performance', 'compatibility'],
        change_management: ['change', 'adoption', 'transition', 'communication', 'rollout']
    };

    return assumptions.map((assumption) => {
        const lowerAssumption = assumption.toLowerCase();
        let classification = 'incorrect';
        let analysisText = 'This assumption needs more specific connection to the dashboard failure.';

        // Check for relevant keywords
        const relevantCategories = Object.keys(keywords).filter(category =>
            keywords[category].some(keyword => lowerAssumption.includes(keyword))
        );

        if (relevantCategories.length > 0) {
            classification = 'partial';
            analysisText = `Good insight! This touches on ${relevantCategories.join(' and ')} issues. `;
        }

        // Check for specific quality indicators
        if (lowerAssumption.includes('user') && (lowerAssumption.includes('training') || lowerAssumption.includes('learn'))) {
            classification = 'correct';
            analysisText = 'Excellent! User training assumptions are often overlooked in redesigns. ';
        }

        if (lowerAssumption.includes('test') && (lowerAssumption.includes('production') || lowerAssumption.includes('real'))) {
            classification = 'correct';
            analysisText = 'Spot on! Testing environments rarely match real-world usage complexity. ';
        }

        if (lowerAssumption.includes('stakeholder') || lowerAssumption.includes('client')) {
            classification = 'partial';
            analysisText = 'Good stakeholder awareness. Consider how different user segments were affected. ';
        }

        return {
            assumption: assumption,
            classification: classification,
            analysisText: analysisText
        };
    });
};

function AssumptionSniperGame() {
    const [gameState, setGameState] = useState('playing'); // playing, loading, results
    const [timeLeft, setTimeLeft] = useState(40);
    const [scenario, setScenario] = useState(null);
    const [assumptions, setAssumptions] = useState(['', '', '']);
    const [feedback, setFeedback] = useState('');
    const [analysis, setAnalysis] = useState([]);
    const [userFeedback, setUserFeedback] = useState('');
    const [finalScore, setFinalScore] = useState(0);
    const timerRef = useRef(null);
    const { trackEvent } = useAnalytics();

    const scenarios = useMemo(() => SCENARIOS, []);

    const submitAssumptions = useCallback(async (isTimeUp = false) => {
        if (!isTimeUp && assumptions.some(a => a.trim().length < 10)) {
            alert('Each assumption needs to be more detailed (at least 10 characters).');
            return;
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setGameState('loading');

        try {
            // Try API first
            const response = await fetch('/api/analyze-assumptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assumptions }),
            });

            let result;
            if (response.ok) {
                result = await response.json();
            } else {
                throw new Error('API unavailable');
            }
            
            setFeedback(result.overallFeedback);
            setAnalysis(result.analysis);

            // Calculate score from API result
            const totalScore = result.analysis.reduce((sum, item) => {
                if (item.classification === 'correct') return sum + 2;
                if (item.classification === 'partial') return sum + 1;
                return sum;
            }, 0);
            setFinalScore(totalScore);

        } catch (error) {
            console.log("API unavailable, using fallback analysis:", error);
            
            // Fallback to local analysis
            const localAnalysis = analyzeAssumptionsLocally(assumptions);
            setAnalysis(localAnalysis);
            
            // Calculate score from local analysis
            const totalScore = localAnalysis.reduce((sum, item) => {
                if (item.classification === 'correct') return sum + 2;
                if (item.classification === 'partial') return sum + 1;
                return sum;
            }, 0);
            setFinalScore(totalScore);

            // Generate feedback based on score
            let feedbackText = '';
            if (totalScore >= 5) {
                feedbackText = '🎯 Excellent assumption hunting! You identified critical blind spots that could tank a product launch. Your PM instincts are sharp - you understand that the biggest risks often hide in what teams take for granted.';
            } else if (totalScore >= 3) {
                feedbackText = '💡 Good detective work! You caught some important assumptions, though there might be deeper systemic issues to uncover. Remember: the most dangerous assumptions are the ones that seem obviously true.';
            } else {
                feedbackText = '🔍 Keep digging deeper! Assumption hunting is a skill that improves with practice. Think about what the team might have taken for granted about user behavior, data interpretation, or stakeholder needs.';
            }
            setFeedback(feedbackText);
        }

        setGameState('results');

        // Track completion
        trackEvent('game_completed', {
            game: 'assumption_sniper',
            score: finalScore,
            time_spent: 40 - timeLeft,
        });

        trackGameInteraction('assumption_sniper', 'game_completed', {
            time_spent: 40 - timeLeft,
            score: finalScore,
            assumptions: assumptions,
        });
    }, [assumptions, finalScore, timeLeft, trackEvent]);

    const initializeGame = useCallback(() => {
        trackEvent('game_started', { game_name: 'assumption_sniper' });
        trackGameInteraction('assumption_sniper', 'game_started');
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        setScenario(randomScenario);
        setGameState('playing');
        setTimeLeft(40);
    }, [scenarios, trackEvent]);

    // Handle timer separately to avoid circular dependency
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        // Auto-submit when time is up
                        submitAssumptions(true);
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
    }, [gameState, timeLeft, submitAssumptions]);

    useEffect(() => {
        initializeGame();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [initializeGame]);

    const handleAssumptionChange = (index, value) => {
        const newAssumptions = [...assumptions];
        newAssumptions[index] = value;
        setAssumptions(newAssumptions);
    };

    const restartGame = () => {
        setGameState('playing');
        setAssumptions(['', '', '']);
        setFeedback('');
        setAnalysis([]);
        setUserFeedback('');
        setFinalScore(0);
        initializeGame();
    };

    const submitUserFeedback = () => {
        if (userFeedback.trim()) {
            trackEvent('user_feedback_submitted', { 
                game_name: 'assumption_sniper',
                feedback: userFeedback 
            });
            trackGameInteraction('assumption_sniper', 'feedback_submitted', {
                feedback: userFeedback
            });
            alert('Thanks for helping us improve! Your feedback shapes our AI.');
            setUserFeedback('');
        }
    };

    const setupSocialSharing = () => {
        const shareText = `Just hunted down hidden assumptions and scored ${finalScore}/6! Think you can spot the deadly assumptions that tank product launches? Try Assumption Sniper`;
        const url = typeof window !== 'undefined' ? window.location.href : '';
        
        return {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
            reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareText)}`
        };
    };

    const socialLinks = setupSocialSharing();
    
    const allFilled = useMemo(() => assumptions.every(a => a.trim().length > 10), [assumptions]);

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
                    <h1 className="game-title">Assumption Sniper</h1>
                    <p className="game-subtitle">Find exactly 3 hidden assumptions that could tank this feature. Miss one, pay the price.</p>
                    <div className="timer-container">
                        <div id="timer" className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>{timeLeft}</div>
                        <div id="gameStatus" className="game-status">Ready to Hunt Assumptions?</div>
                    </div>
                </div>

                {gameState === 'playing' && scenario && (
                    <>
                        <div className="scenario-section">
                            <h3 className="scenario-title">{scenario.title}</h3>
                            <img src={scenario.image} alt="Modern SaaS Dashboard" className="scenario-image" />
                            <div className="scenario-description" dangerouslySetInnerHTML={{ __html: scenario.description }}></div>
                            <div className="challenge-brief" dangerouslySetInnerHTML={{ __html: scenario.challenge }}></div>
                        </div>

                        <div className="input-section">
                            <div className="assumptions-grid">
                                {assumptions.map((text, i) => (
                                    <div className="assumption-input" key={i}>
                                        <div className="assumption-number">{i + 1}</div>
                                        <textarea
                                            className="assumption-text"
                                            placeholder={`What deadly assumption lurked beneath the surface?`}
                                            value={text}
                                            onChange={(e) => handleAssumptionChange(i, e.target.value)}
                                        ></textarea>
                                    </div>
                                ))}
                            </div>
                            <div className="submit-section">
                                <button className="submit-btn" onClick={() => submitAssumptions(false)} disabled={!allFilled}>
                                    {allFilled ? 'Defuse the Assumptions' : 'Need All 3 Assumptions'}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {gameState === 'loading' && (
                    <div className="loading show">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">AI analyzing your PM instincts...</div>
                    </div>
                )}

                {gameState === 'results' && (
                    <>
                        <div className="results-section show">
                            <div className="score-display">
                                <h3 className="score-title">Assumption Hunt Complete!</h3>
                                <div className="final-score">{finalScore}/6</div>
                                <div className="performance-badge">
                                    {finalScore >= 5 ? '🏆 Expert Assumption Hunter' : 
                                     finalScore >= 3 ? '🎯 Solid PM Detective' : 
                                     '🔍 Developing Instincts'}
                                </div>
                            </div>

                            <div className="ai-feedback">
                                <h3 className="feedback-title">🧠 AI Product Manager Analysis</h3>
                                <div className="feedback-content">{feedback}</div>
                            </div>
                            
                            {analysis && analysis.length > 0 && (
                                <div className="assumption-analysis">
                                    {analysis.map((item, i) => (
                                        <div className={`assumption-result ${item.classification}`} key={i}>
                                            <div className="result-header">Your Assumption #{i + 1}: {item.assumption}</div>
                                            <div className="result-analysis"><strong>Analysis:</strong> {item.analysisText || item.analysis}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {appConfig.getFeatureFlag('ui.socialShare', true) && (
                                <div className="social-share">
                                    <h3 className="social-title">🚀 Share Your Assumption Hunt</h3>
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
                            )}
                        </div>
                        
                        <div className="action-section" style={{display: 'block'}}>
                            <h3 className="action-title">The AI Revolution Waits for No PM</h3>
                            <p className="action-text">
                                Think this was tough? We're just warming up. The future belongs to PMs who can navigate AI-amplified complexity without cognitive atrophy.
                                <br /><br />
                                <strong>Help our AI get even sharper.</strong> Your gameplay data trains tomorrow's product intelligence.
                            </p>
                            <div className="action-buttons">
                                <button onClick={restartGame} className="action-btn primary">Play Again</button>
                                <Link href="/#signup" className="action-btn secondary">Join the Waitlist</Link>
                                <Link href="/games/sprint-simulator" className="action-btn secondary">Sprint Simulator</Link>
                                <Link href="/" className="action-btn secondary">More Challenges</Link>
                            </div>

                            {/* User Feedback Form */}
                            <div className="feedback-form">
                                <h3 className="feedback-title">Help Us Improve</h3>
                                <textarea 
                                    className="feedback-input" 
                                    placeholder="How was the assumption hunting challenge? Any suggestions for improvement? Your input shapes our AI..."
                                    value={userFeedback}
                                    onChange={(e) => setUserFeedback(e.target.value)}
                                />
                                <div className="feedback-submit">
                                    <button onClick={submitUserFeedback} className="btn btn-primary">
                                        Send Feedback
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default function AssumptionSniperPage() {
    // Gate by feature flag
    if (!appConfig.getFeatureFlag('games.assumption_sniper', true)) {
        return (
            <div className="game-container" style={{ padding: '2rem' }}>
                <header className="game-header-nav">
                    <nav>
                        <Link href="/" className="logo">iterate</Link>
                        <Link href="/" className="back-home">← Back to Home</Link>
                    </nav>
                </header>
                <h1>Assumption Sniper</h1>
                <p>This game is currently unavailable.</p>
                <p><Link href="/">Return to games</Link></p>
            </div>
        );
    }

    return <AssumptionSniperGame />;
}
