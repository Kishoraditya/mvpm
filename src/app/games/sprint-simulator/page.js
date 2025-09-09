'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackGameInteraction } from '@/lib/supabase';
import Link from 'next/link';
import './sprint-simulator.css';

// Game Data
const TEAM_CAPACITY = 30;
const SPRINT_DAYS = 10;

const ALL_STORIES = [
    { id: 1, title: 'User login with email/password', points: 5, risk: 0.1 },
    { id: 2, title: 'Implement "Forgot Password" flow', points: 3, risk: 0.1 },
    { id: 3, title: 'User profile page', points: 5, risk: 0.2 },
    { id: 4, title: 'Integrate with new payment gateway', points: 8, risk: 0.4 },
    { id: 5, title: 'Onboarding tutorial for new users', points: 5, risk: 0.2 },
    { id: 6, title: 'Admin dashboard for user management', points: 8, risk: 0.3 },
    { id: 7, title: 'Refactor legacy reporting module', points: 10, risk: 0.5 },
    { id: 8, title: 'Add 2FA security', points: 5, risk: 0.3 },
];

const DAILY_EVENTS = [
    {
        title: "Urgent Stakeholder Request",
        description: "The CEO wants a 'small' change to the logo color, effective immediately. It's not in the sprint.",
        options: [
            { text: "Tell them it's out of scope.", morale: 5, stakeholders: -20, velocity: 0 },
            { text: "Drop a low-priority task to fit it in.", morale: -10, stakeholders: 15, velocity: -1 },
            { text: "Ask the team to work overtime.", morale: -20, stakeholders: 10, velocity: 0 },
        ]
    },
    {
        title: "A Key Developer is Sick",
        description: "Your lead backend engineer is out sick for the day. They were working on a critical path story.",
        options: [
            { text: "Let the team self-organize to cover.", morale: 5, stakeholders: 0, velocity: -2 },
            { text: "Re-assign their tasks immediately.", morale: -5, stakeholders: 0, velocity: -1 },
            { text: "Delay the dependent stories.", morale: 0, stakeholders: -5, velocity: -3 },
        ]
    },
    {
        title: "Unexpected Technical Debt",
        description: "The team discovered a part of the codebase is more fragile than expected, slowing down progress on a feature.",
        options: [
            { text: "Allocate time to fix it properly.", morale: 10, stakeholders: -5, velocity: -3 },
            { text: "Apply a quick patch to keep moving.", morale: -10, stakeholders: 5, velocity: -1 },
            { text: "Ignore it for now.", morale: -15, stakeholders: 0, velocity: 0 },
        ]
    },
    {
        title: "Scope Creep from Marketing",
        description: "Marketing asks if you can 'just add' a tracking pixel for their new campaign to the feature you're building.",
        options: [
            { text: "Politely decline and stick to the plan.", morale: 5, stakeholders: -10, velocity: 0 },
            { text: "Accept, it's a small change.", morale: -5, stakeholders: 10, velocity: -1 },
            { text: "Tell them to file a ticket for the next sprint.", morale: 0, stakeholders: 0, velocity: 0 },
        ]
    },
];

