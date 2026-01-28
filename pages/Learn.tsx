
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  Zap,
  ListChecks,
  AlertCircle,
  FileText,
  Lightbulb,
  GripVertical
} from 'lucide-react';
import { Roadmap, Message } from '../types';
import { getTutorResponse } from '../services/gemini';

interface Props {
  roadmap: Roadmap;
  setCurrentLevel: (id: string) => void;
}

export default function Learn({ roadmap, setCurrentLevel }: Props) {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'concepts' | 'project'>('concepts');
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isResizing = useRef(false);

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I'm your Edvance tutor. Let's dive into this concept. Any questions on the content above?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const level = roadmap.levels.find(l => l.id === levelId) || roadmap.levels[0];
  const concept = level.concepts[activeConceptIndex];

  useEffect(() => {
    if (levelId && levelId !== 'current') setCurrentLevel(levelId);
  }, [levelId, setCurrentLevel]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startResizing = useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = e.clientX - 300; // Offset based on main sidebar
    if (newWidth >= 250 && newWidth <= 600) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const context = mode === 'concepts' ? `Concept: ${concept}` : `Project: ${level.project?.title}`;

    try {
      const reply = await getTutorResponse(level, context, userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having a bit of trouble connecting. Try again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const nextConcept = () => {
    if (activeConceptIndex < level.concepts.length - 1) {
      setActiveConceptIndex(activeConceptIndex + 1);
      setMessages([{ role: 'model', content: `Great! Moving on to **${level.concepts[activeConceptIndex + 1]}**. What would you like to know about it?` }]);
    } else if (mode === 'concepts') {
      setMode('project');
      setMessages([{ role: 'model', content: `You've covered the core concepts! Now let's tackle the project: **${level.project?.title}**. How can I help you get started?` }]);
    } else {
      navigate(`/quiz/${level.id}`);
    }
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex gap-0 relative overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
      
      {/* Resizable Sidebar Content */}
      <div 
        style={{ width: sidebarWidth }}
        className="flex-shrink-0 flex flex-col border-r border-slate-100 bg-slate-50/30 overflow-hidden relative group/sidebar"
      >
        <div className="p-6 space-y-6 h-full overflow-y-auto custom-scrollbar">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-medium transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-4">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button 
                onClick={() => setMode('concepts')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'concepts' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}
              >
                Topics
              </button>
              <button 
                onClick={() => setMode('project')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'project' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}
              >
                Project
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-purple-600 font-black text-[9px] uppercase tracking-widest mb-1">Module {level.id}</div>
                <h1 className="text-xl font-black text-slate-900 leading-tight">{level.title}</h1>
              </div>

              <div className="space-y-2">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Outline</h3>
                <div className="space-y-1.5">
                  {level.concepts.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveConceptIndex(i);
                        setMode('concepts');
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                        mode === 'concepts' && activeConceptIndex === i 
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' 
                          : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-600 border border-slate-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 text-[10px] ${
                        mode === 'concepts' && activeConceptIndex === i ? 'border-white bg-white/20' : 'border-slate-100 bg-slate-50'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="truncate">{c}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setMode('project')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                      mode === 'project' 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' 
                        : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-600 border border-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                      mode === 'project' ? 'border-white bg-white/20' : 'border-slate-100 bg-slate-50'
                    }`}>
                      <Zap className="w-3 h-3" />
                    </div>
                    <span className="truncate">Capstone Project</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-purple-400/30 active:bg-purple-600 transition-colors z-10 flex items-center justify-center group/handle"
        >
          <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover/sidebar:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Main Lesson Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Educational Content Area */}
        <div className="flex-1 overflow-y-auto p-10 pb-64 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            {mode === 'concepts' ? (
              <>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-purple-600">
                    <BookOpen className="w-8 h-8" />
                    <span className="text-sm font-black uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">Theoretical Foundations</span>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">{concept}</h1>
                    <p className="text-xl text-slate-500 font-medium">Core principle of {level.title}</p>
                  </div>
                  <div className="h-1.5 w-32 bg-purple-600 rounded-full" />
                </div>

                <div className="prose prose-slate max-w-none space-y-10">
                  <div className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-purple-600" />
                    <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                       <FileText className="text-purple-600 w-7 h-7" /> Abstract Exploration
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-xl">
                      Mastering **{concept}** involves understanding the fundamental architectural patterns that allow {roadmap.skill} to scale effectively. 
                    </p>
                    <p className="mt-6 text-slate-600 leading-relaxed text-lg">
                      In real-world application, this allows you to reduce complexity by decoupling internal logic from external interfaces. By the end of this module, you should be able to identify use-cases where this pattern prevents technical debt.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 bg-purple-50 rounded-[2.5rem] border border-purple-100 shadow-sm">
                      <h4 className="text-lg font-black text-purple-900 mb-4 flex items-center gap-3">
                        <Zap className="w-5 h-5" fill="currentColor" /> Mastery Objectives
                      </h4>
                      <ul className="space-y-4 text-purple-800/80 font-medium">
                        <li className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                          <span>Understand lifecycle management within the scope of {concept}.</span>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                          <span>Identify common anti-patterns that lead to inefficient implementations.</span>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                          <span>Apply modern 2026 conventions for high-performance outcomes.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 shadow-sm flex flex-col justify-center">
                      <h4 className="text-lg font-black text-amber-900 mb-4 flex items-center gap-3">
                        <Lightbulb className="w-6 h-6" /> Pro Insight
                      </h4>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        "Don't just memorize the definitions. Ask the AI tutor below to generate a **hypothetical failure scenario** where {concept} was ignored, and how it would be resolved."
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <Zap className="w-8 h-8" fill="currentColor" />
                    <span className="text-sm font-black uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Capstone Milestone</span>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">{level.project?.title}</h1>
                    <p className="text-xl text-slate-500 font-medium italic">Synthesizing knowledge from {level.concepts.length} core concepts.</p>
                  </div>
                  <div className="h-1.5 w-32 bg-emerald-500 rounded-full" />
                </div>

                <div className="space-y-12">
                  <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                      <ListChecks className="text-emerald-500 w-8 h-8" /> Implementation Strategy
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {level.project?.requirements.map((req, i) => (
                        <div key={i} className="flex items-start gap-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 transition-all hover:bg-emerald-50/30">
                          <CheckCircle className="text-emerald-500 w-6 h-6 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 font-bold leading-tight">{req}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <AlertCircle className="text-amber-500 w-8 h-8" /> Tactical Challenges
                    </h3>
                    <div className="grid md:grid-cols-2 gap-10">
                      {level.project?.challenges.map((chal, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2.5 flex-shrink-0" />
                          <p className="text-slate-300 font-medium leading-relaxed">{chal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* FIXED CHATBOT INTERFACE at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-8 z-20 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Latest AI Message Preview */}
            <div className="flex items-start gap-4 px-2">
               <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-200">
                 <Sparkles className="text-white w-6 h-6" />
               </div>
               <div className="bg-slate-50 p-5 rounded-2xl rounded-bl-none max-w-[90%] border border-slate-100">
                  <p className="text-slate-700 font-medium leading-relaxed animate-in slide-in-from-bottom-2">
                    {messages[messages.length - 1].content}
                  </p>
               </div>
               {isTyping && <Loader2 className="w-5 h-5 animate-spin text-purple-400 mt-5" />}
            </div>

            <div className="flex gap-4">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={mode === 'concepts' ? `Ask AI about ${concept}...` : `Ask about the capstone project...`}
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all shadow-sm text-lg"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="bg-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center hover:bg-purple-700 transition-all shadow-xl shadow-purple-200 disabled:opacity-50 active:scale-95"
              >
                <Send className="w-7 h-7" />
              </button>
            </div>
            
            <div className="flex items-center justify-between px-2 pt-2">
              <button 
                onClick={() => {
                  if (mode === 'project') setMode('concepts');
                  else if (activeConceptIndex > 0) setActiveConceptIndex(activeConceptIndex - 1);
                }}
                disabled={mode === 'concepts' && activeConceptIndex === 0}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <div className="flex items-center gap-2">
                {level.concepts.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${mode === 'concepts' && activeConceptIndex === i ? 'w-8 bg-purple-600' : 'w-2 bg-slate-200'}`} />
                ))}
                <div className={`h-1.5 rounded-full transition-all duration-300 ${mode === 'project' ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-200'}`} />
              </div>

              <button 
                onClick={nextConcept}
                className="text-purple-600 hover:text-purple-700 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
              >
                {mode === 'project' ? 'Finish Level' : (activeConceptIndex === level.concepts.length - 1 ? 'Start Project' : 'Next Topic')} 
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
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
          background: #9333ea30;
        }
      `}</style>
    </div>
  );
}
