
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart2, 
  Map as MapIcon, 
  User as UserIcon, 
  Menu, 
  X,
  ChevronRight,
  Zap,
  LifeBuoy,
  Network,
  GitBranch,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen,
  GripVertical
} from 'lucide-react';

import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Onboarding from './pages/Onboarding';
import Assessment from './pages/Assessment';
import RoadmapGenerate from './pages/RoadmapGenerate';
import Dashboard from './pages/Dashboard';
import RoadmapOverview from './pages/RoadmapOverview';
import Learn from './pages/Learn';
import ProgressPage from './pages/Progress';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Support from './pages/Support';
import SkillTree from './pages/SkillTree';
import Community from './pages/Community';
import CareerHub from './pages/CareerHub';

import { AppState, UserProfile, Roadmap } from './types';

const INITIAL_STATE: AppState = {
  profile: null,
  roadmap: null,
  assessmentResult: null,
  streak: 0,
  activity: [],
  currentLevelId: null,
  isAuthenticated: false,
};

const Logo = ({ expanded }: { expanded: boolean }) => (
  <Link to="/dashboard" className="flex items-center gap-3 px-2 mb-8 group overflow-hidden">
    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-purple-200 flex-shrink-0">
      <Zap className="text-white w-6 h-6" fill="white" />
    </div>
    {expanded && (
      <div className="flex flex-col leading-none animate-in fade-in duration-300 whitespace-nowrap">
        <span className="text-xl font-black text-slate-900">Edvance</span>
        <span className="text-[9px] font-black text-purple-600 tracking-[0.2em] mt-0.5">AI LEARNING</span>
      </div>
    )}
  </Link>
);

