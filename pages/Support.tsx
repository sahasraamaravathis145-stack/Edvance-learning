
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  HelpCircle, 
  LifeBuoy, 
  Send, 
  Sparkles, 
  Loader2,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Bot,
  User as UserIcon,
  Search,
  ExternalLink,
  Shield
} from 'lucide-react';
import { getSupportResponse } from '../services/gemini';
import { Message } from '../types';

export default function Support() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm the **Edvance Elite Support AI**. \n\nI specialize in helping you maximize your learning efficiency on our platform. Whether you need help with your roadmap, troubleshooting a project milestone, or understanding our adaptive assessments, I'm here to assist. \n\nHow can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customMsg?: string) => {
    const msgToSend = customMsg || input;
    if (!msgToSend.trim() || isTyping) return;
    
    const userMsg = msgToSend.trim();
    if (!customMsg) setInput("");
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const reply = await getSupportResponse(userMsg);
      setMessages(prev => [...prev, { role: 'model', content: reply || "I apologize, but I encountered an internal processing error. Please rephrase your query." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Our support systems are currently undergoing maintenance. Please reach out via email for urgent matters." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    "Reset my progress",
    "AI tutor limitations",
    "Project guidelines"
  ];

  const faqs = [
    { 
      q: "How does the AI create my roadmap?", 
      a: "Our proprietary AI engine synthesizes data from your proficiency assessment and target goals. It maps a logical progression through fundamental concepts while embedding project-based milestones that validate your practical application of the material." 
    },
    { 
      q: "Can I change my target skill?", 
      a: "Absolutely. You can initialize a new learning journey at any time. Simply navigate to your Profile and select 'Reset Progress' to re-onboard for a different skill set." 
    },
    { 
      q: "What if the AI tutor is stuck?", 
      a: "While our Gemini-powered tutors are highly capable, they can occasionally lose context. Try resetting the conversation or asking more specific, granular questions to get the best results." 
    },
    { 
      q: "How do I track my daily progress?", 
      a: "The Edvance Analytics dashboard provides granular insights. We track time-on-task, concept mastery percentages, and your assessment accuracy to give you a 'Mastery Score'." 
    },
    { 
      q: "Is Edvance free to use?", 
      a: "Edvance offers a free tier for individual learners. Our Pro membership unlocks higher-parameter models (Gemini Pro), unlimited roadmap iterations, and priority support." 
    },
    { 
      q: "Is my data used for AI training?", 
      a: "We prioritize your privacy. Interaction data is used to maintain context in your session, but personal identifiers are never used to train global models without explicit permission." 
    }
  ];

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    return faqs.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="bg-[#0F172A] text-white pt-16 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium mb-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              Support <span className="text-blue-500">Center</span>
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
              Our support team and AI systems are here to ensure your learning experience is frictionless and high-impact.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* FAQ Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <HelpCircle className="text-blue-600 w-5 h-5" />
                  </div>
                  Knowledge Base
                </h2>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics or keywords..." 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, i) => (
                    <div key={i} className="group border border-slate-100 rounded-2xl transition-all hover:border-blue-200 overflow-hidden">
                      <button 
                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className={`font-bold text-lg transition-colors ${expandedFaq === i ? 'text-blue-600' : 'text-slate-800'}`}>
                          {faq.q}
                        </span>
                        <div className={`transition-transform duration-300 ${expandedFaq === i ? 'rotate-180' : ''}`}>
                          <ChevronDown className={expandedFaq === i ? 'text-blue-600' : 'text-slate-300'} />
                        </div>
                      </button>
                      {expandedFaq === i && (
                        <div className="px-6 pb-6 text-slate-500 leading-relaxed text-[15px] animate-in slide-in-from-top-2 duration-300">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 px-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No matching topics found</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                      We couldn't find any FAQs matching "{searchQuery}". Try using different keywords or chat with our Elite Support AI.
                    </p>
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="mt-6 text-blue-600 font-bold hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-colors">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Mail className="text-emerald-600 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Email Inquiries</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Formal support for complex technical issues or business partnerships.
                  </p>
                </div>
                <a href="mailto:edvance.contact.edu.in@gmail.com" className="mt-6 inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                  Contact Support <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="bg-[#5865F2] p-8 rounded-3xl text-white flex flex-col justify-between shadow-xl shadow-blue-200/20">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <MessageCircle className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Discord Community</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Connect with thousands of fellow learners and share your roadmap progress.
                  </p>
                </div>
                <button className="mt-6 bg-white text-[#5865F2] w-full py-3 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                  Join Server
                </button>
              </div>
            </div>
          </div>

          {/* Chatbot Column */}
          <div className="lg:col-span-5 h-[750px] sticky top-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col h-full overflow-hidden">
              {/* Chat Header */}
              <div className="px-8 py-6 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Elite Support AI</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Platform Intelligence Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white custom-scrollbar">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-5 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-blue-600' : 'bg-slate-900'}`}>
                      {m.role === 'user' ? <UserIcon className="text-white w-5 h-5" /> : <Sparkles className="text-white w-5 h-5" />}
                    </div>
                    <div className={`max-w-[85%] space-y-2`}>
                      <div className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                      }`}>
                        {m.content.split('\n').map((line, idx) => (
                          <p key={idx} className={line.startsWith('**') ? 'font-bold mt-2 first:mt-0' : 'mt-1'}>
                            {line.replace(/\*\*/g, '')}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-5">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
                      <Bot className="text-white w-5 h-5" />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              {/* Input Area */}
              <div className="p-8 bg-slate-50/50 border-t border-slate-100 space-y-6">
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(q)}
                        className="text-xs bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-full hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold shadow-sm"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Inquire about Edvance..."
                    className="w-full bg-white border border-slate-200 rounded-3xl pl-6 pr-16 py-5 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={isTyping || !input.trim()}
                    className="absolute right-2.5 top-2.5 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-20 disabled:scale-90 active:scale-95 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <Shield className="w-3 h-3" />
                  Secured by Edvance Intelligence Protocol
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-slate-200 text-center">
          <p className="text-slate-400 font-medium">© 2026 Edvance. Empowering personal mastery through artificial intelligence.</p>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}
