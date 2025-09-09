document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const screens = {
        planning: document.getElementById('planning-screen'),
        sprint: document.getElementById('sprint-screen'),
        review: document.getElementById('review-screen'),
    };
    const storiesList = document.getElementById('stories-list');
    const pointsDisplay = document.getElementById('points-display');
    const startSprintBtn = document.getElementById('start-sprint-btn');

    const dayCounter = document.getElementById('day-counter');
    const moraleDisplay = document.getElementById('morale-display');
    const stakeholderDisplay = document.getElementById('stakeholder-display');
    const eventTitle = document.getElementById('event-title');
    const eventDescription = document.getElementById('event-description');
    const eventOptions = document.getElementById('event-options');

    const finalPoints = document.getElementById('final-points');
    const finalMorale = document.getElementById('final-morale');
    const finalStakeholders = document.getElementById('final-stakeholders');
    const finalFeedback = document.getElementById('final-feedback');
    const playAgainBtn = document.getElementById('play-again-btn');

    // --- Game Data ---
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

    // --- Game State ---
    let state = {};

    function initializeGame() {
        state = {
            committedStories: [],
            committedPoints: 0,
            currentDay: 1,
            morale: 100,
            stakeholders: 100,
            completedPoints: 0,
            eventQueue: [...DAILY_EVENTS].sort(() => 0.5 - Math.random())
        };
        renderPlanningScreen();
        showScreen('planning');
    }

    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.add('hidden'));
        screens[screenName].classList.remove('hidden');
    }

    // --- Planning Phase ---
    function renderPlanningScreen() {
        storiesList.innerHTML = '';
        ALL_STORIES.forEach(story => {
            const li = document.createElement('li');
            li.dataset.storyId = story.id;
            li.innerHTML = `
                <input type="checkbox" class="story-checkbox" id="story-${story.id}">
                <div class="story-details">
                    <strong>${story.title}</strong>
                    <p>Risk: ${story.risk * 100}%</p>
                </div>
                <span class="story-points">${story.points} pts</span>
            `;
            li.addEventListener('click', (e) => {
                const checkbox = li.querySelector('.story-checkbox');
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
                toggleStorySelection(story, checkbox.checked);
            });
            storiesList.appendChild(li);
        });
        updatePointsDisplay();
    }

    function toggleStorySelection(story, isSelected) {
        const storyId = story.id;
        const isAlreadySelected = state.committedStories.some(s => s.id === storyId);

        if (isSelected && !isAlreadySelected) {
            if (state.committedPoints + story.points <= TEAM_CAPACITY) {
                state.committedStories.push(story);
                document.querySelector(`[data-story-id="${storyId}"]`).classList.add('selected');
            }
        } else if (!isSelected && isAlreadySelected) {
            state.committedStories = state.committedStories.filter(s => s.id !== storyId);
             document.querySelector(`[data-story-id="${storyId}"]`).classList.remove('selected');
        }
        
        // Resync checkbox state if selection was blocked
        const checkbox = document.getElementById(`story-${story.id}`);
        const stillSelected = state.committedStories.some(s => s.id === storyId);
        checkbox.checked = stillSelected;
        if(stillSelected) {
             document.querySelector(`[data-story-id="${storyId}"]`).classList.add('selected');
        } else {
             document.querySelector(`[data-story-id="${storyId}"]`).classList.remove('selected');
        }

        updatePointsDisplay();
    }

    function updatePointsDisplay() {
        state.committedPoints = state.committedStories.reduce((sum, story) => sum + story.points, 0);
        pointsDisplay.textContent = `Committed: ${state.committedPoints} / ${TEAM_CAPACITY} points`;
        startSprintBtn.disabled = state.committedStories.length === 0;
    }

    startSprintBtn.addEventListener('click', startSprint);

    // --- Sprint Phase ---
    function startSprint() {
        state.baseVelocity = state.committedPoints / SPRINT_DAYS;
        showScreen('sprint');
        runDay();
    }

    function runDay() {
        if (state.currentDay > SPRINT_DAYS) {
            endSprint();
            return;
        }
        updateUI();
        presentEvent();
    }

    function updateUI() {
        dayCounter.textContent = `Day ${state.currentDay} of ${SPRINT_DAYS}`;
        moraleDisplay.textContent = `${Math.round(state.morale)}%`;
        stakeholderDisplay.textContent = `${Math.round(state.stakeholders)}%`;
    }

    function presentEvent() {
        const event = state.eventQueue.pop() || { title: 'A Quiet Day', description: 'The team is making steady progress.', options: [{ text: 'Keep it up!', morale: 2, stakeholders: 1, velocity: 0 }] };
        eventTitle.textContent = event.title;
        eventDescription.textContent = event.description;
        eventOptions.innerHTML = '';
        event.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.onclick = () => handleOptionChoice(option);
            eventOptions.appendChild(button);
        });
    }

    function handleOptionChoice(option) {
        state.morale = Math.max(0, Math.min(100, state.morale + option.morale));
        state.stakeholders = Math.max(0, Math.min(100, state.stakeholders + option.stakeholders));
        
        const moraleModifier = state.morale / 100; // 1.0 at 100%, 0.5 at 50%
        const dailyVelocity = state.baseVelocity * moraleModifier + option.velocity;
        state.completedPoints += dailyVelocity;

        // Check for random risk events
        state.committedStories.forEach(story => {
            if (Math.random() < story.risk / SPRINT_DAYS) { // Spread risk over sprint
                state.completedPoints -= story.points * 0.2; // Risk materializes, lose some progress
                // Could add a mini-event here in a future version
            }
        });

        state.currentDay++;
        runDay();
    }

    // --- Review Phase ---
    function endSprint() {
        finalPoints.textContent = Math.round(state.completedPoints);
        finalMorale.textContent = Math.round(state.morale);
        finalStakeholders.textContent = Math.round(state.stakeholders);

        let feedback = '';
        if (state.completedPoints >= state.committedPoints) {
            feedback = 'Excellent work! You delivered on your commitments and managed the sprint perfectly.';
        } else if (state.completedPoints > state.committedPoints * 0.7) {
            feedback = 'Good effort. You delivered most of what you promised, despite some challenges.';
        } else {
            feedback = 'A tough sprint. Significant challenges impacted delivery. Time for a retrospective!';
        }
        finalFeedback.textContent = feedback;

        showScreen('review');
    }

    playAgainBtn.addEventListener('click', initializeGame);

    // --- Initial Load ---
    initializeGame();
});
