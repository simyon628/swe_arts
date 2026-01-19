import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { categories } from '../cms/cms';

export const HeroPinterest = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextCategory = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % categories.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(nextCategory, 5000); // Cycle every 5 seconds
        return () => clearInterval(interval);
    }, [nextCategory]);

    const currentCategory = categories[activeIndex];

    // Exactly 7 columns, 2 rows = 14 items
    const totalItems = 14;
    const gridItems = [...currentCategory.images];
    while (gridItems.length < totalItems) {
        gridItems.push(...currentCategory.images);
    }
    const finalItems = gridItems.slice(0, totalItems);

    return (
        <section className="relative h-[90vh] min-h-[700px] flex flex-col items-center justify-start overflow-hidden bg-[#F8F6F2] select-none pt-24">
            {/* 1. Static Text Container (Above Grid) */}
            <div className="relative z-50 text-center mb-[clamp(1rem,4vh,3rem)] pointer-events-none w-full px-6 flex flex-col items-center">
                <span className="text-[clamp(14px,1.5vw,18px)] font-black text-charcoal/40 tracking-[0.4em] uppercase mb-4">
                    Get your next
                </span>
                <div className="relative h-[clamp(60px,10vw,90px)] w-full overflow-hidden flex justify-center items-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentCategory.id}
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: '0%', opacity: 1 }}
                            exit={{ y: '-100%', opacity: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute block text-[clamp(48px,8vw,72px)] font-black text-[#C9A24D] tracking-tighter italic leading-none whitespace-nowrap"
                        >
                            {currentCategory.name}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            {/* 2. Controlled Row Slicing Grid */}
            <div className="relative w-full max-w-[2400px] px-[clamp(1rem,5vw,4rem)] flex flex-col gap-[clamp(0.5rem,2vw,1.5rem)] opacity-90 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCategory.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="flex flex-col gap-[clamp(0.5rem,2vw,1.5rem)]"
                    >
                        {/* Row 1: Strictly Indices 1, 2, 6, 7 */}
                        <div className="grid grid-cols-4 gap-[clamp(0.5rem,2vw,1.5rem)] max-w-5xl mx-auto w-full">
                            {[0, 1, 5, 6].map((poolIdx, idx) => {
                                const img = finalItems[poolIdx];
                                return (
                                    <motion.div
                                        key={`row1-${idx}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: idx % 2 === 0 ? 0 : -10 }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className="rounded-[18px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-charcoal/5"
                                        style={{ height: 'clamp(200px, 18vw, 240px)' }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ repeat: Infinity, duration: 8 + idx, ease: "easeInOut" }}
                                            className="w-full h-full"
                                        >
                                            <img src={typeof img === 'string' ? img : (img as any).src} alt="" className="w-full h-full object-cover" />
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Row 2+: Flowing Remaining Items */}
                        <div className="grid grid-cols-7 gap-[clamp(0.5rem,2vw,1.5rem)] w-full">
                            {[2, 3, 4, 7, 8, 9, 10, 11, 12, 13].slice(0, 7).map((poolIdx, idx) => {
                                const img = finalItems[poolIdx];
                                const colOffsets = [0, -6, 6, -6, 6, -6, 0];
                                return (
                                    <motion.div
                                        key={`row2-${idx}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: colOffsets[idx] }}
                                        transition={{ duration: 1, delay: 0.4 + idx * 0.05 }}
                                        className="rounded-[18px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] bg-charcoal/5"
                                        style={{ height: 'clamp(180px, 16vw, 220px)' }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ repeat: Infinity, duration: 7 + idx, ease: "easeInOut" }}
                                            className="w-full h-full"
                                        >
                                            <img src={typeof img === 'string' ? img : (img as any).src} alt="" className="w-full h-full object-cover" />
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 3. Bottom Gradient Curve Layer */}
            <div
                className="absolute bottom-0 left-0 w-full h-[180px] pointer-events-none z-20"
                style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(248, 246, 242, 0.35), #F8F6F2)'
                }}
            />

            {/* Scroll Indicator */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={() => {
                    const nextSection = document.getElementById('top-rated');
                    if (nextSection) {
                        const offset = 80; // Navbar height
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = nextSection.getBoundingClientRect().top;
                        window.scrollTo({ top: (elementRect - bodyRect) - offset, behavior: 'smooth' });
                    }
                }}
                className="absolute bottom-[90px] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 group cursor-pointer"
            >
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal/30 group-hover:border-[#C9A24D] group-hover:text-[#C9A24D] transition-all bg-white/20 backdrop-blur-sm"
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </div>
            </motion.button>
        </section>
    );
};
