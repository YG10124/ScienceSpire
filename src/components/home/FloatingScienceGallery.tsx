/* White sparkly star dots - positioned OUTSIDE center text area, reveal science term on hover */
const SCIENCE_STARS = [
  { term: 'Photosynthesis', x: '4%', y: '8%', delay: 0 },
  { term: 'Mitochondria', x: '92%', y: '12%', delay: 1.2 },
  { term: 'Quantum', x: '6%', y: '72%', delay: 2.5 },
  { term: 'Electron', x: '88%', y: '62%', delay: 0.8 },
  { term: 'Catalyst', x: '12%', y: '35%', delay: 3.2 },
  { term: 'Nebula', x: '82%', y: '38%', delay: 1.8 },
  { term: 'Enzyme', x: '8%', y: '92%', delay: 4 },
  { term: 'Molecule', x: '90%', y: '85%', delay: 2 },
  { term: 'Oxidation', x: '18%', y: '18%', delay: 2.2 },
  { term: 'Genome', x: '78%', y: '78%', delay: 1.5 },
];

function isInTextZone(x: string, y: string): boolean {
  const xNum = parseFloat(x);
  const yNum = parseFloat(y);
  return xNum >= 22 && xNum <= 78 && yNum >= 28 && yNum <= 72;
}

const positionedStars = SCIENCE_STARS.filter(s => !isInTextZone(s.x, s.y));

function StarDot({ term, delay }: { term: string; delay: number }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center group cursor-default"
      title={term}
      role="img"
      aria-label={term}
    >
      <div
        className="w-2 h-2 rounded-full animate-pulse-slow transition-opacity"
        style={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          boxShadow: '0 0 6px rgba(255,255,255,0.9), 0 0 12px rgba(3,105,161,0.25)',
          animationDelay: `${delay}s`,
        }}
      />
      <div
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
        style={{
          backgroundColor: 'var(--card)',
          color: 'var(--text)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          border: '1px solid var(--border)',
        }}
      >
        {term}
      </div>
    </div>
  );
}

export default function FloatingScienceGallery() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      role="presentation"
    >
      {positionedStars.map((star, i) => (
        <div
          key={i}
          className="absolute w-6 h-6 -ml-3 -mt-3 animate-float pointer-events-auto"
          style={{
            left: star.x,
            top: star.y,
            animationDelay: `${star.delay}s`,
            animationDuration: `${6 + (i % 3)}s`,
          }}
        >
          <StarDot term={star.term} delay={star.delay} />
        </div>
      ))}
    </div>
  );
}
