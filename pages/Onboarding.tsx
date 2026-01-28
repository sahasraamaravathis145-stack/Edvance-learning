
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Brain,
  Sparkles,
  Target
} from 'lucide-react';
import { UserProfile } from '../types';
import { PROFICIENCY_LEVELS, LEARNING_STYLES, SAMPLE_SKILLS } from '../constants';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    targetSkill: '',
    proficiencyLevel: 'beginner',
    timeAvailability: 10,
    learningStyle: 'hands-on',
    onboarded: true
  });

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else {
      onComplete(formData as UserProfile);
      navigate('/assessment');
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full">
          <div 
            className="h-full bg-purple-600 transition-all duration-700 ease-out" 
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-14">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-100">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Let's start with your name</h2>
                <p className="text-slate-500 font-medium">Personalizing your experience begins here.</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Type your name..."
                  className="w-full text-xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all placeholder:text-slate-300"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">What do you want to master?</h2>
                <p className="text-slate-500 font-medium">Select a popular skill or define your own path.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {SAMPLE_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => setFormData({ ...formData, targetSkill: skill })}
                    className={`p-4 text-left rounded-2xl border-2 transition-all font-bold text-sm ${
                      formData.targetSkill === skill 
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm' 
                        : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="relative pt-4">
                <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                  <Target className="w-3 h-3" /> Or Enter Custom Skill
                </div>
                <input
                  type="text"
                  value={formData.targetSkill}
                  onChange={(e) => setFormData({ ...formData, targetSkill: e.target.value })}
                  placeholder="e.g. Quantum Computing"
                  className="w-full text-lg font-bold text-slate-900 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-8 py-5 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Current Proficiency</h2>
              <div className="space-y-4">
                {PROFICIENCY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFormData({ ...formData, proficiencyLevel: level.value as any })}
                    className={`w-full p-6 text-left rounded-[2rem] border-2 transition-all flex items-center gap-5 ${
                      formData.proficiencyLevel === level.value 
                        ? 'border-purple-600 bg-purple-50 shadow-sm' 
                        : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                      formData.proficiencyLevel === level.value ? 'border-purple-600 bg-purple-600 rotate-12' : 'border-slate-200 bg-white'
                    }`}>
                      {formData.proficiencyLevel === level.value && <Check className="text-white w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`font-black text-lg ${formData.proficiencyLevel === level.value ? 'text-purple-900' : 'text-slate-900'}`}>
                        {level.label}
                      </h4>
                      <p className="text-slate-500 text-sm font-medium">{level.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Weekly Availability</h2>
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Commitment Level</span>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl font-black text-purple-600 leading-none">{formData.timeAvailability}</span>
                    <span className="text-xs font-black text-purple-400 uppercase tracking-tighter">Hours / Week</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={formData.timeAvailability}
                  onChange={(e) => setFormData({ ...formData, timeAvailability: parseInt(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-[10px] font-black text-slate-400 mt-6 uppercase tracking-widest">
                  <span>Casual (2h)</span>
                  <span>Hyper Focus (40h)</span>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Learning Style</h2>
              <div className="grid gap-4">
                {LEARNING_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setFormData({ ...formData, learningStyle: style.value as any })}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex items-center gap-6 ${
                      formData.learningStyle === style.value 
                        ? 'border-purple-600 bg-purple-50 shadow-sm' 
                        : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
                    }`}
                  >
                    <div className="bg-white w-14 h-14 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                      <Brain className={`w-7 h-7 ${
                        style.value === 'visual' ? 'text-purple-600' : 
                        style.value === 'hands-on' ? 'text-emerald-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <span className={`text-xl font-black ${formData.learningStyle === style.value ? 'text-purple-900' : 'text-slate-900'}`}>
                      {style.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase tracking-widest text-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}
            
            <button 
              onClick={nextStep}
              disabled={(step === 1 && !formData.name) || (step === 2 && !formData.targetSkill)}
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:bg-black disabled:opacity-20 disabled:scale-95 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              <span className="text-lg">{step === 5 ? 'Finish' : 'Next'}</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
