
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface SignupPageProps {
    onSignupSuccess: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess }) => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignupSuccess();
        navigate('/discover');
    };

    return (
        <div className="min-h-screen w-full bg-white flex flex-col md:flex-row overflow-hidden">
            {/* Left: Cinematic Image Area */}
            <div className="hidden md:block w-1/2 h-screen relative overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    src="https://images.unsplash.com/photo-1579783901586-d88db74b4fe1?q=80&w=1200"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                <div className="absolute inset-0 p-16 flex flex-col justify-between">
                    <Link to="/" className="text-white text-2xl font-black tracking-tighter flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg transform rotate-12 flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-full" />
                        </div>
                        Swe Arts
                    </Link>
                    <div className="max-w-md">
                        <h2 className="text-5xl font-black text-white leading-tight">Join the world's most curated art community.</h2>
                        <p className="mt-6 text-white/70 text-lg font-medium leading-relaxed">Connect with independent artists and find the rhythmic beauty your space has been missing.</p>
                    </div>
                </div>
            </div>

            {/* Right: Signup Form Area */}
            <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center p-8 md:p-16">
                <div className="w-full max-w-md">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-400 hover:text-charcoal transition-colors mb-12 font-bold text-sm"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </button>

                    <h1 className="text-4xl font-black text-charcoal tracking-tight mb-2">Create an account</h1>
                    <p className="text-gray-500 font-medium mb-10">Start your journey into high-fidelity discovery today.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                                <input
                                    type="text"
                                    placeholder="Elena"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Grace"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="elena@example.com"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all font-medium"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-black text-white py-4 rounded-full font-bold transition-all duration-300 transform active:scale-[0.98] shadow-xl shadow-red-600/20 mt-4"
                        >
                            Start Discovery
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-400 font-medium text-sm">
                        Already have an account? <button className="text-red-600 font-bold hover:underline">Log in</button>
                    </p>
                </div>
            </div>
        </div>
    );
};
