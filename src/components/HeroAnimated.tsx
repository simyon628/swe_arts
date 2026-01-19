
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '../cms/cms';

interface HeroAnimatedProps {
    category: Category;
}

export const HeroAnimated: React.FC<HeroAnimatedProps> = ({ category }) => {
    return (
        <div className="flex flex-col items-center text-center space-y-4 pt-20">
            <span className="text-xl md:text-2xl font-medium text-gray-500 tracking-tight">
                Get your next
            </span>
            <div className="h-[60px] md:h-[100px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={category.id}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        style={{ color: category.color }}
                        className="text-4xl md:text-7xl font-black tracking-tight"
                    >
                        {category.name}
                    </motion.h1>
                </AnimatePresence>
            </div>
        </div>
    );
};
