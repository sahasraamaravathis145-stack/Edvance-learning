
import React from 'react';
import { Roadmap, UserProfile } from '../types';
import { 
  GitBranch, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  roadmap: Roadmap;
  profile: UserProfile;
}

export default function SkillTree({ roadmap, profile }: Props) {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-purple-100 mb-4">
            <GitBranch className="w-3.5 h-3.5" /> Mastery Visualization
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Skill <span className="text-purple-600">Tree</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Tracing your growth path for <span className="text-slate-900 font-bold">{roadmap.skill}</span>.</p>
        </div>
        <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mastery Status</div>
            <div className="text-lg font-black text-slate-900">
              {roadmap.levels.filter(l => l.status === 'completed').length} / {roadmap.levels.length} Nodes
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Connector SVG Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Simple diagonal lines representing branches */}
            <path d="M 50 100 Q 150 150 250 100" stroke="#9333ea" strokeWidth="2" fill="transparent" />
          </svg>
        </div>

        <div className="relative z-10 grid gap-10">
          {roadmap.levels.map((level, i) => (
            <div 
              key={level.id} 
              className={`flex items-start gap-8 transition-all duration-500 ${level.status === 'locked' ? 'opacity-40' : ''}`}
              style={{ paddingLeft: `${i * 3}rem` }}
            >
              <div className="relative">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl border-4 border-white transition-all duration-500 ${
                  level.status === 'completed' ? 'bg-emerald-500' :
                  level.status === 'in_progress' ? 'bg-purple-600 rotate-12 scale-110 shadow-purple-200' :
                  'bg-slate-100'
                }`}>
                  {level.status === 'completed' ? <CheckCircle2 className="text-white w-8 h-8" /> :
                   level.status === 'locked' ? <Lock className="text-slate-400 w-6 h-6" /> :
                   <Zap className="text-white w-7 h-7" fill="white" />}
                </div>
                {i < roadmap.levels.length - 1 && (
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-slate-200" />
                )}
              </div>

              <div className={`flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-purple-300 transition-all ${
                level.status === 'in_progress' ? 'ring-4 ring-purple-500/10 border-purple-200' : ''
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-slate-900">{level.title}</h3>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    level.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                    level.status === 'in_progress' ? 'bg-purple-50 text-purple-600' :
                    'bg-slate-50 text-slate-400'
                  }`}>
                    {level.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {level.concepts.map((concept, ci) => (
                    <span key={ci} className="text-xs bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-100 font-bold">
                      {concept}
                    </span>
                  ))}
                </div>
                {level.status !== 'locked' && (
                  <div className="mt-6 flex justify-end">
                    <Link 
                      to={`/learn/${level.id}`}
                      className="inline-flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-all"
                    >
                      Access Node <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
