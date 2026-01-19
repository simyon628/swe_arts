import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, ShoppingCart, Heart, Plus, Minus, ArrowRight } from 'lucide-react';
import { handleImageError } from '../utils/imageUtils';
import { formatPrice } from '../utils/priceFormatter';
import { categories, products } from '../cms/cms';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopPageProps {
    isLoggedIn: boolean;
    cartItems: any[];
    onAddToCart: (product: any) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onAuthRequired: (product: any) => void;
}

export const ShopPage = ({ isLoggedIn, cartItems, onAddToCart, onUpdateQuantity, onAuthRequired }: ShopPageProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const activeCategory = searchParams.get('category') || 'All';
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [wishlist, setWishlist] = useState<number[]>([]);

    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === activeCategory));
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeCategory]);

    const toggleWishlist = (id: number) => {
        setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const getCartItem = (id: number) => cartItems.find(item => item.id === id);

    return (
        <div className="pt-32 pb-fluid px-fluid min-h-screen bg-[#FDFBF7] selection:bg-teal/10 selection:text-teal font-sans">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-charcoal/5">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#C9A24D] font-black text-[10px] uppercase tracking-[0.4em]">
                            <Filter size={14} />
                            <span>Discovery Gallery</span>
                        </div>
                        <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black text-charcoal tracking-tighter leading-none italic uppercase">
                            {activeCategory === 'All' ? 'Curated Collection' : activeCategory}
                        </h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-20">
                    {/* Sidebar Filters */}
                    <div className="space-y-16 hidden lg:block">
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">Art Categories</h3>
                            <div className="flex flex-col gap-6">
                                {['All', ...categories.map(c => c.name)].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
                                        className={`text-left font-black text-2xl transition-all flex items-center justify-between group ${activeCategory === cat
                                            ? 'text-teal italic'
                                            : 'text-charcoal/40 hover:text-charcoal'
                                            }`}
                                    >
                                        <span>{cat.toUpperCase()}</span>
                                        {activeCategory === cat && <div className="w-12 h-[2px] bg-teal" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-charcoal text-white rounded-[2.5rem] space-y-4">
                            <h4 className="text-sm font-black italic tracking-widest">Custom Orders</h4>
                            <p className="text-[10px] text-white/60 font-medium leading-relaxed">Have a specific vision? We craft bespoke pieces tailored to your space.</p>
                            <button
                                onClick={(e) => { e.stopPropagation(); alert('Custom Inquiry coming soon!'); }}
                                className="text-[10px] font-black uppercase tracking-widest text-[#C9A24D] flex items-center gap-2 hover:translate-x-2 transition-transform"
                            >
                                Inquire Now <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                        {filteredProducts.map(product => {
                            const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
                            const cartItem = getCartItem(product.id);

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    className="group bg-white rounded-[3rem] p-6 border border-charcoal/5 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] cursor-pointer"
                                >
                                    <div className="relative aspect-[3/4] rounded-[2.2rem] overflow-hidden mb-8 shadow-inner">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            onError={(e) => handleImageError(e, product.category)}
                                        />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                            className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white/90 text-charcoal hover:text-red-500 opacity-0 group-hover:opacity-100'}`}
                                        >
                                            <Heart size={20} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                                        </button>
                                        <div className="absolute bottom-6 left-6 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">
                                            {discount}% OFF
                                        </div>
                                    </div>
                                    <div className="space-y-6 px-2">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A24D]">{product.category}</p>
                                            <h3 className="text-2xl font-black text-charcoal tracking-tight truncate italic uppercase group-hover:text-teal transition-colors">{product.name}</h3>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-3xl font-black text-charcoal tracking-tighter">{formatPrice(product.price)}</span>
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
                                                                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Minus size={16} />
                                                            </button>
                                                            <span className="font-black text-sm min-w-[20px] text-center">{cartItem.quantity}</span>
                                                            <button
                                                                onClick={() => onUpdateQuantity(product.id, 1)}
                                                                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all shadow-sm"
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                if (!isLoggedIn) {
                                                                    onAuthRequired(product);
                                                                } else {
                                                                    onAddToCart(product);
                                                                }
                                                            }}
                                                            className="w-14 h-14 bg-charcoal text-white rounded-2xl flex items-center justify-center hover:bg-teal transition-all shadow-xl shadow-charcoal/10"
                                                        >
                                                            <ShoppingCart size={22} />
                                                        </button>
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
            </div>
        </div>
    );
};
