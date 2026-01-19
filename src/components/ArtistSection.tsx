
import React from 'react';
import { motion } from 'framer-motion';

const artists = [
    { id: 1, name: 'Elena Grace', specialty: 'Textured Art', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400' },
    { id: 2, name: 'Marcus Chen', specialty: 'Mixed Media', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' },
    { id: 3, name: 'Sanya Gupta', specialty: 'Lippan Art', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400' },
    { id: 4, name: 'David Rossi', specialty: 'Canvas Art', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400' },
];

export const ArtistSection: React.FC = () => {
    return (
        <section className="py-24 px-6 md:px-12 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-black text-charcoal tracking-tight">Meet the Visionaries</h2>
                        <p className="mt-4 text-gray-500 font-medium">Explore the creative souls behind the masterpieces. Each artist brings a unique story to your walls.</p>
                    </div>
                    <button className="text-red-600 font-bold hover:underline">View All Artists →</button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {artists.map((artist, idx) => (
                        <motion.div
                            key={artist.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="group flex flex-col items-center"
                        >
                            <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:shadow-2xl transition-all duration-500">
                                <img
                                    src={artist.image}
                                    alt={artist.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="mt-6 text-xl font-black text-charcoal">{artist.name}</h3>
                            <p className="text-sm font-bold text-red-600/70 tracking-widest uppercase mt-1">{artist.specialty}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
