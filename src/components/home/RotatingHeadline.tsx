import { useEffect, useRef, useState } from 'react';

const headlines = [
    { topic: 'Quantum Physics', tagline: 'Explore the strange world of particles and waves' },
    { topic: 'Molecular Biology', tagline: 'Unravel the code of life inside every cell' },
    { topic: 'Astrophysics', tagline: 'Journey through galaxies, stars, and black holes' },
    { topic: 'Chemistry', tagline: 'Discover reactions that shape our world' },
    { topic: 'Geophysics', tagline: 'Decode earthquakes, tectonics, and Earth systems' },
    { topic: 'Neuroscience', tagline: 'Map the billions of connections in your brain' },
    { topic: 'Ecology', tagline: 'Understand the web of life on Earth' },
];

export default function RotatingHeadline() {
    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const prefersReducedMotion = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const restartRotation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (prefersReducedMotion) return;

        intervalRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % headlines.length);
        }, 4200);
    };

    useEffect(() => {
        restartRotation();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [prefersReducedMotion]);

    const current = headlines[activeIndex];

    return (
        <div className="text-center min-h-[120px] flex flex-col items-center justify-center">
            <h2
                key={activeIndex}
                className="text-xl lg:text-2xl font-bold font-[family-name:var(--font-display)] animate-fade-in"
                style={{ color: 'var(--text)' }}
            >
                <span style={{ color: 'var(--brand)' }}>{current.topic}:</span> {current.tagline}
            </h2>

            <div className="flex items-center gap-1.5 mt-4">
                {headlines.map((headline, i) => (
                    <button
                        key={headline.topic}
                        onClick={() => {
                            setActiveIndex(i);
                            restartRotation();
                        }}
                        className="rounded-full transition-all duration-300"
                        style={{
                            width: i === activeIndex ? 20 : 6,
                            height: 6,
                            backgroundColor: i === activeIndex ? 'var(--brand)' : 'var(--border)',
                        }}
                        aria-label={`Go to headline ${i + 1}: ${headline.topic}`}
                    />
                ))}
            </div>
        </div>
    );
}
