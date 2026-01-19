import { motion } from 'framer-motion';

const inspirations = [
    {
        title: "The Golden Hour",
        description: "Capturing the warmth of sunset in textured gold leaf.",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800",
        tag: "Trending"
    },
    {
        title: "Rhythmic Patterns",
        description: "Geometric harmony inspired by traditional Lippan motifs.",
        image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800",
        tag: "Curated"
    },
    {
        title: "Nature's Whispers",
        description: "Abstract textures blending organic forms with modern aesthetics.",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800",
        tag: "Discovery"
    }
];

export const ExploreSection = () => {
    return (
        <section id="explore" className="py-12 px-[clamp(1rem,5vw,4rem)] bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-teal font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Inspiration</span>
                        <h2 className="text-[clamp(2rem,5vw,3rem)] font-black text-charcoal leading-[1.1] tracking-tighter italic uppercase">
                            Explore Curated <br /> Expressions
                        </h2>
                    </div>
                    <p className="text-charcoal/40 font-bold text-[10px] uppercase tracking-widest max-w-xs leading-relaxed mb-1">
                        A space for discovery beyond commerce. Immerse yourself in the stories and textures behind our most celebrated works.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(1rem,2vw,2rem)]">
                    {inspirations.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-2xl">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                />
                                <div className="absolute top-6 left-6">
                                    <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full">
                                        {item.tag}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <button
                                onClick={() => window.location.href = '/shop'}
                                className="text-xl font-black text-charcoal mb-2 hover:text-teal transition-colors w-full text-left"
                            >
                                {item.title}
                            </button>
                            <p className="text-sm text-charcoal/50 font-medium leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
