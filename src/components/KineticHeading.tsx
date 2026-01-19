
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../cms/cms';

interface KineticHeadingProps {
    categories: Category[];
    activeIndex: number;
    onCategoryClick: (index: number) => void;
}

export const KineticHeading: React.FC<KineticHeadingProps> = ({
    categories,
    activeIndex,
    onCategoryClick
}) => {
    const currentCategory = categories[activeIndex];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-center pt-20 pb-12 px-4 text-center select-none w-full max-w-5xl mx-auto"
        >
            <h1 className="text-[44px] md:text-[72px] lg:text-[90px] font-black text-charcoal tracking-tighter leading-[1] flex flex-col items-center">
                <span className="opacity-90">Get your next</span>
                <div className="relative h-[1.15em] overflow-hidden w-full flex justify-center mt-2 md:mt-4">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentCategory.id}
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: '0%', opacity: 1 }}
                            exit={{ y: '-100%', opacity: 0 }}
                            transition={{
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="absolute inline-block w-full text-center"
                            style={{ color: currentCategory.color }}
                        >
                            {currentCategory.name}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </h1>

            <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
                Discover curated handmade decor and premium textured art from independent artists across the globe. Your space deserves a soul.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                <button className="bg-red-600 hover:bg-black text-white px-8 py-4 text-sm font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-red-600/20 active:scale-95">
                    Explore Collection
                </button>
                <button className="bg-transparent hover:bg-gray-50 text-charcoal border-2 border-gray-200 px-8 py-4 text-sm font-bold rounded-full transition-all duration-300 active:scale-95">
                    Browse Categories
                </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-8 md:gap-16 mt-20 border-t border-gray-100 pt-12 w-full">
                {[
                    { label: 'Artworks', value: '500+' },
                    { label: 'Artists', value: '50+' },
                    { label: 'Collectors', value: '1K+' },
                ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center">
                        <span className="text-2xl md:text-3xl font-black text-charcoal">{stat.value}</span>
                        <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</span>
                    </div>
                ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-4 mt-20 items-center justify-center">
                {categories.map((cat, idx) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryClick(idx)}
                        className="group relative p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-charcoal/20 rounded-full transition-all"
                        aria-label={`Go to category ${cat.name}`}
                    >
                        <div
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-700 ease-in-out ${activeIndex === idx
                                ? 'scale-[1.8] opacity-100 shadow-lg'
                                : 'bg-gray-200 group-hover:bg-gray-400 opacity-50'
                                }`}
                            style={{
                                backgroundColor: activeIndex === idx ? cat.color : undefined,
                                boxShadow: activeIndex === idx ? `0 0 20px ${cat.color}40` : 'none'
                            }}
                        />
                    </button>
                ))}
            </div>
        </motion.div>
    );
};
