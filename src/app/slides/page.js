'use client';

import { useState, useEffect } from 'react';
import './slides.css';

export default function SlidesPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 10;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key >= '1' && e.key <= '9') {
        const slideNum = parseInt(e.key);
        if (slideNum <= totalSlides) {
          setCurrentSlide(slideNum);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => prev < totalSlides ? prev + 1 : prev);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev > 1 ? prev - 1 : prev);
  };

  const goToSlide = (slideNum) => {
    setCurrentSlide(slideNum);
  };

  const progressWidth = (currentSlide / totalSlides) * 100;

  return (
    <>
      <div className="slide-progress" style={{ width: `${progressWidth}%` }}></div>

      {/* Slide 1: Title */}
      <div className={`slide-container ${currentSlide === 1 ? 'active' : ''} slide-1`}>
        <div className="slide-content fade-in">
          <h1 className="slide-title">iterate</h1>
          <p className="tagline">The Blueprint for Product Excellence</p>
          <p className="slide-subtitle">Do You Have What It Takes to Be MVPM?</p>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.7)', margin: '2rem 0' }}>
            Most Valuable Product Manager isn't just a title—it's earned through split-second decisions, razor-sharp thinking, and the ability to thrive under pressure.
          </p>
          <p style={{ fontSize: '1rem', color: '#667eea', marginTop: '2rem' }}>
            🏆 HackAI 2025 • Team iterate • Built in 48 hours
          </p>
        </div>
      </div>

      {/* Slide 2: The Problem */}
      <div className={`slide-container ${currentSlide === 2 ? 'active' : ''} slide-2`}>
        <div className="slide-content">
          <h1 className="slide-title">The Brutal Truth</h1>
          <p className="slide-subtitle">🚨 Cognitive Atrophy & Broken PM Hiring</p>
          
          <div className="problem-points">
            <div className="problem-card">
              <h3>🧠 Mental Muscle Atrophy</h3>
              <p>Over-reliance on AI is making PMs weaker at critical thinking, problem decomposition, and bias awareness. We're creating "managers of prompts, not products."</p>
            </div>
            
            <div className="problem-card">
              <h3>💔 Broken Hiring Process</h3>
              <p>Resumes don't reveal real product sense. Recruiters struggle to evaluate judgment, adaptability, strategy, and creativity objectively.</p>
            </div>
            
            <div className="problem-card">
              <h3>🎯 No Practice Arena</h3>
              <p>PMs rarely get to "practice" their craft in a safe, fun way. Traditional case studies feel heavy, unrealistic, and stressful.</p>
            </div>
          </div>

          <div className="quote">
            "We asked: What if PMs had a Wordle for product thinking? What if we could measure the unmeasurable—product sense, strategic thinking, decision-making under pressure?"
          </div>
        </div>
      </div>

      {/* Slide 3: Our Approach */}
      <div className={`slide-container ${currentSlide === 3 ? 'active' : ''} slide-3`}>
        <div className="slide-content">
          <h1 className="slide-title">The Daily Gauntlet</h1>
          <p className="slide-subtitle">Fun-First Gamified Learning That Actually Works</p>
          
          <div className="games-grid">
            <div className="game-card">
              <span className="game-timer">BRUTAL 45s</span>
              <h3>Stakeholder Sandwich</h3>
              <p>45 seconds. One impossible request. Your reputation on the line. Draft the perfect response.</p>
            </div>
            
            <div className="game-card">
              <span className="game-timer">LIGHTNING 10s</span>
              <h3>Chart-in-10</h3>
              <p>10 seconds to read a chart. Keep or kill? Your call could make or break the quarter.</p>
            </div>
            
            <div className="game-card">
              <span className="game-timer">SURGICAL 40s</span>
              <h3>Assumption Sniper</h3>
              <p>Find exactly 3 hidden assumptions that could tank this feature. Miss one, pay the price.</p>
            </div>
            
            <div className="game-card">
              <span className="game-timer">CHAOS 5min</span>
              <h3>Sprint Simulator</h3>
              <p>5-week product sprint compressed into split-second decisions. Ship or sink.</p>
            </div>
          </div>

          <div className="quote">
            "We designed daily 5-minute games that feel fun & playful. No business plan initially—just pure challenge. But then something magical happened..."
          </div>
        </div>
      </div>

      {/* Slide 4: The Insight */}
      <div className={`slide-container ${currentSlide === 4 ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="slide-title">The Surprise Discovery</h1>
          <p className="slide-subtitle">Serious Business Outcomes as a Side Effect of Play</p>
          
          <div style={{ fontSize: '1.3rem', color: 'rgba(255, 255, 255, 0.9)', margin: '2rem 0', lineHeight: '1.6' }}>
            When we tested it, people loved the playfulness and daily engagement.<br/><br/>
            But recruiters, researchers, and PMs themselves gave us unexpected feedback:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', margin: '3rem 0' }}>
            <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '2rem', borderRadius: '20px', borderLeft: '4px solid #667eea' }}>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#ffffff' }}>
                "This is the skill we can't measure in interviews."
              </p>
            </div>
            <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '2rem', borderRadius: '20px', borderLeft: '4px solid #667eea' }}>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#ffffff' }}>
                "If you captured this data, we'd pay for it."
              </p>
            </div>
            <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '2rem', borderRadius: '20px', borderLeft: '4px solid #667eea' }}>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#ffffff' }}>
                "This could train AI models on real reasoning."
              </p>
            </div>
          </div>

          <div className="quote">
            "We didn't set out to build a business. We set out to build a game... But we discovered this game captures the hardest things to measure: reasoning, strategy, product sense. That's the magic of iterate."
          </div>
        </div>
      </div>

      {/* Slide 5: Our Mission */}
      <div className={`slide-container ${currentSlide === 5 ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="slide-title">Sharpening Minds in the AI Era</h1>
          <p className="slide-subtitle">AI as Coach, Not Crutch</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', margin: '3rem 0' }}>
            <div style={{ textAlign: 'left', background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.3rem' }}>🎯 Flip the Script</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>You play WITH AI, but you don't offload the hard part. AI becomes a coach, not a crutch—scoring, nudging, and bias-explaining.</p>
            </div>
            
            <div style={{ textAlign: 'left', background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '20px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.3rem' }}>💪 Strengthen Mental Muscles</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Force fast, sharp decision-making under constraints. Strengthen critical thinking, creativity, and bias awareness instead of atrophying them.</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat">
              <div className="stat-number">&lt; 1%</div>
              <div className="stat-label">Score perfect 10/10 on all challenges</div>
            </div>
            <div className="stat">
              <div className="stat-number">47s</div>
              <div className="stat-label">Average time to complete all challenges</div>
            </div>
            <div className="stat">
              <div className="stat-number">89%</div>
              <div className="stat-label">Come back tomorrow for another round</div>
            </div>
          </div>

          <div className="quote">
            "While most AI tools risk dulling our minds, we're building iterate to sharpen them. We want PMs who can think critically, creatively, and ethically WITH AI, not BECAUSE of it."
          </div>
        </div>
      </div>

      {/* Slide 6: The Solution */}
      <div className={`slide-container ${currentSlide === 6 ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="slide-title">The Solution: Iterate</h1>
          <p className="slide-subtitle">Play, Learn, Prove</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', margin: '2rem 0' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '20px', textAlign: 'left' }}>
              <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>⚡ Lightning Fast</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Daily session = 4 scenarios, each under 1 minute. No signup required for anonymous play.</p>
            </div>
            
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '20px', textAlign: 'left' }}>
              <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🧠 AI-Powered Scoring</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Instant feedback with multi-dimensional "PM DNA" profile. Objective analysis of thinking patterns.</p>
            </div>
            
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '20px', textAlign: 'left' }}>
              <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🏆 Competitive Edge</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Leaderboard with Quadratic Voting. Players use daily tokens to vote on top answers.</p>
            </div>
            
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2rem', borderRadius: '20px', textAlign: 'left' }}>
              <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>📊 Real-World Impact</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>End-of-day solutions, explanations, and real-world applicability. Learn from the best.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 7: Tech Stack */}
      <div className={`slide-container ${currentSlide === 7 ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="slide-title">Modern AI Stack</h1>
          <p className="slide-subtitle">Built with Cutting-Edge Tools</p>
          
          <div className="tech-grid">
            <div className="tech-item">
              <h4>Windsurf</h4>
              <p>Core flows & rapid development</p>
            </div>
            <div className="tech-item">
              <h4>Rocket.new</h4>
              <p>High-fidelity wireframes</p>
            </div>
            <div className="tech-item">
              <h4>Claude</h4>
              <p>Strategy brainstorming & analysis</p>
            </div>
            <div className="tech-item">
              <h4>Gemini</h4>
              <p>Game mechanics APIs</p>
            </div>
            <div className="tech-item">
              <h4>ChatGPT</h4>
              <p>Scoring engine</p>
            </div>
            <div className="tech-item">
              <h4>Perplexity</h4>
              <p>Research & knowledge grounding</p>
            </div>
            <div className="tech-item">
              <h4>NotebookLM</h4>
              <p>Synthesis & condensing</p>
            </div>
            <div className="tech-item">
              <h4>DSPy + Opik</h4>
              <p>Prompt tuning & evaluations</p>
            </div>
          </div>

          <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '2rem', borderRadius: '20px', margin: '2rem 0' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🤖 Underlying Philosophy</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Leveraging LLMs as <strong>"Creator Agents"</strong> to generate puzzles and <strong>"Judge Agents"</strong> to score answers consistently.
            </p>
          </div>
        </div>
      </div>

      {/* Slide 8: Business Outcomes */}
      <div className={`slide-container ${currentSlide === 8 ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="slide-title">Business Outcomes</h1>
          <p className="slide-subtitle">The Side Effects of Play</p>
          
          <div className="outcomes-grid">
            <div className="outcome-card">
              <h3>For PMs</h3>
              <ul>
                <li>Playful daily practice leads to self-awareness</li>
                <li>Skill growth through real scenarios</li>
                <li>Shareable portfolio of validated decisions</li>
                <li>MVPM bragging rights</li>
              </ul>
            </div>
            
            <div className="outcome-card">
              <h3>For Organizations</h3>
              <ul>
                <li>Hire PMs based on what they DO, not what they SAY</li>
                <li>Anonymized PM DNA Profiles for objective assessment</li>
                <li>Community-sourced decision vetting</li>
                <li>Internal L&D and skills assessment</li>
              </ul>
            </div>
            
            <div className="outcome-card">
              <h3>For AI Research</h3>
              <ul>
                <li>Anonymized reasoning traces dataset</li>
                <li>Decision-making under pressure data</li>
                <li>Bias awareness training data</li>
                <li>License data to AI labs for PM-focused copilots</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 9: Future Vision */}
      <div className={`slide-container ${currentSlide === 9 ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="slide-title">Future: The Reasoning Gym</h1>
          <p className="slide-subtitle">Beyond the MVP</p>
          
          <div className="coming-soon-scroll">
            <div className="pipeline-item">
              <span className="status-badge">Coming Soon</span>
              <h4>Rule Seeker</h4>
              <p>Find patterns. Test hypotheses. Watch confirmation bias destroy you.</p>
            </div>
            <div className="pipeline-item">
              <span className="status-badge">Coming Soon</span>
              <h4>Ethics Toggle</h4>
              <p>Privacy vs profit. User safety vs growth. Define yourself.</p>
            </div>
            <div className="pipeline-item">
              <span className="status-badge">Coming Soon</span>
              <h4>Prompt Design Puzzle</h4>
              <p>Get AI to do exactly what you want. Harder than it sounds.</p>
            </div>
            <div className="pipeline-item">
              <span className="status-badge">Coming Soon</span>
              <h4>Fallacy Finder</h4>
              <p>Spot logical traps in product arguments. Your reasoning under fire.</p>
            </div>
          </div>

          <div style={{ margin: '3rem 0', textAlign: 'left' }}>
            <h3 style={{ color: '#667eea', marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'center' }}>🏢 Enterprise Arsenal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '15px' }}>
                <h4 style={{ color: '#4facfe', marginBottom: '0.5rem' }}>Recruiter Command Center</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Stop guessing. Start knowing. Candidate PM DNA profiles with surgical precision.</p>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '15px' }}>
                <h4 style={{ color: '#4facfe', marginBottom: '0.5rem' }}>Team Battle Royale</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Private company challenges. Your real problems. Your team's collective genius.</p>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '15px' }}>
                <h4 style={{ color: '#4facfe', marginBottom: '0.5rem' }}>Decision Science Lab</h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>Your reasoning patterns fuel the future of product decision-making.</p>
              </div>
            </div>
          </div>

          <div className="quote">
            "For PMs: More than practice—a blueprint for mastery.<br/>
            For Recruiters: Finally measure 'product sense,' not just resumes.<br/>
            For the World: Fun → insight → better products → better decisions."
          </div>
        </div>
      </div>

      {/* Slide 10: Call to Action */}
      <div className={`slide-container ${currentSlide === 10 ? 'active' : ''}`}>
        <div className="slide-content">
          <h1 className="slide-title">Ready to Prove You're MVPM?</h1>
          <p className="slide-subtitle">Let's Make Hiring Smarter, Learning Fun, and AI More Human</p>
          
          <div style={{ margin: '3rem 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', margin: '3rem 0' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.5rem' }}>🎮 Try It Now</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem' }}>Five minutes. Four challenges. One chance to prove you've got what it takes.</p>
                <a href="/" className="cta-button">Start the Challenge</a>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '1rem' }}>✓ No signup required ✓ Anonymous play ✓ Instant results</p>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#667eea', marginBottom: '1rem', fontSize: '1.5rem' }}>🚀 Join Waitlist</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem' }}>Be first to arm your organization with MVPM intelligence</p>
                <a href="/" className="cta-button">Get Early Access</a>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '1rem' }}>✓ Enterprise features ✓ Team battles ✓ Custom challenges</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(102, 126, 234, 0.1)', padding: '2rem', borderRadius: '20px', margin: '3rem 0' }}>
            <h3 style={{ color: '#667eea', marginBottom: '1rem' }}>🏆 Think You Can Challenge Your CPO?</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Share your MVPM score and see if your leadership has what it takes. Most don't.
            </p>
          </div>

          <div style={{ marginTop: '4rem', fontSize: '1.1rem' }}>
            <p style={{ color: '#667eea', marginBottom: '1rem' }}>📧 Contact: kishoradityasc@gmail.com</p>
            <p style={{ color: '#667eea', marginBottom: '1rem' }}>🔗 Demo: https://mvpm.onrender.com/</p>
            <p style={{ color: '#667eea' }}>💻 GitHub: https://github.com/Kishoraditya/mvpm</p>
          </div>

          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginTop: '3rem' }}>
            Where product legends are born, one challenge at a time.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="slide-nav">
        <button 
          className="nav-btn" 
          onClick={prevSlide}
          disabled={currentSlide === 1}
        >
          ← Prev
        </button>
        
        {Array.from({ length: totalSlides }, (_, i) => i + 1).map(slideNum => (
          <button
            key={slideNum}
            className={`nav-btn ${currentSlide === slideNum ? 'active' : ''}`}
            onClick={() => goToSlide(slideNum)}
          >
            {slideNum}
          </button>
        ))}
        
        <button 
          className="nav-btn" 
          onClick={nextSlide}
          disabled={currentSlide === totalSlides}
        >
          Next →
        </button>
      </div>
    </>
  );
}