const Navigation = ({ 
  profile, 
  isAuthenticated, 
  isExpanded, 
  setExpanded,
  width,
  setWidth
}: { 
  profile: UserProfile | null, 
  isAuthenticated: boolean, 
  isExpanded: boolean, 
  setExpanded: (v: boolean) => void,
  width: number,
  setWidth: (w: number) => void
}) => {
  const location = useLocation();
  const isResizing = useRef(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Roadmap', path: '/roadmap', icon: MapIcon },
    { label: 'Skill Tree', path: '/skill-tree', icon: GitBranch },
    { label: 'Community', path: '/community', icon: Network },
    { label: 'Career Hub', path: '/career', icon: Briefcase },
    { label: 'Progress', path: '/progress', icon: BarChart2 },
    { label: 'Support', path: '/support', icon: LifeBuoy },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

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
    const newWidth = e.clientX;
    if (newWidth >= 200 && newWidth <= 450) {
      setWidth(newWidth);
    }
  }, [setWidth]);

  if (!isAuthenticated) return null;

  return (
    <aside 
      style={{ width: isExpanded ? width : 80 }}
      className="fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-[60] flex flex-col p-4 shadow-sm transition-[width] duration-300 ease-in-out group/sidebar"
    >
      <div className="flex items-center justify-between mb-2">
         <Logo expanded={isExpanded} />
         <button 
           onClick={() => setExpanded(!isExpanded)}
           className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
         >
           {isExpanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
         </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all relative group ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-purple-600'
              }`}
            >
              <item.icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
              {isExpanded && (
                <span className="font-bold text-sm whitespace-nowrap animate-in fade-in duration-300">
                  {item.label}
                </span>
              )}
              {!isExpanded && (
                <div className="absolute left-16 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all shadow-xl whitespace-nowrap z-[70]">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-50">
        <p className={`text-[9px] font-black text-slate-400 uppercase tracking-widest text-center ${!isExpanded && 'hidden'}`}>
          © 2026 Edvance
        </p>
      </div>

      {/* Resize Handle */}
      {isExpanded && (
        <div 
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-purple-400/30 active:bg-purple-600 transition-colors flex items-center justify-center group/handle"
        >
          <GripVertical className="w-3 h-3 text-slate-300 opacity-0 group-hover/handle:opacity-100" />
        </div>
      )}
    </aside>
  );
};

export default function App() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('edvance_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('edvance_state', JSON.stringify(state));
  }, [state]);

  const setAuth = (isAuthenticated: boolean) => setState(prev => ({ ...prev, isAuthenticated }));
  const updateProfile = (profile: UserProfile) => setState(prev => ({ ...prev, profile }));
  const updateRoadmap = (roadmap: Roadmap) => setState(prev => ({ ...prev, roadmap }));
  const updateAssessment = (score: number) => setState(prev => ({ ...prev, assessmentResult: score }));
  const setCurrentLevel = (levelId: string) => setState(prev => ({ ...prev, currentLevelId: levelId }));
  
  const resetApp = () => {
    setState(INITIAL_STATE);
    localStorage.removeItem('edvance_state');
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#F8FAFC] flex">
        <Navigation 
          profile={state.profile} 
          isAuthenticated={state.isAuthenticated} 
          isExpanded={isSidebarExpanded}
          setExpanded={setSidebarExpanded}
          width={sidebarWidth}
          setWidth={setSidebarWidth}
        />
        
        <main 
          style={{ marginLeft: state.isAuthenticated ? (isSidebarExpanded ? sidebarWidth : 80) : 0 }}
          className="flex-1 transition-[margin] duration-300 ease-in-out"
        >
          <div className={`${state.isAuthenticated ? 'p-6 md:p-10' : ''}`}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup onComplete={() => setAuth(true)} />} />
              <Route path="/signin" element={<Signin onComplete={() => setAuth(true)} />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/support" element={<Support />} />
              
              <Route path="/onboarding" element={
                state.isAuthenticated ? <Onboarding onComplete={updateProfile} /> : <Navigate to="/signin" />
              } />
              <Route path="/assessment" element={
                state.profile ? <Assessment profile={state.profile} onComplete={updateAssessment} /> : <Navigate to="/onboarding" />
              } />
              <Route path="/roadmap/generate" element={
                state.profile ? <RoadmapGenerate profile={state.profile} assessmentScore={state.assessmentResult || 0} onComplete={updateRoadmap} /> : <Navigate to="/onboarding" />
              } />
              
              <Route path="/dashboard" element={
                state.isAuthenticated ? <Dashboard state={state} setCurrentLevel={setCurrentLevel} /> : <Navigate to="/signin" />
              } />
              
              <Route path="/roadmap" element={
                state.roadmap ? <RoadmapOverview roadmap={state.roadmap} currentLevelId={state.currentLevelId} /> : <Navigate to="/dashboard" />
              } />

              <Route path="/skill-tree" element={
                state.roadmap ? <SkillTree roadmap={state.roadmap} profile={state.profile!} /> : <Navigate to="/dashboard" />
              } />

              <Route path="/community" element={
                state.profile ? <Community profile={state.profile} /> : <Navigate to="/dashboard" />
              } />

              <Route path="/career" element={
                state.roadmap ? <CareerHub roadmap={state.roadmap} profile={state.profile!} /> : <Navigate to="/dashboard" />
              } />

              <Route path="/learn/:levelId" element={
                state.roadmap ? <Learn roadmap={state.roadmap} setCurrentLevel={setCurrentLevel} /> : <Navigate to="/dashboard" />
              } />

              <Route path="/quiz/:levelId" element={
                state.roadmap ? <Quiz roadmap={state.roadmap} onComplete={(success) => {
                  if (success && state.roadmap) {
                    const updatedLevels = state.roadmap.levels.map(l => {
                        if (l.id === state.currentLevelId) return { ...l, status: 'completed' as const };
                        return l;
                    });
                    updateRoadmap({ ...state.roadmap, levels: updatedLevels });
                  }
                }} /> : <Navigate to="/dashboard" />
              } />

              <Route path="/progress" element={
                state.roadmap ? <ProgressPage state={state} /> : <Navigate to="/dashboard" />
              } />

              <Route path="/profile" element={
                state.profile ? <Profile profile={state.profile} onReset={resetApp} onUpdate={updateProfile} /> : <Navigate to="/dashboard" />
              } />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}
