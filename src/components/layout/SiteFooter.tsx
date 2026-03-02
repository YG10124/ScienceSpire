import type { AppPage } from '@/config/site';

interface SiteFooterProps {
  onNavigate: (page: AppPage) => void;
  isSignedIn: boolean;
}

const trackLinks = [
  { label: 'Physics', page: 'resources' as const },
  { label: 'Chemistry', page: 'resources' as const },
  { label: 'Biology', page: 'resources' as const },
  { label: 'Earth Science', page: 'resources' as const },
];

export default function SiteFooter({ onNavigate, isSignedIn }: SiteFooterProps) {
  return (
    <footer className="border-t mt-10" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>Science Tracks</h2>
          <div className="space-y-1 text-sm">
            {trackLinks.map(link => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.page)}
                className="block hover:underline underline-offset-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>Platform</h2>
          <div className="space-y-1 text-sm">
            <button onClick={() => onNavigate('resources')} className="block hover:underline underline-offset-2" style={{ color: 'var(--text-secondary)' }}>Resources</button>
            <button onClick={() => onNavigate('community')} className="block hover:underline underline-offset-2" style={{ color: 'var(--text-secondary)' }}>Community</button>
            <button onClick={() => onNavigate('about')} className="block hover:underline underline-offset-2" style={{ color: 'var(--text-secondary)' }}>Help</button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>Legal</h2>
          <div className="space-y-1 text-sm">
            <button onClick={() => onNavigate('about')} className="block hover:underline underline-offset-2" style={{ color: 'var(--text-secondary)' }}>Accessibility</button>
            <button onClick={() => onNavigate('about')} className="block hover:underline underline-offset-2" style={{ color: 'var(--text-secondary)' }}>Privacy</button>
            <button onClick={() => onNavigate('about')} className="block hover:underline underline-offset-2" style={{ color: 'var(--text-secondary)' }}>Terms</button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>Mission</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Built by students, for students of science.
          </p>
          {!isSignedIn && (
            <button
              onClick={() => onNavigate('signup')}
              className="mt-3 px-4 py-2.5 rounded-lg text-sm font-semibold min-h-[44px]"
              style={{ backgroundColor: 'var(--brand)', color: '#FFFFFF' }}
            >
              Create account
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
