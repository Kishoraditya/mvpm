'use client';

import GameCard from '@/components/ui/GameCard';
import appConfig from '@/lib/config';

export default function GamesSection() {
  const games = [
    {
      id: 'stakeholder_sandwich',
      title: 'Stakeholder Sandwich',
      description: '45 seconds. One impossible request. Your reputation on the line. Draft the perfect response.',
      timer: 'BRUTAL 45s -- Try this first',
      href: '/games/stakeholder-sandwich'
    },
    {
      id: 'sprint_simulator',
      title: 'Sprint Simulator',
      description: 'Navigate 10 days of PM chaos. Balance stakeholders, team morale, and delivery commitments.',
      timer: 'STRATEGIC 5min',
      href: '/games/sprint-simulator'
    },
    {
      id: 'assumption_sniper',
      title: 'Assumption Sniper',
      description: 'Hunt down 3 deadly assumptions that could tank this feature launch. Your PM instincts on trial.',
      timer: 'SURGICAL 40s',
      href: '/games/assumption-sniper'
    },
    {
      id: 'chart_in_20',
      title: 'Chart-in-20',
      description: '20 seconds to read a chart. Keep or kill? Your call could make or break the quarter.',
      timer: 'LIGHTNING 20s',
      href: '/games/chart-in-20'
    }
  ];

  const enabledGames = games.filter((g) => appConfig.getFeatureFlag(`games.${g.id}`, true));

  return (
    <section id="games" className="games-section">
      <h2 className="section-title">The Daily Gauntlet</h2>
      
      <div className="games-grid">
        {enabledGames.map((game, index) => (
          <GameCard
            key={game.id}
            gameId={game.id}
            title={game.title}
            description={game.description}
            timer={game.timer}
            href={game.href}
            index={index}
          />
        ))}
      </div>

      <div className="challenge-cpo">
        <h3>🏆 Think You Can Challenge Your CPO?</h3>
        <p>Share your MVPM score and see if your leadership has what it takes. Most don't.</p>
      </div>
    </section>
  )
}
