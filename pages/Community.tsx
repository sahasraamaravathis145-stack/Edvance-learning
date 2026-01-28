
import React, { useState, useEffect } from 'react';
// Import Link from react-router-dom for navigation
import { Link } from 'react-router-dom';
import { 
  Network, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Globe, 
  ExternalLink,
  ChevronRight,
  Loader2,
  TrendingUp,
  ShieldCheck,
  Search
} from 'lucide-react';
import { getIndustryExpertAdvice } from '../services/gemini';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
}

export default function Community({ profile }: Props) {
  const [advice, setAdvice] = useState<{text: string, urls: string[]} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdvice();
  }, [profile.targetSkill]);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const data = await getIndustryExpertAdvice(profile.targetSkill);
      setAdvice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const learners = [
    { name: 'Arjun K.', skill: 'Python Dev', status: 'Mastering Django', streak: 12 },
    { name: 'Sarah L.', skill: 'UI/UX Design', status: 'Learning Figma', streak: 45 },
    { name: 'Dev P.', skill: 'Data Science', status: 'Exploring ML', streak: 8 },
    { name: 'Li W.', skill: 'Cloud Compute', status: 'AWS Certified Path', streak: 22 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Global <span className="text-purple-600">Community</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Connect with learners and get real-time insights from industry pros.</p>
        </div>
        <div className="flex items-center -space-x-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
              {i}
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white bg-purple-600 flex items-center justify-center text-[10px] font-black text-white">
            12K+
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Real-time Expert Advice Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Expert Industry Briefing</h2>
                    <p className="text-purple-300 text-xs font-bold uppercase tracking-widest">Real-time Insights for {profile.targetSkill}</p>
                  </div>
                </div>
                <button 
                  onClick={fetchAdvice}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all"
                >
                  <TrendingUp className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                  <p className="text-purple-100/60 font-medium italic">Gemini is searching current 2026 industry trends...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose prose-invert prose-purple max-w-none">
                    <p className="text-slate-300 leading-relaxed text-lg italic">
                      {advice?.text || "Industry experts recommend staying focused on the core fundamentals of your chosen path while adopting new AI-assisted workflows."}
                    </p>
                  </div>
                  
                  {advice?.urls && advice.urls.length > 0 && (
                    <div className="space-y-3 pt-6 border-t border-white/10">
                      <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest">Cited Expert Sources</h4>
                      <div className="flex flex-wrap gap-3">
                        {advice.urls.slice(0, 3).map((url, i) => (
                          <a 
                            key={i}
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                          >
                            <ExternalLink className="w-3 h-3" /> Expert Case {i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <MessageSquare className="text-purple-600" /> Peer Discussion
              </h3>
              <p className="text-slate-500 text-sm font-medium">Coming soon: Real-time community forums and peer roadmap reviews.</p>
              <div className="pt-4">
                <button className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed">
                  Join Beta Waitlist
                </button>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <ShieldCheck className="text-emerald-600" /> Skill Verification
              </h3>
              <p className="text-slate-500 text-sm font-medium">Get your roadmap milestones verified by industry peers for credible proof of mastery.</p>
              <div className="pt-4">
                <button className="w-full bg-emerald-50 text-emerald-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all">
                  Setup Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Community Members Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Users className="text-purple-600" /> Active Learners
              </h3>
              <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Live</div>
            </div>
            
            <div className="space-y-6">
              {learners.map((learner, i) => (
                <div key={i} className="flex items-center gap-5 group cursor-pointer">
                  <div className="relative">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-all font-bold">
                      {learner.name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-slate-900 truncate">{learner.name}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight truncate">{learner.status}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-orange-600">{learner.streak}d</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Streak</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-200">
              View All Members
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                 <Sparkles className="w-6 h-6" />
               </div>
               <h3 className="text-lg font-black text-slate-900">Career Hub Sneak Peek</h3>
             </div>
             <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
               Based on your current progress in <span className="text-purple-600 font-bold">{profile.targetSkill}</span>, you are qualifying for Junior Level roles.
             </p>
             <Link 
               to="/career"
               className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-300 hover:bg-purple-50 transition-all group/card"
             >
               <span className="font-black text-slate-700 text-sm">Explore Career Hub</span>
               <ChevronRight className="w-5 h-5 text-slate-300 group-hover/card:text-purple-600 transition-all" />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
