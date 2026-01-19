import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { auth } from './firebase';
import { Navbar } from './components/Navbar';
import { HeroPinterest } from './components/HeroPinterest';
import { ProductGrid } from './components/ProductGrid';
import { AuthModal } from './components/AuthModal';
import { TopRatedSection } from './components/TopRatedSection';
import { DiscoverHandmade } from './components/DiscoverHandmade';
import { Checkout } from './pages/Checkout';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ExploreSection } from './components/ExploreSection';

import { userService, UserAddress } from './services/userService';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartPage } from './pages/CartPage';
import { OrderSuccess } from './pages/OrderSuccess';

interface HomeProps {
    isLoggedIn: boolean;
    cartItems: any[];
    onAddToCart: (product: any) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onAuthRequired: (product: any) => void;
}

const Home = ({ isLoggedIn, cartItems, onAddToCart, onUpdateQuantity, onAuthRequired }: HomeProps) => (
    <main className="space-y-0 bg-[#F8F6F2]">
        <HeroPinterest />
        <section className="relative z-10">
            <TopRatedSection
                isLoggedIn={isLoggedIn}
                cartItems={cartItems}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onAuthRequired={onAuthRequired}
            />
        </section>
        <section id="explore" className="py-8 md:py-16">
            <ExploreSection />
        </section>
        <section id="discover" className="py-8 md:py-16">
            <DiscoverHandmade />
        </section>
        <div id="shop" className="py-8 md:py-16">
            <ProductGrid
                isLoggedIn={isLoggedIn}
                cartItems={cartItems}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onAuthRequired={onAuthRequired}
            />
        </div>
    </main>
);

