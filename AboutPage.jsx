import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Activity, ArrowLeft } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Header */}
            <header className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-600 rounded-md">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-900">GlycoMate AI</span>
                    </div>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <section className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-6">About GlycoMate AI</h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        GlycoMate AI is a specialized AI assistant designed to help individuals managing Type 2 Diabetes find nutritious, culturally-appropriate meal options within Sri Lankan cuisine.
                    </p>
                </section>

                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                            <Heart size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Empowering common people living with diabetes to make better dietary choices without sacrificing their cultural heritage. We believe that managing health should be accessible, intuitive, and respectful of local traditions.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                            <Activity size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            Our AI provides personalized meal recommendations based on established diabetic-friendly meal plans. By analyzing popular Sri Lankan ingredients and dishes, we help you understand portion sizes and glycemic impacts for everyday meals.
                        </p>
                    </div>
                </div>

                <section className="bg-slate-900 rounded-2xl p-10 text-white mb-16">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-2 bg-emerald-600 rounded-lg">
                            <Shield size={24} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold">Important Disclaimer</h2>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm mb-6">
                        GlycoMate AI is an educational tool and does not provide medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                    </p>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        Our recommendations are based on general knowledge and should be discussed with your healthcare team to ensure they fit your specific needs and medical history.
                    </p>
                </section>

                <div className="text-center">
                    <Link to="/chat">
                        <button className="px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-bold text-lg inline-flex items-center gap-2">
                            Try Fast Assistant
                        </button>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-tighter">AI-Powered Diabetes Diet Assistant for Sri Lankan Cuisine</p>
                    <p className="text-xs text-slate-400">
                        © 2026 GlycoMate AI.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AboutPage;
