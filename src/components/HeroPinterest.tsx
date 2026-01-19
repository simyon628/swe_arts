import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../cms/cms';

export const HeroPinterest = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const nextCategory = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % categories.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(nextCategory, 5000); // Cycle every 5 seconds
        return () => clearInterval(interval);
    }, [nextCategory]);

    const currentCategory = categories[activeIndex];

    // Prepare grid items
    const totalItems = 14;
    const gridItems = [...currentCategory.images];
    while (gridItems.length < totalItems) {
        gridItems.push(...currentCategory.images);
    }
    const finalItems = gridItems.slice(0, totalItems);

    return (
        <section className="relative h-[82vh] md:h-[90vh] min-h-[600px] flex flex-col items-center justify-start overflow-hidden bg-[#F8F6F2] select-none pt-24">

            {/* 1. Floating Text Container (Positioned at 14% top as requested) */}
            <div className="absolute top-[14%] left-1/2 -translate-x-1/2 z-50 text-center w-full px-6 flex flex-col items-center pointer-events-none">
                <span className="text-[clamp(13px,4vw,15px)] font-black text-charcoal/40 tracking-[0.4em] uppercase mb-4">
                    Get your next
                </span>
                <div className="relative h-[clamp(50px,8vw,80px)] w-full overflow-hidden flex justify-center items-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentCategory.id}
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: '0%', opacity: 1 }}
                            exit={{ y: '-100%', opacity: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => navigate(`/shop?category=${encodeURIComponent(currentCategory.name)}`)}
                            className="absolute block text-[clamp(20px,6vw,32px)] md:text-[clamp(48px,8vw,72px)] font-black text-[#C9A24D] tracking-tighter italic leading-none whitespace-nowrap cursor-pointer hover:scale-105 transition-transform"
                        >
                            {currentCategory.name}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            {/* 2. Controlled Grid Rows */}
            <div className="relative w-full max-w-[2400px] px-3 md:px-[clamp(1rem,5vw,4rem)] flex flex-col opacity-90 pointer-events-none mt-[28vh] md:mt-[15vh]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCategory.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="flex flex-col gap-[10px] md:gap-[clamp(0.5rem,2vw,1.5rem)]"
                    >
                        {/* Row 1: 3 images on mobile, 4 on desktop */}
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-[10px] md:gap-[clamp(0.5rem,2vw,1.5rem)] max-w-5xl mx-auto w-full">
                            {[0, 1, 5, 2].map((poolIdx, idx) => {
                                const isHiddenOnMobile = idx === 3;
                                const img = finalItems[poolIdx];
                                return (
                                    <motion.div
                                        key={`row1-${idx}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: idx % 2 === 0 ? 0 : -8 }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className={`overflow-hidden bg-charcoal/5 ${isHiddenOnMobile ? 'hidden md:block' : ''}`}
                                        style={{
                                            borderRadius: '14px',
                                            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                                            aspectRatio: '3 / 4',
                                            maxHeight: window.innerWidth < 768 ? '150px' : 'none',
                                            height: window.innerWidth < 768 ? 'auto' : 'clamp(200px, 18vw, 240px)'
                                        }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ repeat: Infinity, duration: 8 + idx, ease: "easeInOut" }}
                                            className="w-full h-full"
                                        >
                                            <img src={typeof img === 'string' ? img : (img as any).src} alt="" className="w-full h-full object-cover" />
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Row 2: 4 images on mobile, 7 on desktop (Slightly offset down) */}
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-[10px] md:gap-[clamp(0.5rem,2vw,1.5rem)] w-full mt-[12px] md:mt-0">
                            {[3, 4, 7, 8, 9, 10, 11].map((poolIdx, idx) => {
                                const isHiddenOnMobile = idx >= 4;
                                const img = finalItems[poolIdx];
                                const colOffsets = [0, -6, 6, -6, 6, -6, 0];
                                return (
                                    <motion.div
                                        key={`row2-${idx}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: window.innerWidth < 768 ? 0 : colOffsets[idx] }}
                                        transition={{ duration: 1, delay: 0.4 + idx * 0.05 }}
                                        className={`overflow-hidden bg-charcoal/5 ${isHiddenOnMobile ? 'hidden md:block' : ''}`}
                                        style={{
                                            borderRadius: '14px',
                                            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                                            aspectRatio: '3 / 4',
                                            maxHeight: window.innerWidth < 768 ? '140px' : 'none',
                                            height: window.innerWidth < 768 ? 'auto' : 'clamp(180px, 16vw, 220px)'
                                        }}
                                    >
                                        <motion.div
                                            animate={{ y: [0, -4, 0] }}
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

            {/* Bottom Gradient Curve */}
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
                        const offset = 80;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = nextSection.getBoundingClientRect().top;
                        window.scrollTo({ top: (elementRect - bodyRect) - offset, behavior: 'smooth' });
                    }
                }}
                className="absolute bottom-[40px] md:bottom-[90px] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 group cursor-pointer"
            >
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal/30 group-hover:border-[#C9A24D] group-hover:text-[#C9A24D] transition-all bg-white/20 backdrop-blur-sm shadow-sm"
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </div>
            </motion.button>
        </section>
    );
};
