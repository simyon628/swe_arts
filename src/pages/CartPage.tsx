import { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/priceFormatter';

interface CartPageProps {
    cartItems: any[];
    onUpdateQuantity: (id: number, delta: number, variant?: any) => void;
    onRemoveItem: (id: number, variant?: any) => void;
}

export function CartPage({ cartItems, onUpdateQuantity, onRemoveItem }: CartPageProps) {
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const mrpTotal = cartItems.reduce((acc, item) => acc + ((item.mrp || item.price * 1.5) * (item.quantity || 1)), 0);
    const savings = mrpTotal - subtotal;
    const finalTotal = subtotal - discount;

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'SAVE20') {
            setDiscount(Math.floor(subtotal * 0.2));
        } else if (couponCode.toUpperCase() === 'WELCOMESWE') {
            setDiscount(500);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="pt-32 pb-fluid px-fluid min-h-screen bg-ivory flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-24 h-24 bg-charcoal/5 rounded-full flex items-center justify-center">
                    <Trash2 size={40} className="text-charcoal/20" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-charcoal tracking-tighter italic uppercase">Your cart is clean</h2>
                    <p className="text-charcoal/40 font-bold uppercase tracking-widest text-xs">It's time to add some soul to your space.</p>
                </div>
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-charcoal text-white px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-teal transition-all"
                >
                    Explore Gallery
                </button>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-fluid px-fluid min-h-screen bg-ivory">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-charcoal tracking-tighter uppercase italic leading-none">Your Cart</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal/30 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-teal" /> Secure Review
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cartItems.map(item => (
                                <motion.div
                                    key={`${item.id}-${item.selectedSize}-${item.selectedFrame}`}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-charcoal/5 flex flex-col md:flex-row items-center gap-8 group"
                                >
                                    {/* Image */}
                                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg flex-shrink-0">
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 space-y-2 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-black text-charcoal uppercase tracking-tight">{item.name}</h3>
                                                <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mt-1">
                                                    {item.selectedSize || '16x16"'} | {item.selectedFrame || 'Studio Wrap'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-charcoal/20 line-through font-bold">{formatPrice(item.mrp || item.price * 1.5)}</p>
                                                <p className="text-2xl font-black text-teal">{formatPrice(item.price)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center md:justify-between pt-4">
                                            <div className="flex items-center gap-4 bg-ivory p-2 rounded-2xl">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, -1, { selectedSize: item.selectedSize, selectedFrame: item.selectedFrame })}
                                                    className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all shadow-sm"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-black text-sm w-4 text-center">{item.quantity || 1}</span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, 1, { selectedSize: item.selectedSize, selectedFrame: item.selectedFrame })}
                                                    className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all shadow-sm"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => onRemoveItem(item.id, { selectedSize: item.selectedSize, selectedFrame: item.selectedFrame })}
                                                className="text-red-500/30 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                            >
                                                <Trash2 size={14} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-charcoal/5 sticky top-32 space-y-8">
                            <h2 className="text-xl font-black text-charcoal uppercase tracking-tight">Price Breakdown</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold text-charcoal/40 uppercase tracking-widest">
                                    <span>Total MRP</span>
                                    <span className="line-through">{formatPrice(mrpTotal)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-green-600 uppercase tracking-widest">
                                    <span>Discount Savings</span>
                                    <span>-{formatPrice(savings)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-charcoal uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-xs font-bold text-teal uppercase tracking-widest">
                                        <span>Coupon Applied</span>
                                        <span>-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xs font-bold text-charcoal uppercase tracking-widest">
                                    <span>Shipping</span>
                                    <span className="text-teal font-black">Luxe Free</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-charcoal/5">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/20">Final Amount</p>
                                        <p className="text-4xl font-black text-charcoal tracking-tighter">{formatPrice(finalTotal)}</p>
                                    </div>
                                    <div className="bg-teal text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-1">
                                        {Math.round(((mrpTotal - finalTotal) / mrpTotal) * 100)}% OFF
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="relative">
                                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Enter Coupon (SAVE20)"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-teal outline-none uppercase tracking-widest"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-charcoal text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-teal transition-all"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-charcoal hover:bg-teal text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 group"
                            >
                                Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </button>

                            <p className="text-center text-[9px] font-black text-charcoal/20 uppercase tracking-[0.2em]">
                                Shipping & Taxes calculated at logistics step
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
