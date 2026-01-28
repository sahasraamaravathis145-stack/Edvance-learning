
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Flame, 
  Target, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Zap,
  Star,
  PlayCircle,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  ArrowUpRight,
  Globe,
  Medal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { AppState } from '../types';

interface Props {
  state: AppState;
  setCurrentLevel: (levelId: string) => void;
}

export default function Dashboard({ state, setCurrentLevel }: Props) {
  const navigate = useNavigate();
  const { profile, roadmap, streak, activity } = state;

  // If the user hasn't set up yet
  if (!profile || !roadmap) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-indigo-600" />
          <div className="space-y-4">
            <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-purple-600 w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Journey Awaits</h1>
            <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
              Define your goals and let our AI craft the perfect path for your growth.
            </p>
          </div>
          <div className="pt-6">
            <Link 
              to="/onboarding" 
              className="inline-flex items-center gap-3 bg-purple-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-200"
            >
              Start Onboarding <Zap className="w-6 h-6" fill="currentColor" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentLevel = roadmap.levels.find(l => l.status === 'in_progress') || roadmap.levels[0];
  const completedCount = roadmap.levels.filter(l => l.status === 'completed').length;
  const progressPercent = Math.round((completedCount / roadmap.levels.length) * 100);

  // Dynamic values for XP and Rank
  const totalXP = (completedCount * 1250) + (streak * 100);
  const globalRank = Math.max(1, 4520 - Math.floor(totalXP / 2));

  // Chart Data
  const hasActivity = activity && activity.length > 0;
  const chartData = hasActivity ? activity.map(a => ({
    name: a.date.split('-').slice(1).join('/'),
    mins: a.minutes
  })) : [
    { name: 'Mon', mins: 0 },
    { name: 'Tue', mins: 0 },
    { name: 'Wed', mins: 0 },
    { name: 'Thu', mins: 0 },
    { name: 'Fri', mins: 0 },
    { name: 'Sat', mins: 0 },
    { name: 'Sun', mins: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Dynamic Greeting Header */}
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Hi, {profile.name.split(' ')[0]} <span className="animate-pulse">✨</span>
          </h1>
          <p className="text-slate-500 font-medium italic">
            "Your persistence in mastering <span className="text-purple-600 font-bold">{profile.targetSkill}</span> is paying off."
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Activity Graph Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-purple-600 w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Learning Activity</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Calendar className="w-4 h-4" /> Last 7 Days
              </div>
            </div>
            
            <div className="h-[280px] w-full mt-4 relative">
              {!hasActivity && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                  <div className="text-center bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 font-bold text-sm">No activity recorded yet</p>
                  </div>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} 
                    dy={10} 
                  />
                  <YAxis domain={[0, 'auto']} hide />
                  <Tooltip 
                    cursor={{ stroke: '#9333ea', strokeWidth: 2, strokeDasharray: '5 5' }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                    labelStyle={{ fontWeight: '900', color: '#0f172a', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mins" 
                    stroke="#9333ea" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorMins)" 
                    animationDuration={1500} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Milestone Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-600/30 transition-all duration-1000" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
              <div className="relative">
                <div className="w-32 h-32 bg-purple-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-purple-500/40 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                  <BookOpen className="text-white w-14 h-14" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white text-slate-900 p-3 rounded-2xl shadow-xl">
                  <PlayCircle className="w-8 h-8 text-purple-600" fill="currentColor" />
                </div>
              </div>
              
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/30">
                  Active Milestone: Level {currentLevel.id}
                </div>
                <h2 className="text-3xl font-black tracking-tight">{currentLevel.title}</h2>
                <p className="text-purple-100/70 font-medium leading-relaxed max-w-xl">
                  {currentLevel.description}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                  <div className="flex items-center gap-2 text-purple-200 text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <Clock className="w-4 h-4" /> {currentLevel.estimatedTime}
                  </div>
                  <div className="flex items-center gap-2 text-purple-200 text-sm font-bold bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <Target className="w-4 h-4" /> {currentLevel.concepts.length} Topics
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => {
                      setCurrentLevel(currentLevel.id);
                      navigate(`/learn/${currentLevel.id}`);
                    }}
                    className="w-full md:w-auto bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-purple-50 transition-all shadow-xl shadow-purple-900/40 flex items-center justify-center gap-3 active:scale-95"
                  >
                    Continue Learning <ArrowUpRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Weekly Activity Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Zap className="text-purple-400 w-6 h-6" fill="currentColor" />
                </div>
                <h3 className="text-lg font-black tracking-tight">Weekly Activity</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total XP Earned</span>
                    <span className="text-xl font-black text-white">{totalXP.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ width: `${(totalXP % 5000) / 50}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Rank</div>
                      <div className="text-2xl font-black text-purple-400 tracking-tight">#{globalRank.toLocaleString()}</div>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                      <Globe className="text-slate-400 w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/progress" className="mt-8 group flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 relative z-10">
                <span className="text-xs font-black">View Leaderboard</span>
                <Medal className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
            </Link>
          </div>

          {/* Repositioned Stats below Weekly Activity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center">
                <Flame className="text-orange-600 w-8 h-8" fill="#EA580C" />
              </div>
              <div className="text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Streak</div>
                <div className="text-2xl font-black text-slate-900 leading-none">{streak} Days</div>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-6 rounded-[2rem] flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Star className="text-purple-600 w-8 h-8" fill="#9333EA" />
              </div>
              <div className="text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Score</div>
                <div className="text-2xl font-black text-slate-900 leading-none">Lvl {Math.floor(progressPercent / 10) + 1}</div>
              </div>
            </div>
          </div>

          {/* Progress Overview Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Roadmap Status</h3>
              <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {progressPercent}% Total
              </div>
            </div>
            
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
               <svg className="w-full h-full -rotate-90">
                  <circle 
                    cx="96" cy="96" r="86" 
                    className="fill-none stroke-slate-50" 
                    strokeWidth="16"
                  />
                  <circle 
                    cx="96" cy="96" r="86" 
                    className="fill-none stroke-purple-600 transition-all duration-1000 ease-out" 
                    strokeWidth="16"
                    strokeDasharray={540}
                    strokeDashoffset={540 - (540 * progressPercent) / 100}
                    strokeLinecap="round"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">{progressPercent}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Completion</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
