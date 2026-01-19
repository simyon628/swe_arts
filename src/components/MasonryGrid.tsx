
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../cms/cms';

interface MasonryGridProps {
    category: Category;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ category }) => {
    return (
        <div className="w-full px-4 md:px-8 pb-32 overflow-hidden">
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 [column-fill:_balance] w-full max-w-[2400px] mx-auto">
                <AnimatePresence mode="popLayout">
                    {category.images.map((img: any, idx: number) => (
                        <motion.div
                            key={`${category.id}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{
                                duration: 0.7,
                                ease: [0.23, 1, 0.32, 1],
                                delay: idx * 0.04
                            }}
                            className="relative mb-[clamp(1rem,3vw,1.5rem)] break-inside-avoid rounded-[clamp(1rem,2vw,2rem)] overflow-hidden group cursor-pointer bg-gray-50 border border-gray-100/50 shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            <div
                                style={{ aspectRatio: img.aspectRatio }}
                                className="w-full bg-gray-200"
                            >
                                <img
                                    src={img.src}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>

                            {/* Premium Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
                                <div className="flex justify-end">
                                    <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                                        Save
                                    </button>
                                </div>
                                <div className="flex items-center justify-between text-white/90">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md" />
                                        <span className="text-xs font-bold truncate max-w-[100px]">{category.name}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
