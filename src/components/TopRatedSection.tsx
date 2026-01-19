import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/priceFormatter';
import { handleImageError } from '../utils/imageUtils';
import { products } from '../cms/cms';
import { motion, AnimatePresence } from 'framer-motion';

interface TopRatedSectionProps {
    isLoggedIn: boolean;
    cartItems: any[];
    onAddToCart: (product: any) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onAuthRequired: (product: any) => void;
}

export const TopRatedSection = ({ isLoggedIn, cartItems, onAddToCart, onUpdateQuantity, onAuthRequired }: TopRatedSectionProps) => {
    const navigate = useNavigate();
    const featuredProducts = products.slice(0, 4);

    const getCartItem = (id: number) => cartItems.find(item => item.id === id);

    return (
        <section id="top-rated" className="pt-4 pb-12 px-8 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col mb-16 items-center text-center">
                    <span className="text-[#C9A24D] font-bold uppercase tracking-[0.3em] text-xs mb-3">Curated Perfection</span>
                    <h2 className="text-4xl md:text-5xl font-black text-charcoal tracking-tight italic uppercase">Top Rated Originals</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map(product => {
                        const cartItem = getCartItem(product.id);

                        return (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="group cursor-pointer space-y-6 bg-white p-5 rounded-[2.5rem] border border-charcoal/5 hover:shadow-2xl transition-all duration-500"
                            >
                                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        onError={(e) => handleImageError(e, product.category)}
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-charcoal text-[9px] font-black px-3 py-1 rounded-full">
                                        {product.rating} ★
                                    </div>
                                </div>
                                <div className="px-4 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A24D]">{product.category}</p>
                                        <h3 className="text-xl font-black text-charcoal tracking-tight group-hover:text-teal transition-colors truncate uppercase italic">{product.name}</h3>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-charcoal">{formatPrice(product.price)}</span>

                                        <div onClick={(e) => e.stopPropagation()}>
                                            <AnimatePresence mode="wait">
                                                {cartItem && isLoggedIn ? (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="flex items-center gap-3 bg-ivory p-1.5 rounded-2xl border border-charcoal/5 shadow-sm"
                                                    >
                                                        <button
                                                            onClick={() => onUpdateQuantity(product.id, -1)}
                                                            className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all"
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="font-black text-xs min-w-[20px] text-center">{cartItem.quantity}</span>
                                                        <button
                                                            onClick={() => onUpdateQuantity(product.id, 1)}
                                                            className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all"
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
                                                        className="w-12 h-12 bg-charcoal text-white rounded-2xl flex items-center justify-center hover:bg-teal transition-all shadow-xl"
                                                    >
                                                        <ShoppingCart size={20} />
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
            </div>
        </section>
    );
};
