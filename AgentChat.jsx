import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, ChevronRight, Heart, ThumbsUp, Home, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendMessage } from '../api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AgentChat = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm GlycoMate AI, your diabetes diet assistant specializing in Sri Lankan cuisine. I provide meal advice based strictly on my knowledge base of diabetic-friendly meal plans.\n\nPlease share your details (age, gender, meal type, dietary preference) and I'll help you with personalized recommendations.\n\nNote: I can only provide information from my knowledge base and cannot give medical advice." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const messagesEndRef = useRef(null);

    const examplePrompts = [
        "Male, 50s, vegetarian breakfast with low carbs",
        "Female, 40s, non-vegetarian lunch, moderate calories",
        "Diabetic-friendly Sri Lankan snacks",
        "Dinner options with portion sizes for weight management"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (messageText = input) => {
        if (!messageText.trim()) return;

        const userMessage = { role: 'user', content: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, content: m.content }));
            const response = await sendMessage(messageText, history);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I encountered an error. Please check your connection or API key."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleExampleClick = (example) => {
        setInput(example);
        handleSend(example);
    };

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
            {/* Header */}
            <header className="p-4 bg-slate-800 border-b border-slate-700">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600 rounded-lg">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">
                                GlycoMate AI
                            </h1>
                            <p className="text-xs text-slate-400">AI Meal Planning Expert</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/">
                            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors border border-slate-600 text-sm">
                                <Home size={18} />
                                <span>Home</span>
                            </button>
                        </Link>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="md:hidden p-2 bg-slate-700 rounded-lg border border-slate-600"
                        >
                            {showMenu ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMenu && (
                    <div className="md:hidden mt-4 pt-4 border-t border-slate-700">
                        <Link to="/" onClick={() => setShowMenu(false)}>
                            <button className="w-full flex items-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                                <Home size={18} />
                                <span>Back to Home</span>
                            </button>
                        </Link>
                    </div>
                )}
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                <div className="max-w-4xl mx-auto">
                    {/* Example Prompts */}
                    {messages.length <= 1 && !isLoading && (
                        <div className="mb-8 space-y-3">
                            <p className="text-sm text-slate-400 font-medium">Try asking:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {examplePrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleExampleClick(prompt)}
                                        className="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 text-left text-sm transition-colors flex items-center gap-3"
                                    >
                                        <ChevronRight size={18} className="text-emerald-500" />
                                        <span className="text-slate-200">{prompt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                        ? 'bg-emerald-600'
                                        : 'bg-slate-700'
                                        }`}>
                                        {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
                                    </div>
                                    <div className={`p-4 rounded-xl ${msg.role === 'user'
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-800 border border-slate-700 text-slate-100'
                                        }`}>
                                        <div className="prose prose-sm prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                        {msg.role === 'assistant' && index > 0 && (
                                            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/50">
                                                <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors">
                                                    <ThumbsUp size={14} />
                                                </button>
                                                <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors">
                                                    <Heart size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex max-w-[85%] gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                                        <Bot size={20} className="text-white" />
                                    </div>
                                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-3">
                                        <Loader2 className="animate-spin text-emerald-500" size={18} />
                                        <span className="text-sm text-slate-400">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <footer className="p-4 md:p-6 bg-slate-800 border-t border-slate-700">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 p-3 rounded-lg border border-slate-600 bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-white text-sm"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-slate-500 mt-3">
                        Glycomate AI - Diabetes Assistant
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AgentChat;
