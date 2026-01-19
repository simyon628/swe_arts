import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categories = [
    {
        title: 'Wall Art',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600',
        id: 'Wall Art'
    },
    {
        title: 'Handmade Decor',
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=600',
        id: 'Handmade Decor'
    },
    {
        title: 'Lippan Art',
        image: 'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=600',
        id: 'Lippan Art'
    },
    {
        title: 'Textured Art',
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600',
        id: 'Textured Art'
    }
];

export const DiscoverHandmade = () => {
    const navigate = useNavigate();

    const handleSeeMore = (categoryId: string) => {
        navigate(`/shop?category=${encodeURIComponent(categoryId)}`);
    };

    return (
        <section id="discover" className="py-12 px-8 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col mb-16 items-center text-center">
                    <span className="text-[#0F766E] font-bold uppercase tracking-[0.3em] text-xs mb-3">Explore Categories</span>
                    <h2 className="text-4xl md:text-5xl font-black text-charcoal tracking-tight italic">Discover Handmade Art</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="group relative aspect-[4/5] rounded-[40px] overflow-hidden bg-white shadow-xl">
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

                            <div className="absolute inset-0 p-8 flex flex-col justify-end items-center text-center">
                                <button
                                    onClick={() => handleSeeMore(cat.id)}
                                    className="text-xl md:text-2xl font-black text-white mb-6 transform transition-transform duration-500 hover:scale-105 active:scale-95"
                                >
                                    {cat.title}
                                </button>
                                <button
                                    onClick={() => handleSeeMore(cat.id)}
                                    className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#C9A24D] hover:border-[#C9A24D] transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                                >
                                    See more
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
