// Stakeholder Sandwich Game Logic
// Import configuration and analytics
let GAME_CONFIG, gameAnalytics;
if (typeof window !== 'undefined') {
    // Browser environment
    if (window.GameConfig) {
        GAME_CONFIG = window.GameConfig.GAME_CONFIG;
    }
    if (window.initializeAnalytics) {
        gameAnalytics = window.initializeAnalytics();
    }
} else if (typeof require !== 'undefined') {
    // Node environment
    const config = require('./config.js');
    const analytics = require('./analytics.js');
    GAME_CONFIG = config.GAME_CONFIG;
    gameAnalytics = analytics.initializeAnalytics();
}

class StakeholderSandwichGame {
    constructor() {
        this.timeLeft = GAME_CONFIG?.timer?.duration || 45;
        this.timerInterval = null;
        this.gameStarted = false;
        this.scenario = null;
        this.userResponse = '';
        this.startTime = null;
        
        this.initializeGame();
    }

    async initializeGame() {
        // Track game start
        if (gameAnalytics) {
            gameAnalytics.trackGameStart();
        }
        
        // Simulate AI scenario generation
        await this.generateScenario();
        this.showGameState();
        this.setupEventListeners();
    }

    async generateScenario() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Sample scenarios (in production, this would come from your AI API)
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
        
