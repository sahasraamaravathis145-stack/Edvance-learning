
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Target, BookOpen, BarChart3, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white w-5 h-5" fill="white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black text-slate-900">Edvance</span>
              <span className="text-[8px] font-black text-purple-600 tracking-[0.2em] mt-0.5">AI LEARNING</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/signin" className="text-slate-600 font-medium hover:text-purple-600 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="bg-purple-600 text-white px-5 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            Master Any Skill with <br />
            <span className="text-purple-600">AI-Powered</span> Learning
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Edvance creates personalized learning roadmaps, project-based milestones, and adaptive assessments tailored specifically to your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2">
              Start Your Journey <ChevronRight />
            </Link>
            <a href="#features" className="bg-slate-100 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Core Features</h2>
            <p className="text-slate-600">Built for modern learners who value efficiency and results.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Personalized Roadmaps',
                desc: 'AI analyzes your proficiency and goals to create a structured path from zero to mastery.',
                icon: Target,
                color: 'text-purple-600',
                bg: 'bg-purple-100'
              },
              {
                title: 'Project-Based Learning',
                desc: 'Go beyond theory. Complete achievable projects designed by AI to prove your skills.',
                icon: Zap,
                color: 'text-emerald-600',
                bg: 'bg-emerald-100'
              },
              {
                title: 'Interactive AI Tutor',
                desc: 'Stuck on a concept? Our Socratic AI tutor guides you through explanations and project challenges.',
                icon: BookOpen,
                color: 'text-amber-600',
                bg: 'bg-amber-100'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className={`${feature.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`${feature.color} w-6 h-6`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center text-[10px] text-white font-bold italic">E</div>
            <span className="font-bold text-slate-900">Edvance</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-purple-600">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-purple-600">Terms of Service</Link>
            <Link to="/support" className="hover:text-purple-600">Support</Link>
          </div>
          <p className="text-sm text-slate-400">© 2026 Edvance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
