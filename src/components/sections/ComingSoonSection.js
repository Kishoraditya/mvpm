'use client';

import { useInViewAnimation } from '@/hooks/useScrollEffects';

const ComingSoonSection = () => {
  const { ref: sectionRef, inView: sectionInView } = useInViewAnimation();

  const pipelineGames = [
    {
      title: "Dunning-Kruger Dash",
      description: "Map the gap between your confidence and actual performance. Humbling."
    },
    {
      title: "Rule Seeker",
      description: "Find the pattern. Test your hypothesis. Watch confirmation bias destroy you."
    },
    {
      title: "Ethics Toggle",
      description: "Privacy vs profit. User safety vs growth. Make the call that defines you."
    },
    {
      title: "Prompt Design Puzzle",
      description: "Get AI to do exactly what you want. Harder than it sounds."
    },
    {
      title: "Fallacy Finder",
      description: "Spot the logical traps in product arguments. Your reasoning under fire."
    }
  ];

  const enterpriseFeatures = [
    {
      badge: "HIRING SUPERPOWER",
      title: "Recruiter Command Center",
      description: "Stop guessing. Start knowing. Candidate PM DNA profiles with surgical precision."
    },
    {
      badge: "TEAM INTELLIGENCE",
      title: "Team Battle Royale",
      description: "Private company challenges. Your real problems. Your team's collective genius."
    },
    {
      badge: "PRECISION TRAINING",
      title: "Weakness Assassin",
      description: "AI spots your weak spots. Serves micro-drills to obliterate them. No fluff."
    },
    {
      badge: "RESEARCH PARTNER",
      title: "Decision Science Lab",
      description: "Your reasoning patterns fuel the future of product decision-making."
    },
    {
      badge: "CUSTOM CHAOS",
      title: "Crisis Simulator",
      description: "Your industry. Your competitors. Your nightmares. Custom crisis scenarios."
    },
    {
      badge: "STRATEGIC INTEL",
      title: "Executive War Room",
      description: "Aggregate team intelligence. Spot organizational blind spots."
    }
  ];

  return (
    <section id="coming-soon" className="coming-soon" ref={sectionRef}>
      <h2 className="section-title">Coming Soon: Game Pipeline</h2>
      
      <div className="pipeline-games">
        <div className="pipeline-scroll">
          {pipelineGames.map((game, index) => (
            <div 
              key={index}
              className="pipeline-item"
              style={{
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <span className="status-badge coming-soon-badge">Coming Soon</span>
              <h4>{game.title}</h4>
              <p>{game.description}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ textAlign: 'center', margin: '4rem 0 2rem', fontSize: '2rem' }}>
        Enterprise Arsenal
      </h3>
      
      <div className="enterprise-arsenal">
        <div className="enterprise-scroll">
          {enterpriseFeatures.map((feature, index) => (
            <div 
              key={index}
              className="enterprise-item"
              style={{
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: `${(index + pipelineGames.length) * 0.1}s`
              }}
            >
              <span className="status-badge beta-badge-item">{feature.badge}</span>
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoonSection;
