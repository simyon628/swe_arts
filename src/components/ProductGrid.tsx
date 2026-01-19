import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleImageError } from '../utils/imageUtils';
import { Heart, ShoppingCart, ArrowLeft, ArrowRight, Plus, Minus } from 'lucide-react';
import { products } from '../cms/cms';
import { formatPrice } from '../utils/priceFormatter';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGridProps {
    isLoggedIn: boolean;
    cartItems: any[];
    onAddToCart: (product: any) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onAuthRequired: (product: any) => void;
}

export const ProductGrid = ({ isLoggedIn, cartItems, onAddToCart, onUpdateQuantity, onAuthRequired }: ProductGridProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const getCartItem = (id: number) => cartItems.find(item => item.id === id);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth * 0.7
                : scrollLeft + clientWidth * 0.7;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section id="discovery" className="py-16 px-8 max-w-[1800px] mx-auto overflow-hidden bg-transparent">
            {/* Headers same as before */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div>
                    <span className="text-[#C9A24D] font-bold uppercase tracking-[0.3em] text-xs mb-3 block">Discovery</span>
                    <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black text-charcoal tracking-tighter leading-tight italic uppercase">Featured Masterpieces</h2>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => scroll('left')}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-teal hover:border-teal hover:text-white transition-all active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-charcoal/10 flex items-center justify-center hover:bg-teal hover:border-teal hover:text-white transition-all active:scale-90"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 md:gap-10 overflow-x-auto pb-12 scrollbar-hide snap-x"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {products.map(product => {
                    const cartItem = getCartItem(product.id);

                    return (
                        <div
                            key={product.id}
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="min-w-[clamp(280px,25vw,360px)] snap-start group bg-white rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-charcoal/5 cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-charcoal/5">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    onError={(e) => handleImageError(e, product.category)}
                                />
                                <button
                                    onClick={(e) => { e.stopPropagation(); }}
                                    className="absolute top-5 right-5 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg text-charcoal hover:text-red-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                                >
                                    <Heart size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 px-2">
                                <div className="space-y-1">
                                    <p className="text-[#C9A24D] text-[10px] uppercase font-black tracking-widest mb-1">{product.category}</p>
                                    <h3 className="text-xl md:text-2xl font-black text-charcoal group-hover:text-teal transition-colors tracking-tight uppercase italic truncate">{product.name}</h3>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-charcoal">{formatPrice(product.price)}</span>
                                        <span className="text-xs text-charcoal/20 line-through font-bold">{formatPrice(product.mrp)}</span>
                                    </div>

                                    <div onClick={(e) => e.stopPropagation()}>
                                        <AnimatePresence mode="wait">
                                            {cartItem && isLoggedIn ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="flex items-center gap-3 bg-ivory p-2 rounded-2xl border border-charcoal/5 shadow-sm"
                                                >
                                                    <button
                                                        onClick={() => onUpdateQuantity(product.id, -1)}
                                                        className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="font-black text-xs min-w-[20px] text-center">{cartItem.quantity}</span>
                                                    <button
                                                        onClick={() => onUpdateQuantity(product.id, 1)}
                                                        className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all shadow-sm"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    onClick={() => {
                                                        if (!isLoggedIn) {
                                                            onAuthRequired(product);
                                                        } else {
                                                            onAddToCart(product);
                                                        }
                                                    }}
                                                    className="p-4 bg-charcoal text-white rounded-2xl hover:bg-teal transition-all active:scale-95 shadow-xl shadow-charcoal/10"
                                                >
                                                    <ShoppingCart size={22} />
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center mt-8">
                <button
                    onClick={() => navigate('/shop')}
                    className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-teal hover:text-charcoal transition-colors border-b-2 border-transparent hover:border-charcoal pb-1"
                >
                    See all masterpieces
                    <ArrowRight size={18} className="transform transition-transform group-hover:translate-x-2" />
                </button>
            </div>
        </section>
    );
};
