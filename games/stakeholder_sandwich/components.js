// Component-ready structure for Next.js conversion
// This file contains modular functions that can easily be converted to React components

// Game State Management
const GameStates = {
    LOADING: 'loading',
    PLAYING: 'playing',
    RESULTS: 'results'
};

// Scenario Data
const SCENARIOS = [
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

// Component: Game Header
function createGameHeader() {
    return `
        <div class="game-header">
            <h1 class="game-title">Stakeholder Sandwich</h1>
            <p class="game-subtitle">45 seconds. One impossible request. Your reputation on the line.</p>
            <span class="brutal-timer">BRUTAL 45s</span>
        </div>
    `;
}

// Component: Loading State
function createLoadingState() {
    return `
        <div id="loading-state" class="game-state active">
            <div class="loading-spinner"></div>
            <p class="loading-text">Generating your nightmare scenario...</p>
        </div>
    `;
}

// Component: Scenario Box
function createScenarioBox(scenario) {
    return `
        <div class="scenario-box">
            <h3 class="scenario-title">🔥 Your Challenge</h3>
            <div class="scenario-text">${scenario.text}</div>
        </div>
    `;
}

// Component: Timer Display
function createTimerDisplay(timeLeft) {
    const warningClass = timeLeft <= 10 ? 'warning' : '';
    return `
        <div class="timer-display">
            <div id="timer-circle" class="timer-circle ${warningClass}">${timeLeft}</div>
            <p class="timer-text">seconds remaining</p>
        </div>
    `;
}

// Component: Response Area
function createResponseArea() {
    return `
        <div class="response-area">
            <label class="response-label">Draft your response (1-2 sentences, include a metric or alternative):</label>
            <textarea 
                id="response-input" 
                class="response-input" 
                placeholder="Your response here... Remember: clarity, strategy, empathy, evidence, brevity."
                maxlength="500"
            ></textarea>
            <div id="character-count" class="character-count">0/500 characters</div>
        </div>
    `;
}

// Component: Action Buttons
function createActionButtons() {
    return `
        <div class="action-buttons">
            <button id="submit-btn" class="btn btn-primary">Submit Response</button>
            <button id="skip-btn" class="btn btn-secondary">Skip Challenge</button>
        </div>
    `;
}

// Component: Performance Badge
function createPerformanceBadge(score) {
    return `
        <div class="performance-badge">
            🎯 Top 10% Performance
        </div>
    `;
}

// Component: Feedback Section
function createFeedbackSection(feedback) {
    return `
        <div class="feedback-section">
            <h3 class="feedback-title">AI Analysis</h3>
            <div class="feedback-text">${feedback}</div>
        </div>
    `;
}

// Component: Social Share
function createSocialShare(shareLinks) {
    return `
        <div class="social-share">
            <h3 class="social-title">🚀 Share Your MVPM Moment</h3>
            <div class="social-buttons">
                <a href="${shareLinks.linkedin}" class="social-btn linkedin">
                    <span>📊</span> LinkedIn
                </a>
                <a href="${shareLinks.twitter}" class="social-btn twitter">
                    <span>🐦</span> Twitter
                </a>
                <a href="${shareLinks.reddit}" class="social-btn reddit">
                    <span>🤖</span> Reddit
                </a>
            </div>
        </div>
    `;
}

// Component: Next Steps
function createNextSteps() {
    return `
        <div class="next-steps">
            <h3>🔥 This is just the beginning...</h3>
            <p>Think that was tough? The AI revolution demands cognitive excellence. Can you survive without cognitive atrophy? Help our AI improve by sharing feedback and conquering more challenges.</p>
            
            <div class="cta-grid">
                <a href="#" class="btn btn-primary" onclick="restartGame()">Play Again</a>
                <a href="/#signup" class="btn btn-secondary">Join Waitlist</a>
                <a href="/#coming-soon" class="btn btn-secondary">Enterprise Arsenal</a>
                <a href="/" class="btn btn-secondary">More Games</a>
            </div>
        </div>
    `;
}

// Component: User Feedback Form
function createUserFeedbackForm() {
    return `
        <div class="feedback-section">
            <h3 class="feedback-title">Help Us Improve</h3>
            <textarea 
                id="user-feedback" 
                class="response-input" 
                placeholder="How was the challenge? Any suggestions for improvement? We're just starting out and your input shapes our AI..."
                style="min-height: 80px;"
            ></textarea>
            <div style="text-align: center; margin-top: 1rem;">
                <button id="feedback-submit" class="btn btn-primary">Send Feedback</button>
            </div>
        </div>
    `;
}

// Utility Functions for Next.js conversion
const GameUtils = {
    // Generate random scenario
    getRandomScenario() {
        return SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    },

    // Analyze response (can be converted to API call)
    analyzeResponse(userResponse) {
        const responses = userResponse.toLowerCase();
        let score = 7;
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
        const wordCount = userResponse.split(' ').length;
        if (wordCount >= 10 && wordCount <= 50) {
            score += 0.5;
            feedback += "Perfect brevity. ";
        } else if (wordCount > 50) {
            feedback += "Consider being more concise - PMs must communicate efficiently. ";
        }
        
        feedback += "You're in the top 10% of PMs, but the real challenges haven't even started. Can you maintain this excellence when the stakes are higher?";
        
        return { score, feedback };
    },

    // Generate social sharing links
    generateSocialLinks(timeSpent, url) {
        const shareText = `Just crushed a Stakeholder Sandwich in ${timeSpent}s! 🔥 Think you can handle impossible PM scenarios better? Try the MVPM challenge`;
        
        return {
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
            reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareText)}`
        };
    },

    // Format character count
    formatCharacterCount(count, maxLength = 500) {
        const warningClass = count > (maxLength * 0.8) ? 'warning' : '';
        return {
            text: `${count}/${maxLength} characters`,
            className: warningClass
        };
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameStates,
        SCENARIOS,
        GameUtils,
        createGameHeader,
        createLoadingState,
        createScenarioBox,
        createTimerDisplay,
        createResponseArea,
        createActionButtons,
        createPerformanceBadge,
        createFeedbackSection,
        createSocialShare,
        createNextSteps,
        createUserFeedbackForm
    };
}