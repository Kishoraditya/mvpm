'use client';

import { useInViewAnimation } from '@/hooks/useScrollEffects';

const HowItWorksSection = () => {
  const { ref: sectionRef, inView: sectionInView } = useInViewAnimation();

  const steps = [
    {
      number: 1,
      title: "Face the Challenge",
      description: "Four brutal micro-simulations. Real scenarios. Real pressure. No mercy."
    },
    {
      number: 2,
      title: "Get Judged (Harshly)",
      description: "AI judges your every word. Strategy, empathy, clarity, speed—nothing escapes scrutiny."
    },
    {
      number: 3,
      title: "Claim Your Throne",
      description: "Leaderboard glory, bragging rights, and proof you've got what it takes to be MVPM."
    }
  ];

  const stats = [
    {
      number: "< 1%",
      label: "Score perfect 10/10 on all challenges"
    },
    {
      number: "47s",
      label: "Average time to complete all challenges"
    },
    {
      number: "89%",
      label: "Come back tomorrow for another round"
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works" ref={sectionRef}>
      <h2 className="section-title">How the Magic Happens</h2>
      
      <div className="steps-grid">
        {steps.map((step, index) => (
          <div 
            key={step.number}
            className="step"
            style={{
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: `${index * 0.2}s`
            }}
          >
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      <div className="stats">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="stat"
            style={{
              opacity: sectionInView ? 1 : 0,
              transform: sectionInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
              transitionDelay: `${(index + 3) * 0.2}s`
            }}
          >
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
