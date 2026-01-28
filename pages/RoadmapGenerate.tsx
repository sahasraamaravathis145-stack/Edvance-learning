
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles, Map, ListChecks, Award } from 'lucide-react';
import { generateRoadmap } from '../services/gemini';
import { UserProfile, Roadmap } from '../types';

interface Props {
  profile: UserProfile | null;
  assessmentScore: number;
  onComplete: (roadmap: Roadmap) => void;
}

export default function RoadmapGenerate({ profile, assessmentScore, onComplete }: Props) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Analyzing your strengths...");
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate('/onboarding');
      return;
    }

    const statuses = [
      "Analyzing your strengths...",
      "Mapping out prerequisites...",
      "Designing interactive modules...",
      "Preparing your personalized path...",
      "Consulting the AI experts..."
    ];

    let statusIndex = 0;
    const interval = setInterval(() => {
      statusIndex = (statusIndex + 1) % statuses.length;
      setStatus(statuses[statusIndex]);
    }, 2000);

    const createRoadmap = async () => {
      try {
        const roadmap = await generateRoadmap(profile, assessmentScore);
        // Initialize first level as in_progress, others as locked (except maybe second as unlocked)
        roadmap.levels = roadmap.levels.map((l, i) => ({
          ...l,
          status: i === 0 ? 'in_progress' : (i === 1 ? 'unlocked' : 'locked')
        }));
        onComplete(roadmap);
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err) {
        console.error("Failed to generate roadmap", err);
      } finally {
        setLoading(false);
        clearInterval(interval);
      }
    };

    createRoadmap();
    return () => clearInterval(interval);
  }, [profile, assessmentScore, navigate, onComplete]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-12">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-100 blur-3xl rounded-full opacity-50 scale-150 animate-pulse" />
          <div className="relative z-10 w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center mx-auto border border-blue-50">
            <Sparkles className="w-16 h-16 text-blue-600 animate-bounce" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Building Your <span className="text-blue-600">Edvance</span> Path
          </h2>
          <p className="text-slate-500 text-lg">{status}</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Structured Levels', icon: Map },
            { label: 'Interactive Tasks', icon: ListChecks },
            { label: 'Growth Milestones', icon: Award }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-sm font-medium text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <Loader2 className="w-8 h-8 text-blue-200 animate-spin" />
        </div>
      </div>
    </div>
  );
}