function AppContent() {
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [pendingProduct, setPendingProduct] = useState<any>(null);
    const [addresses, setAddresses] = useState<UserAddress[]>([]);

    // Toast State
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    const [cartItems, setCartItems] = useState<any[]>(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn.toString());
    }, [isLoggedIn]);

    // Toast Timer
    useEffect(() => {
        if (toast.visible) {
            const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast.visible]);

    // Fetch user data from Firestore on Login
    useEffect(() => {
        if (currentUser?.uid) {
            userService.getUserData(currentUser.uid).then(data => {
                if (data?.addresses) setAddresses(data.addresses);
            });
        }
    }, [currentUser]);

    // --- FIREBASE AUTH LISTENER ---
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user: any) => {
            if (user) {
                setIsLoggedIn(true);
                setCurrentUser(user);
                // If there's a pending product, add it now
                if (pendingProduct) {
                    addToCart(pendingProduct);
                    setPendingProduct(null);
                    setIsAuthModalOpen(false);
                }
            } else {
                setIsLoggedIn(false);
                setCurrentUser(null);
                setAddresses([]);
            }
        });
        return () => unsubscribe();
    }, [pendingProduct]);

    const handleLogin = (user: any) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
        setIsAuthModalOpen(false);
        if (pendingProduct) {
            addToCart(pendingProduct);
            setPendingProduct(null);
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            setIsLoggedIn(false);
            setCurrentUser(null);
            setCartItems([]);
            setAddresses([]);
            localStorage.removeItem('cartItems');
            localStorage.removeItem('isLoggedIn');
            navigate('/');
            showToast("Successfully logged out");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const showToast = (message: string) => {
        setToast({ message, visible: true });
    };

    const addToCart = (product: any) => {
        if (!isLoggedIn) {
            setPendingProduct(product);
            setIsAuthModalOpen(true);
            showToast("Please login or sign up to add items to cart");
            return;
        }
        setCartItems(prev => {
            // Uniqueness based on ID + Size + Frame
            const existingIndex = prev.findIndex(item =>
                item.id === product.id &&
                item.selectedSize === (product.selectedSize || 'Standard') &&
                item.selectedFrame === (product.selectedFrame || 'None')
            );

            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: (updated[existingIndex].quantity || 1) + 1
                };
                showToast(`Increased quantity of ${product.name}`);
                return updated;
            } else {
                showToast(`Added ${product.name} to cart`);
                return [...prev, {
                    ...product,
                    quantity: 1,
                    selectedSize: product.selectedSize || 'Standard',
                    selectedFrame: product.selectedFrame || 'None'
                }];
            }
        });
    };

    const updateQuantity = (productId: number, delta: number, variant?: any) => {
        setCartItems(prev => {
            const updated = prev.map(item => {
                const isMatch = item.id === productId && (
                    !variant || (
                        item.selectedSize === variant.selectedSize &&
                        item.selectedFrame === variant.selectedFrame
                    )
                );

                if (isMatch) {
                    const newQty = (item.quantity || 1) + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean) as any[];

            return updated;
        });
    };

    const removeFromCart = (productId: number, variant?: any) => {
        setCartItems(prev => prev.filter(item => {
            const isMatch = item.id === productId && (
                !variant || (
                    item.selectedSize === variant.selectedSize &&
                    item.selectedFrame === variant.selectedFrame
                )
            );
            return !isMatch;
        }));
        showToast("Removed from cart");
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const handleSaveAddress = async (address: UserAddress) => {
        if (currentUser?.uid) {
            await userService.saveAddress(currentUser.uid, address);
            setAddresses(prev => [...prev, address]);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F6F2] font-sans selection:bg-teal/10 selection:text-teal overflow-x-hidden">
            <Navbar
                isLoggedIn={isLoggedIn}
                user={currentUser}
                cartCount={cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
                onLoginClick={() => setIsAuthModalOpen(true)}
                onLogout={handleLogout}
            />

            {/* Global Toast */}
            <AnimatePresence>
                {toast.visible && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-[3000] bg-charcoal text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/10 backdrop-blur-md"
                    >
                        <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center">
                            <ShoppingCart size={16} />
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest">{toast.message}</p>
                        <button onClick={() => setToast(prev => ({ ...prev, visible: false }))} className="ml-2 opacity-50 hover:opacity-100 italic font-medium">✕</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Routes>
                <Route path="/" element={<Home
                    isLoggedIn={isLoggedIn}
                    cartItems={cartItems}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    onAuthRequired={(product) => {
                        setPendingProduct(product);
                        setIsAuthModalOpen(true);
                        showToast("Please login or sign up to add items to cart");
                    }}
                />} />
                <Route path="/shop" element={<ShopPage
                    isLoggedIn={isLoggedIn}
                    cartItems={cartItems}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    onAuthRequired={(product) => {
                        setPendingProduct(product);
                        setIsAuthModalOpen(true);
                        showToast("Please login or sign up to add items to cart");
                    }}
                />} />
                <Route path="/product/:id" element={<ProductDetailPage
                    isLoggedIn={isLoggedIn}
                    cartItems={cartItems}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    onAuthRequired={(product) => {
                        setPendingProduct(product);
                        setIsAuthModalOpen(true);
                        showToast("Please login or sign up to add items to cart");
                    }}
                />} />
                <Route path="/cart" element={<CartPage cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} />} />
                <Route path="/checkout" element={<Checkout cartItems={cartItems} currentUser={currentUser} savedAddresses={addresses} onSaveAddress={handleSaveAddress} onClearCart={clearCart} />} />
                <Route path="/success" element={<OrderSuccess />} />
                <Route path="/profile" element={<div className="pt-32 px-8 text-center h-screen">
                    <h1 className="text-4xl font-black text-charcoal">Profile Page</h1>
                    <p className="text-charcoal/40 mt-4">Feature coming soon in Phase 2.</p>
                </div>} />
            </Routes>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLogin={handleLogin}
            />

            <footer id="about" className="py-16 bg-transparent border-t border-charcoal/5">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
                    {/* Left: Logo & Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <img src="/logo.jpg" alt="Swe Arts" className="w-12 h-12 object-cover rounded-xl shadow-lg" />
                            <div className="text-2xl font-black text-teal tracking-tighter">Swe Arts</div>
                        </div>
                        <p className="text-charcoal/40 text-[11px] font-bold uppercase tracking-[0.3em] leading-relaxed">
                            © 2024 SWE ARTS STUDIO.<br />
                            CRAFTED WITH SOUL FOR MODERN SPACES.
                        </p>
                    </div>

                    {/* Middle: Quotation & Message */}
                    <div className="text-center space-y-8">
                        <div className="relative inline-block">
                            <p className="text-charcoal text-xl font-bold italic leading-relaxed relative z-10">
                                "Handmade soul meets <br /> contemporary aesthetics."
                            </p>
                            <div className="absolute -top-4 -left-4 text-6xl text-teal/5 font-serif opacity-50">"</div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C9A24D]">
                            India's Finest Curated Art Studio
                        </p>
                    </div>

                    {/* Right: Socials & Credits */}
                    <div className="flex flex-col md:items-end gap-8">
                        <div className="flex gap-6 items-center">
                            {[
                                { name: 'Instagram', icon: <Instagram size={20} />, href: 'https://www.instagram.com/swe_artss' },
                                { name: 'Facebook', icon: <Facebook size={20} />, href: '#' },
                                { name: 'Twitter', icon: <Twitter size={20} />, href: '#' }
                            ].map(social => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target={social.href !== '#' ? "_blank" : undefined}
                                    rel={social.href !== '#' ? "noopener noreferrer" : undefined}
                                    className="w-12 h-12 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/40 hover:bg-teal hover:text-white transition-all shadow-sm"
                                    title={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-charcoal/20 uppercase tracking-widest">Global Shipping Available</p>
                            <p className="text-[11px] font-black text-charcoal/10 uppercase tracking-[0.3em] mt-1">Premium Collection 2024</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;
