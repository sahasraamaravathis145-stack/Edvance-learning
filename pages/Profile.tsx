
import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Key, 
  Shield, 
  LogOut, 
  Trash2,
  ChevronRight,
  Target,
  Clock,
  Layout,
  Bell,
  Edit2,
  Check,
  X,
  Sparkles,
  Zap,
  Globe,
  Award,
  Crown,
  // Added missing Loader2 import
  Loader2
} from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onReset: () => void;
  onUpdate?: (updated: UserProfile) => void;
}

export default function Profile({ profile, onReset, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedProfile);
    }
    setIsEditing(false);
  };

  const handleUpgrade = () => {
    setIsUpgrading(true);
    setTimeout(() => {
      if (onUpdate) {
        onUpdate({ ...profile, isPro: true });
      }
      setIsUpgrading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className={`relative flex flex-col md:flex-row items-center gap-8 bg-white p-10 rounded-[3rem] border shadow-sm transition-all duration-700 ${profile.isPro ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'}`}>
        {profile.isPro && (
          <div className="absolute top-6 right-8 flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-amber-200">
            <Crown className="w-3.5 h-3.5" fill="currentColor" /> Pro Member
          </div>
        )}
        
        <div className={`relative w-36 h-36 rounded-full flex items-center justify-center text-5xl font-black shadow-inner transition-colors duration-700 ${profile.isPro ? 'bg-amber-100 text-amber-600 shadow-amber-200' : 'bg-blue-100 text-blue-600 shadow-blue-100'}`}>
          {profile.name.charAt(0)}
          {profile.isPro && (
            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-xl shadow-xl">
              <Zap className="w-6 h-6" fill="currentColor" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            {isEditing ? (
              <input 
                value={editedProfile.name}
                onChange={e => setEditedProfile({...editedProfile, name: e.target.value})}
                className="text-4xl font-black text-slate-900 bg-slate-50 border-b-2 border-blue-500 focus:outline-none px-2 py-1 w-full max-w-md"
              />
            ) : (
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
            )}
            <p className="text-slate-500 font-bold text-lg flex items-center justify-center md:justify-start gap-2">
              <Globe className="w-5 h-5 text-slate-300" /> Mastering {profile.targetSkill}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <div className="bg-slate-900 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-200">
               <Award className="w-3 h-3" /> {profile.proficiencyLevel}
             </div>
             <div className="bg-white border border-slate-200 px-5 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 shadow-sm">
               <Zap className="w-3 h-3" /> {profile.learningStyle} Style
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <Check className="w-5 h-5" /> Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
              >
                <X className="w-5 h-5" /> Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-slate-50 text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white hover:border-blue-300 transition-all shadow-sm"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <Target className="text-blue-600" /> Learning Preferences
               </h3>
               {!isEditing && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Goals</span>}
             </div>
             <div className="p-6">
                {[
                  { id: 'targetSkill', icon: Target, label: 'Current Goal', val: profile.targetSkill },
                  { id: 'timeAvailability', icon: Clock, label: 'Time Commitment', val: `${profile.timeAvailability} hrs / week` },
                  { id: 'proficiencyLevel', icon: Layout, label: 'Experience Level', val: profile.proficiencyLevel.charAt(0).toUpperCase() + profile.proficiencyLevel.slice(1) },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-[2rem] transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-slate-600 text-lg">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {isEditing && (item.id === 'targetSkill') ? (
                        <input 
                          value={editedProfile.targetSkill}
                          onChange={e => setEditedProfile({...editedProfile, targetSkill: e.target.value})}
                          className="font-black text-slate-900 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      ) : (
                        <span className="font-black text-slate-900 text-lg">{item.val}</span>
                      )}
                      {!isEditing && <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />}
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="px-10 py-8 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
               <Shield className="text-emerald-600" />
               <h3 className="text-xl font-black text-slate-900">Security & Ecosystem</h3>
             </div>
             <div className="p-6">
                {[
                  { icon: Key, label: 'API Management', val: 'System Managed' },
                  { icon: Bell, label: 'Learning Reminders', val: 'Enabled' },
                  { icon: Shield, label: 'Privacy Settings', val: 'Private Mode' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-[2rem] transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-slate-600 text-lg">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900 text-lg">{item.val}</span>
                      <ChevronRight className="w-5 h-5 text-slate-200" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`p-10 rounded-[2.5rem] text-white space-y-8 shadow-2xl transition-all duration-700 relative overflow-hidden group ${profile.isPro ? 'bg-gradient-to-br from-amber-500 to-orange-700 shadow-amber-200/40' : 'bg-slate-900 shadow-slate-200'}`}>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="space-y-4 relative z-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-colors duration-700 ${profile.isPro ? 'bg-white text-amber-600' : 'bg-blue-600 text-white'}`}>
                {profile.isPro ? <Crown className="w-8 h-8" fill="currentColor" /> : <Sparkles className="w-8 h-8" />}
              </div>
              <h4 className="font-black text-3xl tracking-tight leading-none">
                {profile.isPro ? 'Pro Active' : 'Elite Support'}
              </h4>
              <p className="text-white/70 font-medium leading-relaxed">
                {profile.isPro 
                  ? 'Your membership is active. You have full access to high-parameter Gemini models and unlimited tutoring.' 
                  : 'Unlock priority AI models, unlimited roadmap generation, and live tutor access.'}
              </p>
            </div>
            
            {!profile.isPro && (
              <button 
                onClick={handleUpgrade}
                disabled={isUpgrading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Upgrading...
                  </>
                ) : (
                  <>Upgrade Now <Zap className="w-5 h-5" fill="currentColor" /></>
                )}
              </button>
            )}
          </div>

          <button 
            onClick={onReset}
            className="w-full bg-white border-2 border-slate-100 p-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
          >
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
              <LogOut className="w-8 h-8" />
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-slate-900 tracking-tight">Reset Edvance</div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Permanently clear data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
