import { useState } from 'react';
import { FlaskConical, Atom, Beaker, Eye, EyeOff, ArrowRight, Globe, Dna } from 'lucide-react';
import { useLocalStore, type ScienceSubject } from '../store/useLocalStore';

interface AuthPageProps {
    onAuthSuccess: () => void;
    onGoHome?: () => void;
    initialTab?: 'signin' | 'signup';
}

const SUBJECTS: { id: ScienceSubject; label: string; Icon: typeof Atom }[] = [
    { id: 'Physics', label: 'Physics', Icon: Atom },
    { id: 'Chemistry', label: 'Chemistry', Icon: FlaskConical },
    { id: 'Biology', label: 'Biology', Icon: Dna },
    { id: 'Earth Science', label: 'Earth Science', Icon: Globe },
];

const LEVELS = ['Middle School', 'High School', 'College', 'Graduate', 'Self-taught'];

export default function AuthPage({ onAuthSuccess, onGoHome, initialTab = 'signin' }: AuthPageProps) {
    const { signUp, signInWithCredentials } = useLocalStore();
    const [tab, setTab] = useState<'signin' | 'signup'>(initialTab);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Sign in state
    const [siEmail, setSiEmail] = useState('');
    const [siPass, setSiPass] = useState('');

    // Sign up state
    const [suUsername, setSuUsername] = useState('');
    const [suEmail, setSuEmail] = useState('');
    const [suPass, setSuPass] = useState('');
    const [suPrefs, setSuPrefs] = useState<ScienceSubject[]>([]);
    const [suLevel, setSuLevel] = useState('High School');

    const togglePref = (s: ScienceSubject) => {
        setSuPrefs(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            const result = signInWithCredentials(siEmail, siPass);
            setLoading(false);
            if (result.success) onAuthSuccess();
            else setError(result.error ?? 'Sign in failed');
        }, 400);
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!suUsername.trim()) { setError('Username is required.'); return; }
        if (!suEmail.includes('@')) { setError('Enter a valid email.'); return; }
        if (suPass.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (suPrefs.length === 0) { setError('Select at least one science subject.'); return; }
        setLoading(true);
        setTimeout(() => {
            const result = signUp(suUsername.trim(), suEmail.trim(), suPass, suPrefs, suLevel);
            setLoading(false);
            if (result.success) onAuthSuccess();
            else setError(result.error ?? 'Sign up failed');
        }, 400);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg)' }}>
            <div className="w-full max-w-md animate-scale-in">
                {/* Logo - clickable to go home */}
                <div className="text-center mb-8">
                    <button
                        type="button"
                        onClick={onGoHome}
                        className="inline-flex flex-col items-center gap-2 focus:outline-none rounded-xl transition-opacity hover:opacity-90"
                        aria-label="Back to homepage"
                    >
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: 'var(--brand)' }}
                        >
                            <Beaker size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]" style={{ color: 'var(--text)' }}>
                                ScienceSpire
                            </h1>
                            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                Student science hub
                            </p>
                        </div>
                    </button>
                </div>

                {/* Card */}
                <div className="rounded-3xl border p-8 shadow-2xl"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>

                    {/* Tab switcher */}
                    <div className="flex rounded-xl p-1 mb-8" style={{ backgroundColor: 'var(--card-alt)' }}>
                        {(['signin', 'signup'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => { setTab(t); setError(''); }}
                                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                                style={{
                                    backgroundColor: tab === t ? 'var(--brand)' : 'transparent',
                                    color: tab === t ? '#fff' : 'var(--text-secondary)',
                                    boxShadow: tab === t ? '0 2px 8px var(--brand-bg)' : 'none',
                                }}
                            >
                                {t === 'signin' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl text-sm animate-fade-in"
                            style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--error)', border: '1px solid rgba(248,113,113,0.25)' }}>
                            {error}
                        </div>
                    )}

                    {tab === 'signin' ? (
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <Field label="Email" type="email" value={siEmail} onChange={setSiEmail} placeholder="you@example.com" />
                            <PasswordField label="Password" value={siPass} onChange={setSiPass} show={showPassword} onToggle={() => setShowPassword(p => !p)} />
                            <SubmitBtn loading={loading} label="Sign In" />
                            <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                                Don't have an account?{' '}
                                <button type="button" onClick={() => { setTab('signup'); setError(''); }}
                                    className="font-semibold" style={{ color: 'var(--brand)' }}>
                                    Sign up free
                                </button>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <Field label="Username" type="text" value={suUsername} onChange={setSuUsername} placeholder="sciencewhiz42" />
                            <Field label="Email" type="email" value={suEmail} onChange={setSuEmail} placeholder="you@example.com" />
                            <PasswordField label="Password (min 6 chars)" value={suPass} onChange={setSuPass} show={showPassword} onToggle={() => setShowPassword(p => !p)} />

                            <div>
                                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                    Science Interests (select all that apply)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SUBJECTS.map(s => {
                                        const active = suPrefs.includes(s.id);
                                        const Icon = s.Icon;
                                        return (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => togglePref(s.id)}
                                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150"
                                                style={{
                                                    backgroundColor: active ? 'var(--brand-bg)' : 'transparent',
                                                    borderColor: active ? 'var(--brand)' : 'var(--border)',
                                                    color: active ? 'var(--brand)' : 'var(--text-secondary)',
                                                }}
                                            >
                                                <Icon size={16} /> {s.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                                    Level
                                </label>
                                <select
                                    value={suLevel}
                                    onChange={e => setSuLevel(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none"
                                    style={{
                                        backgroundColor: 'var(--card-alt)',
                                        borderColor: 'var(--border)',
                                        color: 'var(--text)',
                                    }}
                                >
                                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>

                            <SubmitBtn loading={loading} label="Create Account" />
                            <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                                Already have an account?{' '}
                                <button type="button" onClick={() => { setTab('signin'); setError(''); }}
                                    className="font-semibold" style={{ color: 'var(--brand)' }}>
                                    Sign in
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2"
                style={{
                    backgroundColor: 'var(--card-alt)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    '--tw-ring-color': 'var(--brand)',
                } as React.CSSProperties}
            />
        </div>
    );
}

function PasswordField({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void }) {
    const id = label.toLowerCase().replace(/\s+/g, '-');
    return (
        <div>
            <label htmlFor={id} className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2.5 pr-10 rounded-xl text-sm border transition-colors focus:outline-none"
                    style={{ backgroundColor: 'var(--card-alt)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[32px] min-h-[32px] flex items-center justify-center"
                    style={{ color: 'var(--text-muted)' }}
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[48px] mt-2 shadow-lg hover:shadow-xl disabled:opacity-60"
            style={{ backgroundColor: 'var(--brand)', color: '#fff' }}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            ) : (
                <>{label}<ArrowRight size={16} /></>
            )}
        </button>
    );
}
