import { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, ArrowRight, Plus, CheckCircle2, CreditCard, Landmark, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/priceFormatter';
import { UserAddress } from '../services/userService';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckoutProps {
    cartItems: any[];
    currentUser: any;
    savedAddresses: UserAddress[];
    onSaveAddress: (address: UserAddress) => Promise<void>;
    onClearCart: () => void;
}

export function Checkout({ cartItems, currentUser, savedAddresses, onSaveAddress, onClearCart }: CheckoutProps) {
    const navigate = useNavigate();
    const [isAddingNew, setIsAddingNew] = useState(savedAddresses.length === 0);
    const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses.find(a => a.isDefault)?.id || savedAddresses[0]?.id || '');
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
    const [isProcessing, setIsProcessing] = useState(false);

    // New Address Form State
    const [newAddress, setNewAddress] = useState<UserAddress>({
        id: '',
        fullName: currentUser?.displayName || '',
        mobile: '',
        house: '',
        street: '',
        city: '',
        state: '',
        pincode: ''
    });

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

    // Pincode Resolution Logic
    useEffect(() => {
        if (newAddress.pincode.length === 6) {
            // Mock resolution
            const pincodeMap: Record<string, { city: string, state: string }> = {
                '500081': { city: 'Hyderabad', state: 'Telangana' },
                '110001': { city: 'New Delhi', state: 'Delhi' },
                '400001': { city: 'Mumbai', state: 'Maharashtra' },
                '560001': { city: 'Bengaluru', state: 'Karnataka' },
                '600001': { city: 'Chennai', state: 'Tamil Nadu' }
            };
            const resolved = pincodeMap[newAddress.pincode];
            if (resolved) {
                setNewAddress(prev => ({ ...prev, city: resolved.city, state: resolved.state }));
            }
        }
    }, [newAddress.pincode]);

    const handleSaveNewAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        const addressToSave = { ...newAddress, id: Date.now().toString(), isDefault: savedAddresses.length === 0 };
        await onSaveAddress(addressToSave);
        setSelectedAddressId(addressToSave.id);
        setIsAddingNew(false);
    };

    const handlePlaceOrder = () => {
        if (!selectedAddressId && !isAddingNew) {
            alert("Please select or add a delivery address.");
            return;
        }
        setIsProcessing(true);
        // Simulate payment & order processing
        setTimeout(() => {
            setIsProcessing(false);
            onClearCart();
            navigate('/success');
        }, 2500);
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }
    return (
        <div className="pt-[clamp(6rem,12vh,8rem)] pb-24 px-[clamp(1rem,5vw,4rem)] min-h-screen bg-ivory relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-12">
                    <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-charcoal tracking-tighter uppercase italic leading-none">Checkout</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal/30 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-teal" /> Secure Studio Logistics
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-2 space-y-12">

                        {/* 1. ADDRESS SECTION */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-charcoal uppercase tracking-tighter flex items-center gap-3">
                                    <MapPin size={24} className="text-teal" /> 1. Delivery Address
                                </h2>
                                {!isAddingNew && (
                                    <button
                                        onClick={() => setIsAddingNew(true)}
                                        className="text-[10px] font-black uppercase tracking-widest text-teal hover:underline flex items-center gap-2"
                                    >
                                        <Plus size={14} /> Add New Address
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {isAddingNew ? (
                                    <motion.form
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        onSubmit={handleSaveNewAddress}
                                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-charcoal/5 space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-2">Full Name</label>
                                                <input required type="text" value={newAddress.fullName} onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })} className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-teal outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-2">Mobile Number</label>
                                                <input required type="tel" value={newAddress.mobile} onChange={e => setNewAddress({ ...newAddress, mobile: e.target.value })} className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-teal outline-none" />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-2">Flat / House / Building</label>
                                                <input required type="text" value={newAddress.house} onChange={e => setNewAddress({ ...newAddress, house: e.target.value })} className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-teal outline-none" />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-2">Street / Area</label>
                                                <input required type="text" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-teal outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-2">Pincode</label>
                                                <input required type="text" maxLength={6} value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} placeholder="e.g. 500081" className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-teal outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30 ml-2">City & State</label>
                                                <div className="w-full bg-ivory/50 border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold text-charcoal/40">
                                                    {newAddress.city ? `${newAddress.city}, ${newAddress.state}` : 'Waiting for Pincode...'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 pt-4">
                                            <button type="submit" className="flex-1 bg-charcoal text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal transition-all">Save & Continue</button>
                                            {savedAddresses.length > 0 && <button type="button" onClick={() => setIsAddingNew(false)} className="px-6 border border-charcoal/10 rounded-xl text-[10px] font-black uppercase tracking-widest">Cancel</button>}
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        {savedAddresses.map(address => (
                                            <div
                                                key={address.id}
                                                onClick={() => setSelectedAddressId(address.id)}
                                                className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all relative ${selectedAddressId === address.id ? 'border-teal bg-white shadow-xl' : 'border-charcoal/5 bg-white/50 hover:border-teal/30'}`}
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <p className="text-sm font-black text-charcoal uppercase tracking-tight">{address.fullName}</p>
                                                    {selectedAddressId === address.id && <CheckCircle2 size={18} className="text-teal" />}
                                                </div>
                                                <p className="text-[11px] text-charcoal/60 leading-relaxed">
                                                    {address.house}, {address.street}<br />
                                                    {address.city}, {address.state} - {address.pincode}<br />
                                                    <span className="font-bold text-charcoal mt-2 inline-block">Phone: {address.mobile}</span>
                                                </p>
                                                {address.isDefault && (
                                                    <span className="absolute bottom-6 right-6 text-[8px] font-black uppercase tracking-widest bg-charcoal/5 px-2 py-0.5 rounded text-charcoal/30">Default</span>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* 2. PAYMENT SECTION */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-black text-charcoal uppercase tracking-tighter flex items-center gap-3">
                                <ShieldCheck size={24} className="text-teal" /> 2. Secure Payment
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'upi', icon: <Smartphone size={18} />, label: 'UPI / GPay' },
                                    { id: 'card', icon: <CreditCard size={18} />, label: 'Card / EMI' },
                                    { id: 'netbanking', icon: <Landmark size={18} />, label: 'Net Banking' }
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id as any)}
                                        className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all ${paymentMethod === method.id ? 'border-teal bg-white shadow-lg' : 'border-charcoal/5 bg-white/50'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === method.id ? 'bg-teal text-white' : 'bg-charcoal/5 text-charcoal/30'}`}>
                                            {method.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{method.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-charcoal/5">
                                {paymentMethod === 'upi' && (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Enter UPI ID</p>
                                        <input type="text" placeholder="user@okaxis" className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-teal outline-none" />
                                        <div className="flex items-center gap-2 pt-2">
                                            <input type="checkbox" id="saveUPI" className="accent-teal" defaultChecked />
                                            <label htmlFor="saveUPI" className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Save this ID for future orders</label>
                                        </div>
                                    </div>
                                )}
                                {paymentMethod === 'card' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Card Number</label>
                                            <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-teal outline-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Expiry</label>
                                                <input type="text" placeholder="MM/YY" className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-teal outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">CVV</label>
                                                <input type="password" placeholder="•••" className="w-full bg-ivory border border-charcoal/5 rounded-2xl py-4 px-6 text-xs font-bold focus:ring-2 focus:ring-teal outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Panel: Side Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-charcoal/5 sticky top-32 space-y-8">
                            <h3 className="text-xl font-black text-charcoal uppercase tracking-tighter">Order Summary</h3>

                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-ivory">
                                            <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-charcoal truncate uppercase">{item.name}</p>
                                            <p className="text-[9px] font-bold text-charcoal/30 uppercase">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-[10px] font-black text-charcoal">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-charcoal/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-charcoal/30">Subtotal</span>
                                    <span className="text-sm font-black text-charcoal">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-teal">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Studio Shipping</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Free</span>
                                </div>
                                <div className="flex justify-between items-center pt-4">
                                    <span className="text-base font-black uppercase tracking-widest text-charcoal">Total</span>
                                    <span className="text-2xl font-black text-charcoal">{formatPrice(subtotal)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing || isAddingNew}
                                className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all relative overflow-hidden ${isProcessing || isAddingNew ? 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed' : 'bg-charcoal text-white hover:bg-teal shadow-xl shadow-teal/20'}`}
                            >
                                {isProcessing ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                ) : (
                                    <>Pay {formatPrice(subtotal)} <ArrowRight size={18} /></>
                                )}
                            </button>

                            <div className="text-center space-y-4">
                                <p className="text-[9px] font-bold text-charcoal/30 uppercase tracking-[0.2em]">Guaranteed Safe Checkout</p>
                                <div className="flex justify-center gap-4 opacity-10">
                                    <div className="w-8 h-8 rounded-full bg-charcoal" />
                                    <div className="w-8 h-8 rounded-full bg-charcoal" />
                                    <div className="w-8 h-8 rounded-full bg-charcoal" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Processing Overlay */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[5000] bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8"
                    >
                        <div className="relative w-32 h-32 mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute inset-0 border-4 border-charcoal/5 border-t-teal rounded-full"
                            />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute inset-4 bg-teal rounded-full flex items-center justify-center text-white"
                            >
                                <ShieldCheck size={40} />
                            </motion.div>
                        </div>
                        <h3 className="text-2xl font-black text-charcoal uppercase tracking-tighter mb-2 italic">Securing Your Art</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-charcoal/30">Authenticating transaction with your bank...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
