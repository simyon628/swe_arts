
import React from 'react';
import { motion } from 'framer-motion';
import { categories, Category } from '../cms/cms';

export const CategorySection: React.FC = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight italic">Explore by Spirit</h2>
                    <p className="mt-4 text-gray-500 font-medium max-w-xl mx-auto">Find the art that speaks to your soul. From textured landscapes to rhythmic geometric patterns.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.slice(0, 6).map((cat: Category, idx: number) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative aspect-[16/10] rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <img
                                src={cat.images[0]}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8">
                                <p className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">Collection</p>
                                <h3 className="text-2xl font-black text-white tracking-tight">{cat.name}</h3>
                                <p className="text-white/40 text-sm mt-1 font-medium">{cat.images.length * 10}+ Artworks Available</p>
                            </div>
                            <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
