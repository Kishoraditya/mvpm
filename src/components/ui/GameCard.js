'use client';

import { useInViewAnimation } from '@/hooks/useScrollEffects';
import { useAnalytics } from '@/hooks/useAnalytics';
import { trackGameInteraction } from '@/lib/supabase';
import Link from 'next/link';

const GameCard = ({ 
  gameId, 
  title, 
  description, 
  timer, 
  href, 
  index,
  className = '' 
}) => {
  const { ref, inView } = useInViewAnimation();
  const { trackGameClick, trackEvent } = useAnalytics();

  const handleClick = () => {
    // Track analytics
    trackGameClick(gameId, title);
    trackEvent('game_card_interaction', {
      game_title: title,
      game_timer: timer,
      position: index + 1
    });

    // Track in Supabase
    trackGameInteraction(gameId, 'click', {
      game_title: title,
      game_timer: timer,
      position: index + 1
    });
  };

  const cardContent = (
    <div 
      ref={ref}
      className={`game-card ${inView ? 'animate-fade-in-up' : 'opacity-0 translate-y-5'} ${className}`}
      onClick={handleClick}
      style={{
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        transitionDelay: `${index * 0.1}s`
      }}
    >
      <span className="game-timer">{timer}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  if (href) {
    // Check if it's an internal link (starts with /)
    const isInternalLink = href.startsWith('/');
    
    if (isInternalLink) {
      return (
        <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
          {cardContent}
        </Link>
      );
    } else {
      return (
        <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
          {cardContent}
        </a>
      );
    }
  }

  return cardContent;
};

export default GameCard;
