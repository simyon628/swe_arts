import React, { useState, useEffect, useCallback } from 'react';
import { categories } from '../cms/cms';
import { KineticHeading } from '../components/KineticHeading';
import { MasonryGrid } from '../components/MasonryGrid';
import { ArtistSection } from '../components/ArtistSection';
import { CategorySection } from '../components/CategorySection';

interface LandingPageProps {
    onSignup?: () => void;
    isHomeView?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignup, isHomeView = false }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(!isHomeView);

    const nextCategory = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % categories.length);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(nextCategory, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextCategory]);

    const handleCategoryClick = (index: number) => {
        setIsAutoPlaying(false);
        setActiveIndex(index);
        if (!isHomeView) {
            setTimeout(() => setIsAutoPlaying(true), 10000);
        }
    };

    return (
        <main className={`min-h-screen w-full transition-colors duration-1000 ${isHomeView ? 'bg-white' : 'bg-white'}`}>
            {!isHomeView ? (
                <div className="flex flex-col">
                    <section className="min-h-screen flex flex-col items-center justify-center pt-20">
                        <KineticHeading
                            categories={categories}
                            activeIndex={activeIndex}
                            onCategoryClick={handleCategoryClick}
                        />
                    </section>

                    <CategorySection />

                    <section className="py-24 px-6 md:px-12 bg-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col md:flex-row items-center gap-16">
                                <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl">
                                    <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800" className="w-full h-full object-cover" alt="Art Showcase" />
                                </div>
                                <div className="w-full md:w-1/2 space-y-6">
                                    <h2 className="text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-tight">Art that moves <br /> with your rhythm.</h2>
                                    <p className="text-gray-500 font-medium text-lg leading-relaxed">
                                        We believe art isn't just a decoration; it's a vibration. Our artists create textures and patterns that synchronize with contemporary living.
                                    </p>
                                    <button
                                        onClick={onSignup}
                                        className="bg-red-600 hover:bg-black text-white px-10 py-4 text-sm font-black rounded-full transition-all duration-300 uppercase tracking-widest shadow-xl shadow-red-600/20"
                                    >
                                        Start your journey
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <ArtistSection />
                </div>
            ) : (
                <div className="pt-24 min-h-screen">
                    <div className="max-w-[2000px] mx-auto">
                        <div className="px-6 md:px-12 mb-12">
                            <h2 className="text-4xl md:text-5xl font-black text-charcoal mb-4 tracking-tighter">
                                Explore your inspiration
                            </h2>
                            <div className="flex flex-wrap gap-3 mt-8">
                                {categories.map((cat, idx) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(idx)}
                                        className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeIndex === idx
                                            ? 'bg-charcoal text-white shadow-xl'
                                            : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <MasonryGrid
                            category={categories[activeIndex]}
                        />
                    </div>
                </div>
            )}

            {/* Scroll Indicator (Only on Splash) */}
            {!isHomeView && (
                <div className="fixed bottom-12 right-12 flex flex-col items-center gap-4 text-charcoal/20 animate-bounce pointer-events-none z-50">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black rotate-90 origin-right translate-y-12 whitespace-nowrap">Scroll Discovery</span>
                    <div className="w-[1px] h-16 bg-charcoal/20" />
                </div>
            )}
        </main>
    );
};
