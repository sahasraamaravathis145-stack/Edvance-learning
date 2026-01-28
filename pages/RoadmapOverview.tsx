
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Target, 
  Clock,
  Sparkles,
  Zap
} from 'lucide-react';
import { Roadmap } from '../types';

// Define the Props interface to fix the "Cannot find name 'Props'" error on line 16
interface Props {
  roadmap: Roadmap;
  currentLevelId: string | null;
}

export default function RoadmapOverview({ roadmap, currentLevelId }: Props) {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest border border-purple-100">
          <Sparkles className="w-4 h-4" /> Mastery Path
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900">
          {roadmap.skill}
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Your AI-generated journey enhanced with hands-on project milestones.
        </p>
      </div>

      <div className="relative space-y-12">
        {/* Connector Line */}
        <div className="absolute left-[39px] top-10 bottom-10 w-1 bg-slate-200" />

        {roadmap.levels.map((level, idx) => (
          <div key={level.id} className="relative flex gap-10">
            {/* Status Icon Indicator */}
            <div className="relative z-10 flex-shrink-0">
              {level.status === 'completed' ? (
                <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-200 border-4 border-white">
                  <CheckCircle2 className="text-white w-10 h-10" />
                </div>
              ) : level.status === 'in_progress' ? (
                <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-purple-200 border-4 border-white animate-pulse">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              ) : level.status === 'unlocked' ? (
                <div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl flex items-center justify-center">
                  <Circle className="text-slate-300 w-8 h-8" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center border-4 border-white">
                  <Lock className="text-slate-400 w-8 h-8" />
                </div>
              )}
            </div>

            {/* Level Card */}
            <div className={`flex-1 bg-white p-8 rounded-[2rem] border transition-all ${
              level.status === 'locked' 
                ? 'opacity-60 border-slate-100 grayscale' 
                : 'shadow-sm border-slate-200 hover:border-purple-400'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-purple-600 font-bold text-xs uppercase tracking-widest mb-1">Level {idx + 1}</div>
                  <h3 className="text-2xl font-black text-slate-900">{level.title}</h3>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                    <Clock className="w-4 h-4" /> {level.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                    <Target className="w-4 h-4" /> {level.concepts.length} Topics
                  </div>
                </div>
              </div>

              <p className="text-slate-500 mb-6 leading-relaxed">
                {level.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {level.concepts.map((concept, i) => (
                  <span key={i} className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-sm font-medium border border-slate-100">
                    {concept}
                  </span>
                ))}
              </div>

              {level.project && (
                <div className="mb-8 p-6 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-widest mb-3">
                    <Zap className="w-4 h-4" fill="currentColor" /> Project Milestone
                  </div>
                  <h4 className="font-black text-slate-900 mb-2">{level.project.title}</h4>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {level.project.requirements[0]}... and {level.project.requirements.length - 1} more requirements.
                  </p>
                </div>
              )}

              {level.status !== 'locked' && (
                <Link
                  to={`/learn/${level.id}`}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                    level.status === 'completed'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {level.status === 'completed' ? 'Review Content' : level.status === 'in_progress' ? 'Resume Level' : 'Start Level'}
                  <ChevronRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
