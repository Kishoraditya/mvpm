'use client';

import { useParallax, useTypingAnimation } from '@/hooks/useScrollEffects';
import CTAButton from '@/components/ui/CTAButton';

const HeroSection = () => {
  const parallaxOffset = useParallax(0.3);
  const { displayText } = useTypingAnimation(
    "Most Valuable Product Manager isn't just a title—it's earned through split-second decisions, razor-sharp thinking, and the ability to thrive under pressure.",
    30,
    1000
  );

  return (
    <section 
      className="hero"
      style={{
        transform: `translateY(${parallaxOffset}px)`
      }}
    >
      <div className="hero-content">
        <h1>iterate</h1>
        <p className="tagline">The Blueprint for Product Excellence</p>
        <p className="challenge-text">Do You Have What It Takes to Be MVPM?</p>
        <p className="hero-subtitle">{displayText}</p>
        <CTAButton href="#games" location="hero">
          Prove It in 5 Minutes
        </CTAButton>
        <p className="quick-play">✓ No signup required • Just pure challenge</p>
      </div>
    </section>
  );
};

export default HeroSection;