export default function SprintSimulatorPage() {
    const [gameState, setGameState] = useState('loading'); // loading, planning, sprint, results
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for planning phase
    const [committedStories, setCommittedStories] = useState([]);
    const [committedPoints, setCommittedPoints] = useState(0);
    const [currentDay, setCurrentDay] = useState(1);
    const [morale, setMorale] = useState(100);
    const [stakeholders, setStakeholders] = useState(100);
    const [completedPoints, setCompletedPoints] = useState(0);
    const [eventQueue, setEventQueue] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [finalScore, setFinalScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [userFeedback, setUserFeedback] = useState('');
    const timerRef = useRef(null);
    const gameStartTime = useRef(null);
    const { trackEvent } = useAnalytics();

    const baseVelocity = useMemo(() => committedPoints / SPRINT_DAYS, [committedPoints]);

    const startPlanningTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    // Auto-start sprint with current selection
                    setGameState('sprint');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const endSprint = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        const deliveryRatio = committedPoints > 0 ? completedPoints / committedPoints : 0;
        const balanceScore = Math.min(morale, stakeholders) / 100;
        const calculatedScore = Math.round((deliveryRatio * 50) + (balanceScore * 50));
        
        setFinalScore(calculatedScore);
        
        let feedbackText = '';
        if (calculatedScore >= 80) {
            feedbackText = '🏆 Outstanding sprint execution! You delivered on commitments while keeping both team morale and stakeholder satisfaction high. This is the hallmark of exceptional product management.';
        } else if (calculatedScore >= 60) {
            feedbackText = '💪 Solid sprint management! You handled the challenges well, though there\'s room for optimization in balancing delivery with team and stakeholder needs.';
        } else if (calculatedScore >= 40) {
            feedbackText = '📈 Learning experience! Sprint management is about finding the right balance. Consider how your decisions impact both delivery and relationships.';
        } else {
            feedbackText = '🎯 Keep practicing! Great PMs learn that sustainable delivery requires managing technical debt, team morale, and stakeholder expectations simultaneously.';
        }
        
        setFeedback(feedbackText);
        setGameState('results');
        
        // Track completion
        trackEvent('game_completed', {
            game: 'sprint_simulator',
            score: calculatedScore,
            delivery_ratio: deliveryRatio,
            final_morale: morale,
            final_stakeholders: stakeholders
        });
        
        trackGameInteraction('sprint_simulator', 'game_completed', {
            score: calculatedScore,
            delivery_ratio: deliveryRatio,
            final_morale: morale,
            final_stakeholders: stakeholders,
            committed_points: committedPoints,
            completed_points: completedPoints
        });
    }, [committedPoints, completedPoints, morale, stakeholders, trackEvent]);

    const initializeGame = useCallback(async () => {
        // Track game start
        trackEvent('game_started', { game_name: 'sprint_simulator' });
        trackGameInteraction('sprint_simulator', 'game_started');

        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Initialize game state
        setCommittedStories([]);
        setCommittedPoints(0);
        setCurrentDay(1);
        setMorale(100);
        setStakeholders(100);
        setCompletedPoints(0);
        setEventQueue([...DAILY_EVENTS].sort(() => 0.5 - Math.random()));
        setCurrentEvent(null);
        setFinalScore(0);
        setFeedback('');
        setUserFeedback('');
        setTimeLeft(60);
        
        gameStartTime.current = Date.now();
        setGameState('planning');
        startPlanningTimer();
    }, [trackEvent, startPlanningTimer]);

    const runDay = useCallback(() => {
        if (currentDay > SPRINT_DAYS) {
            endSprint();
            return;
        }
        
        const nextEvent = eventQueue.length > 0 ? eventQueue.pop() : { 
            title: 'A Quiet Day', 
            description: 'The team is making steady progress.', 
            options: [{ text: 'Keep it up!', morale: 2, stakeholders: 1, velocity: 0 }] 
        };
        setCurrentEvent(nextEvent);
    }, [currentDay, eventQueue, endSprint]);

    const handleStoryToggle = (story) => {
        const isSelected = committedStories.some(s => s.id === story.id);
        let newCommittedStories = [...committedStories];

        if (isSelected) {
            newCommittedStories = newCommittedStories.filter(s => s.id !== story.id);
        } else {
            const newTotalPoints = committedPoints + story.points;
            if (newTotalPoints <= TEAM_CAPACITY) {
                newCommittedStories.push(story);
            }
        }
        setCommittedStories(newCommittedStories);
        setCommittedPoints(newCommittedStories.reduce((sum, s) => sum + s.points, 0));
    };

    const startSprint = () => {
        if (committedStories.length > 0) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            setGameState('sprint');
            runDay();
        }
    };

    const handleOptionChoice = (option) => {
        const newMorale = Math.max(0, Math.min(100, morale + option.morale));
        const newStakeholders = Math.max(0, Math.min(100, stakeholders + option.stakeholders));
        
        setMorale(newMorale);
        setStakeholders(newStakeholders);

        const moraleModifier = newMorale / 100;
        const dailyVelocity = baseVelocity * moraleModifier + option.velocity;
        let newCompletedPoints = completedPoints + dailyVelocity;

        // Risk check
        committedStories.forEach(story => {
            if (Math.random() < story.risk / SPRINT_DAYS) {
                newCompletedPoints -= story.points * 0.2;
            }
        });
        
        setCompletedPoints(Math.max(0, newCompletedPoints));
        setCurrentDay(prev => prev + 1);
        
        // Continue to next day
        setTimeout(() => {
            runDay();
        }, 1000);
    };

    useEffect(() => {
        initializeGame();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [initializeGame]);

    useEffect(() => {
        if (gameState === 'sprint' && currentDay === 1 && !currentEvent) {
            runDay();
        }
    }, [gameState, currentDay, currentEvent, runDay]);

    const restartGame = () => {
        setGameState('loading');
        initializeGame();
    };

    const submitUserFeedback = () => {
        if (userFeedback.trim()) {
            trackEvent('user_feedback_submitted', { 
                game_name: 'sprint_simulator',
                feedback: userFeedback 
            });
            trackGameInteraction('sprint_simulator', 'feedback_submitted', {
                feedback: userFeedback
            });
            alert('Thanks for helping us improve! Your feedback shapes our AI.');
            setUserFeedback('');
        }
    };

    const setupSocialSharing = () => {
        const shareText = `Just managed a ${SPRINT_DAYS}-day sprint and scored ${finalScore}/100! Think you can balance stakeholders, team morale, and delivery better? Try the Sprint Simulator`;
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
                    <h1 className="game-title">Sprint Simulator</h1>
                    <p className="game-subtitle">Navigate 10 days of PM chaos. Balance stakeholders, team morale, and delivery commitments.</p>
                    {gameState === 'planning' && (
                        <div className="timer-display">
                            <div className={`timer-circle ${timeLeft <= 10 ? 'warning' : ''}`}>
                                {timeLeft}
                            </div>
                            <p className="timer-text">seconds to plan</p>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {gameState === 'loading' && (
                    <div className="game-state active">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Generating your sprint nightmare...</p>
                    </div>
                )}

                {/* Planning State */}
                {gameState === 'planning' && (
                    <div className="game-state active">
                        <div className="planning-section">
                            <h3 className="section-title">🎯 Sprint Planning</h3>
                            <p className="capacity-info">Your team's capacity is <strong>{TEAM_CAPACITY} points</strong>. Select stories to commit to this sprint.</p>
                            
                            <div className="stories-grid">
                                {ALL_STORIES.map(story => (
                                    <div 
                                        key={story.id} 
                                        className={`story-card ${committedStories.some(s => s.id === story.id) ? 'selected' : ''}`}
                                        onClick={() => handleStoryToggle(story)}
                                    >
                                        <div className="story-header">
                                            <input 
                                                type="checkbox" 
                                                readOnly 
                                                checked={committedStories.some(s => s.id === story.id)} 
                                            />
                                            <span className="story-points">{story.points} pts</span>
                                        </div>
                                        <h4 className="story-title">{story.title}</h4>
                                        <p className="story-risk">Risk: {Math.round(story.risk * 100)}%</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="planning-footer">
                                <div className="commitment-display">
                                    Committed: <strong>{committedPoints} / {TEAM_CAPACITY} points</strong>
                                </div>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={startSprint} 
                                    disabled={committedStories.length === 0}
                                >
                                    Start Sprint
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sprint State */}
                {gameState === 'sprint' && currentEvent && (
                    <div className="game-state active">
                        <div className="sprint-header">
                            <h3 className="day-counter">Day {currentDay} of {SPRINT_DAYS}</h3>
                            <div className="metrics-display">
                                <div className="metric">
                                    <span className="metric-label">Team Morale</span>
                                    <span className="metric-value">{Math.round(morale)}%</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Stakeholder Satisfaction</span>
                                    <span className="metric-value">{Math.round(stakeholders)}%</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-label">Progress</span>
                                    <span className="metric-value">{Math.round(completedPoints)}/{committedPoints} pts</span>
                                </div>
                            </div>
                        </div>

                        <div className="event-section">
                            <h4 className="event-title">🔥 {currentEvent.title}</h4>
                            <p className="event-description">{currentEvent.description}</p>
                            
                            <div className="event-options">
                                {currentEvent.options.map((option, index) => (
                                    <button 
                                        key={index} 
                                        className="option-btn"
                                        onClick={() => handleOptionChoice(option)}
                                    >
                                        {option.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Results State */}
                {gameState === 'results' && (
                    <div className="game-state active">
                        <div className="results-content">
                            <div className="score-display">
                                <h3 className="score-title">Sprint Complete!</h3>
                                <div className="final-score">{finalScore}/100</div>
                                <div className="score-breakdown">
                                    <div className="breakdown-item">
                                        <span>Points Delivered:</span>
                                        <span>{Math.round(completedPoints)}/{committedPoints}</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span>Final Team Morale:</span>
                                        <span>{Math.round(morale)}%</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span>Stakeholder Satisfaction:</span>
                                        <span>{Math.round(stakeholders)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="feedback-section">
                                <h3 className="feedback-title">AI Analysis</h3>
                                <div className="feedback-text">{feedback}</div>
                            </div>

                            <div className="social-share">
                                <h3 className="social-title">🚀 Share Your Sprint Results</h3>
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
                                <h3>🔥 Ready for more PM challenges?</h3>
                                <p>Sprint management is just the beginning. The AI revolution demands cognitive excellence across all PM disciplines.</p>
                                
                                <div className="cta-grid">
                                    <button onClick={restartGame} className="btn btn-primary">Play Again</button>
                                    <Link href="/#signup" className="btn btn-secondary">Join Waitlist</Link>
                                    <Link href="/games/stakeholder-sandwich" className="btn btn-secondary">Stakeholder Sandwich</Link>
                                    <Link href="/" className="btn btn-secondary">More Games</Link>
                                </div>
                            </div>

                            {/* Feedback Form */}
                            <div className="feedback-form">
                                <h3 className="feedback-title">Help Us Improve</h3>
                                <textarea 
                                    className="feedback-input" 
                                    placeholder="How was the sprint simulation? Any suggestions for improvement? Your input shapes our AI..."
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
                    </div>
                )}
            </div>
        </>
    );
}