        this.scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        // Track scenario generation
        if (gameAnalytics) {
            gameAnalytics.trackScenarioGenerated(this.scenario);
        }
    }

    showGameState() {
        document.getElementById('loading-state').classList.remove('active');
        document.getElementById('game-state').classList.add('active');
        
        // Populate scenario
        document.getElementById('scenario-text').textContent = this.scenario.text;
        
        this.startTimer();
    }

    startTimer() {
        this.gameStarted = true;
        this.startTime = Date.now();
        const warningThreshold = GAME_CONFIG?.timer?.warningThreshold || 10;
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            const timerCircle = document.getElementById('timer-circle');
            timerCircle.textContent = this.timeLeft;
            
            // Track timer updates
            if (gameAnalytics) {
                gameAnalytics.trackTimerUpdate(this.timeLeft);
            }
            
            if (this.timeLeft <= warningThreshold) {
                timerCircle.classList.add('warning');
            }
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, GAME_CONFIG?.timer?.updateInterval || 1000);
    }

    timeUp() {
        clearInterval(this.timerInterval);
        this.userResponse = document.getElementById('response-input').value;
        
        const timeSpent = this.getTimeSpent();
        if (gameAnalytics) {
            gameAnalytics.trackResponseSubmitted(this.userResponse, timeSpent);
        }
        
        this.showResults();
    }

    async submitResponse() {
        if (!this.gameStarted) return;
        
        clearInterval(this.timerInterval);
        this.userResponse = document.getElementById('response-input').value;
        
        if (!this.userResponse.trim()) {
            alert('Please provide a response before submitting!');
            this.startTimer();
            return;
        }
        
        const timeSpent = this.getTimeSpent();
        if (gameAnalytics) {
            gameAnalytics.trackResponseSubmitted(this.userResponse, timeSpent);
        }
        
        await this.analyzeResponse();
        this.showResults();
    }

    async analyzeResponse() {
        // In production, this would call your AI API for analysis
        // For now, we'll simulate realistic PM feedback
        
        const responses = this.userResponse.toLowerCase();
        let score = 7; // Base score
        let feedback = "Strong PM instincts! ";
        
        // Check for metrics
        if (responses.includes('%') || responses.includes('metric') || responses.includes('kpi') || responses.includes('data')) {
            score += 1;
            feedback += "Great use of data-driven reasoning. ";
        }
        
        // Check for alternatives
        if (responses.includes('alternative') || responses.includes('option') || responses.includes('instead') || responses.includes('pivot')) {
            score += 1;
            feedback += "Excellent strategic thinking with alternatives. ";
        }
        
        // Check for empathy
        if (responses.includes('understand') || responses.includes('team') || responses.includes('concern')) {
            score += 0.5;
            feedback += "Good stakeholder empathy. ";
        }
        
        // Length check
        const wordCount = this.userResponse.split(' ').length;
        if (wordCount >= 10 && wordCount <= 50) {
            score += 0.5;
            feedback += "Perfect brevity. ";
        } else if (wordCount > 50) {
            feedback += "Consider being more concise - PMs must communicate efficiently. ";
        }
        
        feedback += "You're in the top 10% of PMs, but the real challenges haven't even started. Can you maintain this excellence when the stakes are higher?";
        
        this.feedback = feedback;
        this.score = score;
    }

    showResults() {
        document.getElementById('game-state').classList.remove('active');
        document.getElementById('results-state').classList.add('active');
        
        // Show feedback
        document.getElementById('ai-feedback').textContent = this.feedback;
        
        // Setup social sharing
        this.setupSocialSharing();
        
        // Track game completion
        const timeSpent = this.getTimeSpent();
        if (gameAnalytics) {
            gameAnalytics.trackGameCompleted(this.score || 7, this.feedback, timeSpent);
        }
    }

    setupSocialSharing() {
        const timeSpent = 45 - this.timeLeft;
        const shareText = `Just crushed a Stakeholder Sandwich in ${timeSpent}s! 🔥 Think you can handle impossible PM scenarios better? Try the MVPM challenge`;
        const url = window.location.href;
        
        document.getElementById('linkedin-share').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
        document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
        document.getElementById('reddit-share').href = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareText)}`;
        
        // Add click tracking for social shares
        ['linkedin-share', 'twitter-share', 'reddit-share'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', () => {
                    const platform = id.replace('-share', '');
                    if (gameAnalytics) {
                        gameAnalytics.trackSocialShare(platform);
                    }
                });
            }
        });
    }

    setupEventListeners() {
        document.getElementById('submit-btn').addEventListener('click', () => this.submitResponse());
        document.getElementById('skip-btn').addEventListener('click', () => this.skipChallenge());
        
        // Character count
        const responseInput = document.getElementById('response-input');
        const characterCount = document.getElementById('character-count');
        
        responseInput.addEventListener('input', (e) => {
            const count = e.target.value.length;
            characterCount.textContent = `${count}/500 characters`;
            
            if (count > 400) {
                characterCount.classList.add('warning');
            } else {
                characterCount.classList.remove('warning');
            }
        });
        
        // Feedback submission
        document.getElementById('feedback-submit').addEventListener('click', () => {
        const feedback = document.getElementById('user-feedback').value;
        if (feedback.trim()) {
        if (gameAnalytics) {
            gameAnalytics.trackUserFeedback(feedback);
            }
                alert('🙏 Thanks for helping us improve! Your feedback shapes our AI.');
                document.getElementById('user-feedback').value = '';
            }
        });
        
        // Enter key to submit
        responseInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.submitResponse();
            }
        });
    }

    skipChallenge() {
        clearInterval(this.timerInterval);
        this.userResponse = "Skipped";
        this.feedback = "No worries! Even the best PMs know when to step back and reassess. But remember - the AI revolution won't wait. Ready to try again with a different scenario?";
        
        const timeSpent = this.getTimeSpent();
        if (gameAnalytics) {
            gameAnalytics.trackGameSkipped(timeSpent);
        }
        
        this.showResults();
    }
}

    // Utility method to get time spent
    getTimeSpent() {
        if (!this.startTime) return 0;
        const totalDuration = GAME_CONFIG?.timer?.duration || 45;
        return totalDuration - this.timeLeft;
    }
}

// Game initialization and utility functions
let game;

function initializeGame() {
    try {
        game = new StakeholderSandwichGame();
    } catch (error) {
        console.error('Game initialization failed:', error);
        if (gameAnalytics) {
            gameAnalytics.trackError(error, { context: 'game_initialization' });
        }
    }
}

function restartGame() {
    // Reset all states
    document.getElementById('results-state').classList.remove('active');
    document.getElementById('loading-state').classList.add('active');
    document.getElementById('response-input').value = '';
    document.getElementById('character-count').textContent = '0/500 characters';
    document.getElementById('character-count').classList.remove('warning');
    document.getElementById('timer-circle').classList.remove('warning');
    
    // Start new game
    game = new StakeholderSandwichGame();
}

// Prevent page refresh on accidental actions
function setupPageProtection() {
    window.addEventListener('beforeunload', (e) => {
        if (game && game.gameStarted && game.timeLeft > 0) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize analytics first
    if (typeof window !== 'undefined' && window.initializeAnalytics) {
        gameAnalytics = window.initializeAnalytics();
    }
    
    initializeGame();
    setupPageProtection();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StakeholderSandwichGame,
        initializeGame,
        restartGame
    };
}