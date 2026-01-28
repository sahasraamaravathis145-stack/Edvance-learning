
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Shield className="text-blue-600 w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black text-slate-900">Privacy Policy</h1>
        </div>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
          <p className="text-lg font-medium text-slate-900 italic">Effective Date: January 28, 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
            <p>
              Welcome to Edvance. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered learning platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">2. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us when you create an account, complete your profile, or interact with our AI tutor. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact Information (Name, Email)</li>
              <li>Learning Preferences (Skills, Proficiency Level, Learning Style)</li>
              <li>Interaction Data (Chat history with AI tutor, Quiz results, Progress data)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">3. How We Use Your Information</h2>
            <p>
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate personalized learning roadmaps using AI.</li>
              <li>Provide interactive tutoring sessions tailored to your needs.</li>
              <li>Track and visualize your learning progress.</li>
              <li>Improve our AI models and platform features.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. Your interactions with Gemini AI are processed securely, and personal identifiers are handled with strict access controls.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: <br />
              <strong className="text-blue-600">edvance.contact.edu.in@gmail.com</strong>
            </p>
          </section>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-400">© 2026 Edvance. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
