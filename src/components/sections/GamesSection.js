'use client';

import GameCard from '@/components/ui/GameCard';

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
      id: 'chart_in_10',
      title: 'Chart-in-10',
      description: '10 seconds to read a chart. Keep or kill? Your call could make or break the quarter.',
      timer: 'LIGHTNING 10s'
    },
    {
      id: 'assumption_sniper',
      title: 'Assumption Sniper',
      description: 'Find exactly 3 hidden assumptions that could tank this feature. Miss one, pay the price.',
      timer: 'SURGICAL 40s'
    },
    {
      id: 'sprint_simulator',
      title: 'Sprint Simulator',
      description: '5-week product sprint compressed into split-second decisions. Ship or sink.',
      timer: 'CHAOS 5min'
    }
  ];

  return (
    <section id="games" className="games-section">
      <h2 className="section-title">The Daily Gauntlet</h2>
      
      <div className="games-grid">
        {games.map((game, index) => (
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
