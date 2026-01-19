import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, Check, MapPin, ArrowRight, Minus, Plus, Search } from 'lucide-react';
import { products } from '../cms/cms';
import { formatPrice } from '../utils/priceFormatter';
import { getSuggestions, detectLocation, LocationSuggestion } from '../services/locationService';
import { handleImageError } from '../utils/imageUtils';

const PRINT_TYPES = [
    { id: 'canvas', label: 'Canvas Print', price: 0 },
    { id: 'framed', label: 'Framed Print', price: 1500 },
    { id: 'wooden', label: 'Wooden Frame', price: 2000 },
    { id: 'acrylic', label: 'Acrylic Print', price: 3000 }
];

const SIZES = [
    { id: '12x18', label: '12 × 18 inches', multiplier: 1 },
    { id: '18x24', label: '18 × 24 inches', multiplier: 1.6 },
    { id: '24x36', label: '24 × 36 inches', multiplier: 2.5 },
    { id: 'custom', label: 'Custom size', multiplier: 3.0 }
];

const FRAMES = [
    { id: 'none', label: 'No Frame', color: 'transparent', price: 0 },
    { id: 'black', label: 'Black', color: '#1A1A1A', price: 800 },
    { id: 'white', label: 'White', color: '#FFFFFF', price: 800 },
    { id: 'natural', label: 'Natural Wood', color: '#D2B48C', price: 1200 },
    { id: 'gold', label: 'Gold', color: '#D4AF37', price: 1800 }
];

interface ProductDetailPageProps {
    isLoggedIn: boolean;
    cartItems: any[];
    onAddToCart: (product: any) => void;
    onUpdateQuantity: (id: number, delta: number, variant?: any) => void;
    onAuthRequired: (product: any) => void;
}

