
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  Award, 
  Clock, 
  Target, 
  Zap,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { AppState } from '../types';
import { generateWeeklySummary } from '../services/gemini';

interface Props {
  state: AppState;
}

export default function ProgressPage({ state }: Props) {
  const { roadmap, profile, streak } = state;
  const [aiSummary, setAiSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (roadmap) {
      fetchSummary();
    }
  }, [roadmap, streak]);

  const fetchSummary = async () => {
    if (!roadmap) return;
    setLoadingSummary(true);
    try {
      const summary = await generateWeeklySummary(roadmap, streak);
      setAiSummary(summary);
    } catch (err) {
      setAiSummary("Your progress is trending upwards. Stay consistent with your daily practice to maintain momentum.");
    } finally {
      setLoadingSummary(false);
    }
  };

  if (!roadmap || !profile) return null;

  const studyData = [
    { day: 'Mon', mins: 45 },
    { day: 'Tue', mins: 60 },
    { day: 'Wed', mins: 30 },
    { day: 'Thu', mins: 50 },
    { day: 'Fri', mins: 90 },
    { day: 'Sat', mins: 120 },
    { day: 'Sun', mins: 45 },
  ];

  const skillData = [
    { subject: 'Theory', A: 80, fullMark: 100 },
    { subject: 'Practical', A: 65, fullMark: 100 },
    { subject: 'Consistency', A: 90, fullMark: 100 },
    { subject: 'Accuracy', A: 75, fullMark: 100 },
    { subject: 'Pace', A: 85, fullMark: 100 },
  ];

  const progressPercent = Math.round((roadmap.levels.filter(l => l.status === 'completed').length / roadmap.levels.length) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Learning Analytics</h1>
          <p className="text-slate-500 mt-2 font-medium">Data-driven insights into your mastery of <span className="text-blue-600 font-bold">{profile.targetSkill}</span>.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchSummary}
            className="bg-white border border-slate-200 text-slate-600 p-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-5 h-5 ${loadingSummary ? 'animate-spin' : ''}`} />
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
            Export Report <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Completion', val: `${progressPercent}%`, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Streak', val: `${state.streak} Days`, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Time Spent', val: '7.4 hrs', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Achievements', val: '12 Total', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-all group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900">{stat.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <TrendingUp className="text-blue-600" /> Weekly Activity
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">Intensity Log</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyData}>
                <defs>
                  <linearGradient id="colorMins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  labelStyle={{ fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="mins" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorMins)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <ShieldCheck className="text-emerald-600" /> Skill Radar
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full">AI Evaluation</span>
          </div>
          <div className="h-64 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 11, fontWeight: '900', textTransform: 'uppercase'}} />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  animationDuration={2500}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Completed Milestones</h3>
            <div className="text-xs font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-full">
              {roadmap.levels.filter(l => l.status === 'completed').length} Levels Verified
            </div>
          </div>
          <div className="space-y-4">
            {roadmap.levels.filter(l => l.status === 'completed').map((level, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-emerald-200 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">{level.title}</h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Level {level.id} • Verified Mastery</p>
                  </div>
                </div>
                <button className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
            {roadmap.levels.filter(l => l.status === 'completed').length === 0 && (
              <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Target className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">No milestones reached yet</h4>
                <p className="text-slate-400 text-sm font-medium">Complete your first level project to see achievements here!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-blue-900/10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/20 transition-all duration-1000" />
           
           <div className="space-y-6 relative z-10">
             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
               <Sparkles className="w-8 h-8 text-white" />
             </div>
             <div>
               <h3 className="text-3xl font-black leading-tight tracking-tight mb-4">AI Weekly <br />Insights</h3>
               {loadingSummary ? (
                 <div className="flex items-center gap-3 py-4">
                   <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                   <span className="text-slate-400 font-bold text-sm animate-pulse">Consulting Gemini intelligence...</span>
                 </div>
               ) : (
                 <p className="text-slate-300 leading-relaxed font-medium text-lg italic">
                   "{aiSummary}"
                 </p>
               )}
             </div>
           </div>
           
           <div className="relative z-10 mt-10">
              <div className="h-px bg-white/10 w-full mb-8" />
              <button className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/10 active:scale-95">
                Full AI Review
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
