import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OrderSuccess() {
    const navigate = useNavigate();
    const orderNumber = `SW-${Math.floor(100000 + Math.random() * 900000)}`;

    return (
        <div className="pt-40 pb-24 px-8 min-h-screen bg-white flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="text-center space-y-12 max-w-2xl bg-white p-16 rounded-[4rem] shadow-2xl border border-charcoal/5 relative overflow-hidden"
            >
                {/* Background Artful Element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C9A24D]/5 rounded-full -ml-32 -mb-32 blur-3xl" />

                <div className="relative z-10 space-y-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", damping: 10 }}
                        className="w-24 h-24 bg-teal/10 text-teal rounded-full flex items-center justify-center mx-auto"
                    >
                        <CheckCircle2 size={48} />
                    </motion.div>

                    <div className="space-y-4">
                        <p className="text-[#C9A24D] font-black uppercase tracking-[0.4em] text-[10px]">Studio Order Confirmed</p>
                        <h1 className="text-[clamp(2.5rem,4vw,4.5rem)] font-black text-charcoal tracking-tighter uppercase italic leading-none">
                            Your Art is<br />Preparing for Wings
                        </h1>
                        <div className="inline-block bg-charcoal text-white px-6 py-2 rounded-xl text-xs font-black tracking-widest mt-4">
                            ORDER# {orderNumber}
                        </div>
                    </div>

                    <div className="max-w-md mx-auto space-y-6">
                        <p className="text-charcoal/50 font-medium leading-relaxed italic text-lg">
                            "A piece of our soul is now on its way to your modern space. Thank you for supporting curated craftsmanship."
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">
                            A detailed receipt and tracking link has been sent to your registered email.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-charcoal hover:bg-teal text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all"
                        >
                            Return to Gallery
                        </button>
                        <button
                            onClick={() => navigate('/shop')}
                            className="w-full bg-ivory border-2 border-charcoal/5 hover:border-charcoal text-charcoal py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
                        >
                            <ShoppingBag size={18} /> Continue Shopping
                        </button>
                    </div>

                    <div className="pt-8 border-t border-charcoal/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-charcoal/20">SWE ARTS STUDIO • 2024 COLLECTION</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
