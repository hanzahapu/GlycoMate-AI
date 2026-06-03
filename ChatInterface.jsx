import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, ChevronRight, Heart, ThumbsUp } from 'lucide-react';
import { sendMessage } from '../api';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm GlycoMate AI, your diabetes diet assistant specializing in Sri Lankan cuisine. I provide meal advice based strictly on my knowledge base of diabetic-friendly meal plans.\n\nPlease share your details (age, gender, meal type, dietary preference) and I'll help you with personalized recommendations.\n\nNote: I can only provide information from my knowledge base and cannot give medical advice." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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
        <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Header */}
            <header className="p-4 bg-white border-b border-slate-200 shadow-sm flex items-center gap-3 sticky top-0 z-10">
                <div className="p-2 bg-emerald-600 rounded-lg text-white">
                    <Bot size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900">
                        GlycoMate AI
                    </h1>
                    <p className="text-xs text-slate-500">Meal Planning Expert</p>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Example Prompts */}
                {messages.length === 1 && !isLoading && (
                    <div className="max-w-2xl mx-auto space-y-3">
                        <p className="text-sm text-slate-600 font-medium">Try asking:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {examplePrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleExampleClick(prompt)}
                                    className="p-3 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 text-left text-sm text-slate-700 transition-colors flex items-center gap-2"
                                >
                                    <ChevronRight size={16} className="text-emerald-600" />
                                    {prompt}
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
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-emerald-600 border border-slate-200'
                                    }`}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className={`p-4 rounded-xl ${msg.role === 'user'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-slate-700 border border-slate-100 shadow-sm'
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                                    {msg.role === 'assistant' && index > 0 && (
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                                            <button className="p-1.5 rounded hover:bg-slate-50 text-slate-400 hover:text-emerald-600 transition-colors">
                                                <ThumbsUp size={14} />
                                            </button>
                                            <button className="p-1.5 rounded hover:bg-slate-50 text-slate-400 hover:text-rose-600 transition-colors">
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
                                <div className="w-10 h-10 rounded-lg bg-white text-emerald-600 border border-slate-200 flex items-center justify-center">
                                    <Bot size={18} />
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 text-slate-500">
                                    <Loader2 className="animate-spin" size={16} />
                                    <span className="text-sm">Preparing...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="p-4 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-2">
                    Glycomate AI - Diabetes Assistant
                </p>
            </footer>
        </div>
    );
};

export default ChatInterface;