export const ProductDetailPage = ({ isLoggedIn, cartItems, onAddToCart, onUpdateQuantity, onAuthRequired }: ProductDetailPageProps) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = useMemo(() => products.find(p => p.id === Number(id)), [id]);

    const [activeImg, setActiveImg] = useState(0);
    const [selectedType, setSelectedType] = useState(PRINT_TYPES[0]);
    const [selectedSize, setSelectedSize] = useState(SIZES[1]);
    const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);

    // Pincode/Location State
    const [locationInput, setLocationInput] = useState('');
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [pincodeResult, setPincodeResult] = useState<LocationSuggestion | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveImg(0);
    }, [id]);

    // Handle clicks outside suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const finalPrice = useMemo(() => {
        if (!product) return 0;
        let price = product.price * selectedSize.multiplier;
        price += selectedType.price;
        price += selectedFrame.price;
        return Math.round(price);
    }, [product, selectedType, selectedSize, selectedFrame]);

    // Cart Helper
    const currentVariantInCart = useMemo(() => {
        return cartItems.find(item =>
            item.id === product?.id &&
            item.selectedSize === selectedSize.label &&
            item.selectedFrame === selectedFrame.label
        );
    }, [cartItems, product?.id, selectedSize.label, selectedFrame.label]);

    if (!product) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-black text-charcoal">Original Not Found</h2>
                    <Link to="/shop" className="text-teal font-bold hover:underline">Return to Gallery</Link>
                </div>
            </div>
        );
    }

    const handleLocationChange = (val: string) => {
        setLocationInput(val);
        setPincodeResult(null);
        if (val.trim().length >= 2) {
            setSuggestions(getSuggestions(val));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (loc: LocationSuggestion) => {
        setLocationInput(loc.pincode || loc.city);
        setPincodeResult(loc);
        setShowSuggestions(false);
    };

    const handlePincodeCheck = async () => {
        if (!locationInput.trim()) {
            alert("Please enter pincode or city name");
            return;
        }
        setIsChecking(true);
        setPincodeResult(null);

        try {
            const found = await detectLocation(locationInput);
            setIsChecking(false);
            if (found) {
                setPincodeResult(found);
            } else {
                setPincodeResult({ city: '', state: '', available: false } as any);
            }
        } catch (error) {
            setIsChecking(false);
            setPincodeResult({ city: '', state: '', available: false } as any);
        }
    };

    const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id);

    return (
        <div className="min-h-screen bg-[#F8F6F2] pt-32 pb-fluid px-fluid selection:bg-teal/10 selection:text-teal font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* LEFT PANEL: Gallery & Thumbnails */}
                    <div className="lg:col-span-12 xl:col-span-7 flex flex-col md:flex-row gap-8 sticky top-32">
                        {/* Thumbnail Side Strip */}
                        <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto max-h-[600px] hide-scrollbar py-2">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    className={`relative w-20 md:w-24 aspect-square rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 shadow-md ${activeImg === i ? 'border-[#C9A24D] scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                >
                                    <img
                                        src={img}
                                        className="w-full h-full object-cover"
                                        alt="thumb"
                                        onError={(e) => handleImageError(e, product.category)}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Artwork Preview */}
                        <div className="flex-1 order-1 md:order-2">
                            <div className="relative group">
                                <motion.div
                                    className="relative aspect-square rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-white p-[clamp(1.5rem,8%,4rem)] transition-all duration-700"
                                    style={{
                                        border: selectedFrame.id !== 'none' ? `clamp(12px, 2vw, 24px) solid ${selectedFrame.color}` : 'none',
                                        boxShadow: selectedFrame.id !== 'none' ? 'inset 0 0 40px rgba(0,0,0,0.1), 0 40px 80px rgba(0,0,0,0.2)' : 'none'
                                    }}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={activeImg}
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6 }}
                                            src={product.images[activeImg]}
                                            className="w-full h-full object-cover shadow-2xl cursor-zoom-in"
                                            alt={product.name}
                                            onError={(e) => handleImageError(e, product.category)}
                                        />
                                    </AnimatePresence>
                                </motion.div>

                                <div className="absolute top-8 left-8 bg-charcoal/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    Hover Canvas to Zoom
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Info & Selection */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-[#C9A24D] font-black uppercase tracking-[0.3em] text-[10px]">Swe Arts Original</p>
                                <h1 className="text-[clamp(2.5rem,4.5vw,4.5rem)] font-black text-charcoal leading-[0.9] tracking-tighter uppercase italic">{product.name}</h1>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-[#C9A24D] text-[#C9A24D]" : "text-charcoal/10"} />
                                    ))}
                                    <span className="text-xs font-black ml-2 text-charcoal/40">{product.rating} / 5.0</span>
                                </div>
                                <div className="h-1 w-1 rounded-full bg-charcoal/10" />
                                <p className="text-xs font-bold text-teal tracking-widest uppercase">{product.category}</p>
                            </div>

                            <p className="text-charcoal/60 leading-relaxed text-sm max-w-xl font-medium">
                                {product.description}
                            </p>
                        </div>

                        <div className="h-[1px] bg-charcoal/5" />

                        {/* Selection Logic */}
                        <div className="space-y-8">
                            {/* Print Types */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30 flex justify-between">
                                    <span>Select Print Surface</span>
                                    <span className="text-teal underline cursor-pointer">Surface Guide</span>
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {PRINT_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setSelectedType(type)}
                                            className={`p-3 rounded-xl border-2 text-[10px] font-black transition-all ${selectedType.id === type.id ? 'border-teal bg-teal text-white shadow-lg' : 'border-charcoal/5 bg-white text-charcoal hover:border-teal/30'}`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">Dimensions</h3>
                                <div className="flex flex-wrap gap-3">
                                    {SIZES.map(size => (
                                        <button
                                            key={size.id}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-5 py-2.5 rounded-xl border-2 text-[10px] font-black transition-all ${selectedSize.id === size.id ? 'border-teal bg-teal text-white' : 'border-charcoal/5 bg-white text-charcoal'}`}
                                        >
                                            {size.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Frames */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">Frame Selection</h3>
                                <div className="flex gap-4">
                                    {FRAMES.map(frame => (
                                        <button
                                            key={frame.id}
                                            onClick={() => setSelectedFrame(frame)}
                                            title={frame.label}
                                            className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${selectedFrame.id === frame.id ? 'border-teal scale-110 shadow-xl' : 'border-charcoal/5 hover:border-teal/30'}`}
                                        >
                                            <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: frame.color }}>
                                                {selectedFrame.id === frame.id && <Check size={14} className={frame.id === 'white' ? 'text-charcoal' : 'text-white'} />}
                                                {frame.id === 'none' && <Minus size={14} className="text-charcoal/20" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">{selectedFrame.label}</p>
                            </div>
                        </div>

                        <div className="h-[1px] bg-charcoal/5" />

                        {/* Price & Cart Actions */}
                        <div className="space-y-8">
                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-charcoal/20">Final Price (Incl. GST)</p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl font-black text-charcoal tracking-tighter">{formatPrice(finalPrice)}</span>
                                        <span className="text-base text-charcoal/20 line-through font-bold">{formatPrice(Math.round(finalPrice * 1.3))}</span>
                                    </div>
                                </div>
                                <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest mb-1 animate-pulse">
                                    30% Limited Discovery Offer
                                </div>
                            </div>

                            {/* Pincode Check */}
                            <div className="bg-charcoal/5 p-6 rounded-3xl space-y-4 relative">
                                <div className="flex items-center gap-4">
                                    <MapPin size={18} className="text-teal" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal">Delivery Check</h4>
                                </div>
                                <div className="relative" ref={suggestionRef}>
                                    <div className="flex gap-2">
                                        <div className="flex-1 relative">
                                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
                                            <input
                                                type="text"
                                                placeholder="Enter Pincode or City"
                                                value={locationInput}
                                                onChange={(e) => handleLocationChange(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handlePincodeCheck()}
                                                className="w-full h-[44px] bg-white border border-charcoal/10 pl-10 pr-4 rounded-lg text-sm font-bold focus:ring-2 focus:ring-teal outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handlePincodeCheck}
                                            className="h-[44px] bg-charcoal text-white px-6 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-teal transition-all whitespace-nowrap"
                                        >
                                            Check
                                        </button>
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    <AnimatePresence>
                                        {showSuggestions && suggestions.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute z-50 w-full top-full mt-2 bg-white rounded-2xl shadow-2xl border border-charcoal/5 overflow-hidden"
                                            >
                                                {suggestions.map((loc, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleSelectSuggestion(loc)}
                                                        className="w-full px-6 py-4 text-left hover:bg-teal/5 flex items-center justify-between border-b border-charcoal/5 last:border-0 transition-colors"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-black text-charcoal">{loc.city}</p>
                                                            <p className="text-[10px] font-bold text-charcoal/30 uppercase tracking-widest">{loc.state}</p>
                                                        </div>
                                                        <span className="text-[10px] font-black text-teal/40">{loc.pincode}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <AnimatePresence mode="wait">
                                    {isChecking && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[10px] font-black uppercase tracking-widest text-charcoal/40"
                                        >
                                            Detecting soul location...
                                        </motion.p>
                                    )}
                                    {pincodeResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-1"
                                        >
                                            {pincodeResult.city ? (
                                                <>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-600">
                                                        ✓ Delivery available to {pincodeResult.city}
                                                    </p>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40">
                                                        Estimated delivery: {pincodeResult.deliveryDays} days
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
                                                    × Delivery not available for this location
                                                </p>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentVariantInCart && isLoggedIn ? (
                                    <div className="col-span-1 bg-ivory p-2 rounded-[2rem] border border-charcoal/10 flex items-center justify-between shadow-inner">
                                        <button
                                            onClick={() => onUpdateQuantity(product.id, -1, {
                                                selectedSize: selectedSize.label,
                                                selectedFrame: selectedFrame.label
                                            })}
                                            className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all shadow-sm"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="font-black text-xl text-charcoal">{currentVariantInCart.quantity}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(product.id, 1, {
                                                selectedSize: selectedSize.label,
                                                selectedFrame: selectedFrame.label
                                            })}
                                            className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-charcoal hover:bg-teal hover:text-white transition-all shadow-sm"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if (!isLoggedIn) {
                                                onAuthRequired(product);
                                            } else {
                                                onAddToCart({
                                                    ...product,
                                                    price: finalPrice,
                                                    selectedSize: selectedSize.label,
                                                    selectedFrame: selectedFrame.label
                                                });
                                            }
                                        }}
                                        className="flex-1 bg-teal text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-teal/20 hover:bg-charcoal hover:-translate-y-1 transition-all flex items-center justify-center gap-4"
                                    >
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            onAuthRequired(product);
                                        } else {
                                            if (!currentVariantInCart) {
                                                onAddToCart({
                                                    ...product,
                                                    price: finalPrice,
                                                    selectedSize: selectedSize.label,
                                                    selectedFrame: selectedFrame.label
                                                });
                                            }
                                            navigate('/checkout');
                                        }
                                    }}
                                    className="flex-1 bg-white border-2 border-charcoal text-charcoal py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-charcoal hover:text-white hover:-translate-y-1 transition-all"
                                >
                                    Buy it Now
                                </button>
                            </div>

                            <button className="w-full flex items-center justify-center gap-3 text-charcoal/40 hover:text-red-500 transition-colors uppercase font-black tracking-widest text-[10px]">
                                <Heart size={16} /> Save to My Gallery
                            </button>
                        </div>
                    </div>
                </div>

                {/* Similar Art Section */}
                <div className="mt-32 space-y-12">
                    <div className="flex items-end justify-between border-b border-charcoal/5 pb-8">
                        <div className="space-y-4">
                            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-charcoal leading-none tracking-tighter">SIMILAR DISCOVERIES</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal/20 italic">More from the {product.category} collection</p>
                        </div>
                        <Link to="/shop" className="group flex items-center gap-4 text-teal font-black text-[10px] uppercase tracking-[0.3em]">
                            View All <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex gap-8 overflow-x-auto pb-8 pt-4 hide-scrollbar">
                        {similarProducts.map(p => (
                            <button
                                key={p.id}
                                onClick={() => navigate(`/product/${p.id}`)}
                                className="w-72 flex-shrink-0 group text-left space-y-4"
                            >
                                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-charcoal/5 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                                    <img
                                        src={p.images[0]}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        alt={p.name}
                                        onError={(e) => handleImageError(e, p.category)}
                                    />
                                </div>
                                <div className="px-2 space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-teal">{p.category}</p>
                                    <h3 className="text-lg font-black text-charcoal tracking-tight group-hover:text-teal transition-colors">{p.name}</h3>
                                    <p className="text-sm font-black text-charcoal/20">{formatPrice(p.price)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
