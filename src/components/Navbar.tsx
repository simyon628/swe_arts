import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../cms/cms';

interface NavbarProps {
    isLoggedIn: boolean;
    user?: any;
    cartCount: number;
    onLoginClick: () => void;
    onLogout: () => void;
}

export const Navbar = ({ isLoggedIn, user, cartCount, onLoginClick, onLogout }: NavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Explore', href: '#explore' },
        { label: 'Discover', href: '#discover' },
        { label: 'Shop', href: '/shop' },
        { label: 'About', href: '#about' }
    ];

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        }
    };

    const suggestions = searchQuery.length > 2
        ? products
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 5)
        : [];

    // Close search on scroll
    useEffect(() => {
        if (isSearchOpen) {
            const handleSearchScroll = () => setIsSearchOpen(false);
            window.addEventListener('scroll', handleSearchScroll);
            return () => window.removeEventListener('scroll', handleSearchScroll);
        }
    }, [isSearchOpen]);

    const handleSearch = (query: string) => {
        if (!query.trim()) return;
        setIsSearchOpen(false);
        setSearchQuery('');
        navigate(`/shop?q=${encodeURIComponent(query)}`);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[1000]">
            <div
                className={`transition-all duration-700 
                    ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-[clamp(0.5rem,1vh,1rem)]' : 'bg-transparent py-[clamp(1rem,2vh,2rem)]'} 
                    px-[clamp(1rem,5vw,4rem)] flex items-center justify-between relative`}
            >
                <div className="flex items-center gap-12">
                    <a
                        href="/"
                        onClick={handleLogoClick}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-charcoal/5 shadow-sm transition-transform group-hover:scale-110">
                            <img src="/logo.jpg" alt="Swe Arts" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-black tracking-tighter text-teal">
                            Swe Arts
                        </span>
                    </a>

                    <div className="hidden lg:flex items-center gap-[clamp(1.5rem,3vw,3rem)] text-[clamp(0.7rem,1.2vw,0.85rem)] font-bold uppercase tracking-[0.2em] text-charcoal/80">
                        {navItems.map(item => (
                            item.href.startsWith('#') ? (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="hover:text-[#C9A24D] transition-colors duration-300"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (window.location.pathname !== '/') {
                                            navigate('/');
                                            setTimeout(() => {
                                                const id = item.href.replace('#', '');
                                                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                            }, 100);
                                        } else {
                                            const id = item.href.replace('#', '');
                                            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className="hover:text-[#C9A24D] transition-colors duration-300"
                                >
                                    {item.label}
                                </Link>
                            )
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-[clamp(0.75rem,2vw,1.5rem)] text-charcoal/70">
                    {/* Inline Search Bar */}
                    <div className="relative flex items-center">
                        <motion.div
                            initial={false}
                            animate={{
                                width: isSearchOpen ? (window.innerWidth < 768 ? '92vw' : 'clamp(420px, 40vw, 480px)') : '44px',
                                x: isSearchOpen && window.innerWidth < 768 ? '-88vw' : 0
                            }}
                            className={`flex items-center h-11 bg-[#F8F6F2] border border-charcoal/10 rounded-full shadow-inner overflow-hidden relative ${isSearchOpen ? 'ring-2 ring-[#C9A24D]/20 border-[#C9A24D]' : ''}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="w-11 h-11 flex-shrink-0 flex items-center justify-center hover:text-[#C9A24D] transition-colors"
                            >
                                <Search size={20} />
                            </button>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                                placeholder="Search wall art, lippan art..."
                                className={`w-full bg-transparent border-none outline-none text-sm font-bold text-charcoal placeholder:text-charcoal/30 pr-10 transition-opacity duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-charcoal/5 rounded-full"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </motion.div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {isSearchOpen && suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-14 right-0 w-full max-w-[480px] bg-white rounded-3xl shadow-2xl border border-charcoal/5 overflow-hidden z-[1002]"
                                >
                                    <div className="max-h-[320px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[#C9A24D] px-4 py-2">Quick Matches</h3>
                                        {suggestions.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    setIsSearchOpen(false);
                                                    navigate(`/product/${p.id}`);
                                                }}
                                                className="w-full flex items-center gap-4 p-3 hover:bg-[#F8F6F2] rounded-2xl transition-all text-left group"
                                            >
                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-charcoal/5 flex-shrink-0">
                                                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black text-charcoal text-sm truncate">{p.name}</p>
                                                    <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">{p.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-teal text-xs">₹{p.price}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-[clamp(0.5rem,1.5vw,1.5rem)]">
                            <button className="hover:text-[#C9A24D] transition-colors relative">
                                <Heart size={22} />
                            </button>
                            <div className="relative">
                                <Link to="/cart" className="hover:text-[#C9A24D] transition-colors">
                                    <ShoppingCart size={22} />
                                </Link>
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-white">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${showProfileMenu ? 'bg-teal text-white border-teal shadow-lg' : 'bg-teal/10 text-teal border-teal/20 hover:bg-teal hover:text-white'}`}
                                    title="User Menu"
                                >
                                    <User size={20} />
                                </button>

                                {/* Profile Dropdown Dashboard */}
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-[-1]"
                                                onClick={() => setShowProfileMenu(false)}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-charcoal/5 overflow-hidden z-[1001]"
                                            >
                                                {/* Header */}
                                                <div className="p-6 pb-4 bg-[#F8F6F2] border-b border-charcoal/5">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#C9A24D] mb-1">Aesthetic Studio Member</p>
                                                    <p className="font-black text-charcoal text-lg leading-tight truncate">{user?.displayName || 'Studio Member'}</p>
                                                    <p className="text-xs font-bold text-charcoal/40 truncate">{user?.email || 'Member'}</p>
                                                </div>

                                                {/* Links */}
                                                <div className="p-3">
                                                    {[
                                                        { label: 'My Profile', icon: <User size={16} />, path: '/profile' },
                                                        { label: 'Recent Orders', icon: <ShoppingCart size={16} />, path: '/orders' },
                                                        { label: 'Wishlist', icon: <Heart size={16} />, path: '/wishlist' },
                                                        { label: 'Saved Addresses', icon: <Search size={16} />, path: '/addresses' },
                                                    ].map((item, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                setShowProfileMenu(false);
                                                                navigate(item.path);
                                                            }}
                                                            className="w-full flex items-center gap-4 p-4 hover:bg-[#F8F6F2] rounded-2xl transition-all text-left group"
                                                        >
                                                            <div className="text-charcoal/20 group-hover:text-[#C9A24D] transition-colors">
                                                                {item.icon}
                                                            </div>
                                                            <span className="text-xs font-black text-charcoal/70 group-hover:text-charcoal">
                                                                {item.label}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Footer */}
                                                <div className="p-3 pt-0">
                                                    <button
                                                        onClick={() => {
                                                            setShowProfileMenu(false);
                                                            onLogout();
                                                        }}
                                                        className="w-full p-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                                    >
                                                        Log Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className={`flex items-center gap-2 md:gap-4 transition-all duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
                            <button
                                onClick={onLoginClick}
                                className="text-[clamp(0.65rem,1vw,0.85rem)] font-bold border border-teal text-teal px-[clamp(0.75rem,1.5vw,1.5rem)] py-[clamp(0.35rem,0.8vh,0.6rem)] rounded-full hover:bg-teal hover:text-white transition-all duration-300"
                            >
                                Log in
                            </button>
                            <button
                                onClick={onLoginClick}
                                className="text-[clamp(0.65rem,1vw,0.85rem)] font-bold bg-[#C9A24D] text-white px-[clamp(0.75rem,1.5vw,1.5rem)] py-[clamp(0.35rem,0.8vh,0.6rem)] rounded-full hover:bg-charcoal transition-all duration-300 shadow-md"
                            >
                                Sign up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
