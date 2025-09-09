'use client';

import { useState } from 'react';
import { useInViewAnimation } from '@/hooks/useScrollEffects';

const FAQSection = () => {
  const { ref: sectionRef, inView: sectionInView } = useInViewAnimation();
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "What is The PM Game?",
      answer: "The PM Game is a strategic product management training platform featuring micro-games that test real PM skills. Face time-pressured scenarios, get AI-powered feedback, and prove you have what it takes to be the Most Valuable Product Manager."
    },
    {
      question: "How does the scoring system work?",
      answer: "Each game has its own scoring criteria: Stakeholder Sandwich scores based on strategy, empathy, and clarity (0-2 points each). Sprint Simulator evaluates delivery ratio and team balance. Chart in 10 rewards perfect chart selection (2pts), reasonable choices (1pt), plus speed bonuses. All games track your performance over time."
    },
    {
      question: "What games are currently available?",
      answer: "We have four core games: Stakeholder Sandwich (45-second stakeholder management scenarios), Sprint Simulator (60-second sprint planning challenges), Assumption Sniper (hypothesis validation under pressure), and Chart in 10 (rapid business chart analysis). More games are coming soon!"
    },
    {
      question: "Is this suitable for beginners or experienced PMs?",
      answer: "The games are designed for all skill levels. Beginners learn core PM concepts through practical scenarios, while experienced PMs can test their instincts and discover blind spots. The AI feedback helps everyone improve regardless of their starting point."
    },
    {
      question: "How is this different from other PM training?",
      answer: "Unlike traditional courses, we focus on split-second decision-making under pressure—the reality of PM work. Our AI judges provide instant, personalized feedback on strategy, empathy, and execution. Plus, it's actually fun and takes less than 2 minutes per session."
    },
    {
      question: "Can I track my progress over time?",
      answer: "Yes! We track your scores, improvement trends, and performance across different PM skills. You'll see your Product DNA profile emerge as you play, showing your strengths in areas like strategic thinking, stakeholder management, and data analysis."
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. We use enterprise-grade security with Supabase backend. Your gameplay data helps improve the AI feedback system, but all personal information remains private. You control what you share and can delete your data anytime."
    },
    {
      question: "Will there be multiplayer or team features?",
      answer: "Coming soon! We're building team challenges, company leaderboards, and collaborative scenarios. Imagine sprint planning games with your actual team or competing against other product teams. The future is multiplayer PM training."
    },
    {
      question: "How often should I play?",
      answer: "We recommend daily 2-minute sessions to build PM muscle memory. Like Wordle for product thinking—short, engaging, and habit-forming. Consistency beats intensity when building decision-making skills under pressure."
    },
    {
      question: "Are there plans for mobile apps?",
      answer: "The current web version works great on mobile, but native iOS and Android apps are in development. We want to make it even easier to squeeze in a quick PM challenge during your commute or coffee break."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Everything you need to know about The PM Game</p>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`faq-item ${openFAQ === index ? 'open' : ''}`}
              style={{
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openFAQ === index}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">{openFAQ === index ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta">
          <p>Still have questions?</p>
          <a href="#signup" className="cta-button">Join the Waitlist</a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
