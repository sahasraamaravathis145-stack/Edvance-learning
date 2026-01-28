
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Target, 
  Search, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  Globe, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import { getCareerHubData } from '../services/gemini';
import { Roadmap, UserProfile } from '../types';

interface Props {
  roadmap: Roadmap;
  profile: UserProfile;
}

export default function CareerHub({ roadmap, profile }: Props) {
  const [data, setData] = useState<{analysis: string, links: string[]} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCareerData();
  }, [roadmap.levels.length, roadmap.levels.filter(l => l.status === 'completed').length]);

  const fetchCareerData = async () => {
    setLoading(true);
    try {
      const result = await getCareerHubData(roadmap, profile);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completedCount = roadmap.levels.filter(l => l.status === 'completed').length;
  const progressPercent = Math.round((completedCount / roadmap.levels.length) * 100);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 mb-4">
            <Briefcase className="w-3.5 h-3.5" /> Career Acceleration
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Professional <span className="text-purple-600">Career Hub</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Bridging the gap between your mastery of <span className="text-slate-900 font-bold">{roadmap.skill}</span> and real-world roles.</p>
        </div>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-slate-200">
          <Zap className="text-purple-400 w-5 h-5" fill="currentColor" /> Mastery: {progressPercent}%
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Analysis Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Sparkles className="text-purple-600" /> AI Career Analysis
                </h2>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Updated Live</span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
                    <Briefcase className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-slate-200" />
                  </div>
                  <p className="text-slate-500 font-bold text-center animate-pulse">Scanning 2026 job markets for {roadmap.skill} opportunities...</p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="prose prose-slate max-w-none">
                    {data?.analysis.split('\n').map((line, i) => (
                      <p key={i} className={`text-slate-600 leading-relaxed ${line.startsWith('#') ? 'text-xl font-black text-slate-900 mt-6 first:mt-0' : 'text-lg'}`}>
                        {line.replace(/#/g, '')}
                      </p>
                    ))}
                  </div>

                  {data?.links && data.links.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended Resources & Job Boards</h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {data.links.map((link, i) => (
                          <a 
                            key={i}
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-300 hover:bg-white transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 transition-all shadow-sm">
                                <Globe className="w-5 h-5" />
                              </div>
                              <span className="font-bold text-slate-700 text-sm truncate max-w-[150px]">Job Board / Guide</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-purple-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-purple-900/10">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tight">Ready to Apply?</h3>
              <p className="text-slate-400 font-medium">Our Pro membership lets you generate high-quality AI Resumes and Portfolio Projects optimized for your specific roadmap.</p>
              <button className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/20 active:scale-95">
                Optimize My Profile
              </button>
            </div>
            <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border border-white/10 p-10 backdrop-blur-sm">
               <ShieldCheck className="w-full h-full text-purple-500" />
            </div>
          </div>
        </div>

        {/* Career Stats/Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-purple-600" /> Market Trends
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'Demand Index', val: 'High', color: 'text-emerald-500' },
                { label: 'Avg Salary Growth', val: '+14%', color: 'text-purple-500' },
                { label: 'Remote Availability', val: '82%', color: 'text-purple-500' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <span className="text-slate-500 font-bold text-sm">{stat.label}</span>
                  <span className={`font-black text-lg ${stat.color}`}>{stat.val}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                <DollarSign className="w-3 h-3" /> Potential 2026 Earnings
              </div>
              <div className="text-3xl font-black text-slate-900">$120K - $185K</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase leading-tight">Based on Global Senior {roadmap.skill} Trends</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Skill Gap analysis</h3>
            </div>
            
            <div className="space-y-4">
              {roadmap.levels.slice(completedCount, completedCount + 3).map((level, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-purple-500 transition-colors" />
                  <div className="flex-1">
                    <div className="text-sm font-black text-slate-700">{level.title}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Required for Mid-Senior Roles</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
              Full Career Roadmap <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
