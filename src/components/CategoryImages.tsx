
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryImagesProps {
    images: string[];
    activeIndex: number;
}

export const CategoryImages: React.FC<CategoryImagesProps> = ({ images, activeIndex }) => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeIndex}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {images.map((img, idx) => (
                        <motion.div
                            key={`${activeIndex}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.6,
                                delay: idx * 0.1,
                                ease: "easeOut"
                            }}
                            className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl"
                        >
                            <img
                                src={img}
                                alt="category-art"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
