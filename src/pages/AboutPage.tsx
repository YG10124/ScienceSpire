interface AboutPageProps {
  onNavigate: (page: 'signup' | 'signin') => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="rounded-2xl border p-6 lg:p-8" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>
          ScienceSpire is a real learning workspace, not a demo shell.
        </h1>
        <p className="mt-3 text-sm lg:text-base" style={{ color: 'var(--text-secondary)' }}>
          Students use one environment for scheduling sessions, studying with resources, collaborating in channels, and publishing portfolio work.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('signup')}
            className="px-5 py-3 rounded-xl text-sm font-semibold min-h-[44px]"
            style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
          >
            Sign up
          </button>
          <button
            onClick={() => onNavigate('signin')}
            className="px-5 py-3 rounded-xl text-sm font-semibold border min-h-[44px]"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Sign in
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Learning Flow', body: 'Explore science tracks, join sessions, and keep momentum with personalized recommendations.' },
          { title: 'Hands-On Practice', body: 'Use quizzes, notes, and project artifacts to build durable understanding.' },
          { title: 'Community Support', body: 'Ask questions in channels, join groups, and share progress with peers.' },
        ].map(card => (
          <article key={card.title} className="rounded-xl border p-4" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>{card.title}</h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{card.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
