import { Sparkles, Heart, Shield, Zap, ArrowRight, MessageSquare, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/GlycoMateAI.png';

const LandingPage = () => {
    const features = [
        {
            icon: <Sparkles className="w-6 h-6" />,
            title: "AI-Powered Guidance",
            description: "Get personalized meal plans using advanced AI technology"
        },
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Sri Lankan Cuisine",
            description: "Culturally appropriate meals tailored to your preferences"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Evidence-Based",
            description: "Recommendations from verified diabetic meal plans"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Instant Responses",
            description: "Get meal advice in seconds, anytime you need it"
        }
    ];

    const stats = [
        { icon: <Users />, value: "1000+", label: "Users Helped" },
        { icon: <MessageSquare />, value: "5000+", label: "Conversations" },
        { icon: <Activity />, value: "95%", label: "Satisfaction Rate" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src={logoImg} 
                            alt="GlycoMate AI" 
                            className="w-10 h-10"
                        />
                        <span className="text-xl font-bold text-slate-900">
                            GlycoMate AI
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#features" className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
                        <Link to="/about" className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">About</Link>
                        <Link to="/chat">
                            <button className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
                                Start Chat
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                                Your Personal <span className="text-emerald-600">Diabetes Diet</span> Assistant
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Get personalized, culturally-appropriate meal plans for Type 2 Diabetes.
                                Powered by AI, backed by science, designed for Sri Lankan cuisine.
                            </p>
                            <div className="flex gap-4">
                                <Link to="/chat">
                                    <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold flex items-center gap-2">
                                        Try It Free
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>
                                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 mb-1">You asked:</p>
                                            <p className="text-slate-800 font-medium">"Vegetarian breakfast for 50s male"</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100">
                                        <div className="w-10 h-10 bg-white border border-emerald-200 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Sparkles className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-500 mb-2">GlycoMate AI suggests:</p>
                                            <div className="space-y-2 text-sm text-slate-700">
                                                <p>✓ String hoppers (2 portions)</p>
                                                <p>✓ Dhal curry (1/2 cup)</p>
                                                <p>✓ Pol sambol (2 tbsp)</p>
                                                <p className="text-xs text-emerald-600 font-medium">Low carb impact</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-50 rounded-lg mb-4 text-emerald-600 border border-slate-100">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">
                        Why Choose GlycoMate AI?
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 text-left hover:border-emerald-200 transition-colors">
                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-900 rounded-2xl p-10 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                        <p className="text-lg mb-8 text-slate-400">
                            Get personalized meal plans in seconds. No signup required.
                        </p>
                        <Link to="/chat">
                            <button className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold inline-flex items-center gap-2">
                                Start Chatting Now
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-1.5 bg-emerald-600 rounded-md">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">GlycoMate AI</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-tighter">AI-Powered Diabetes Diet Assistant for Sri Lankan Cuisine</p>
                    <p className="text-xs text-slate-400">
                        © 2026 GlycoMate AI.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
