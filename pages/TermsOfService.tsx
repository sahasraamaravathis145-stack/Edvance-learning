
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function TermsOfService() {
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
            <BookOpen className="text-blue-600 w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black text-slate-900">Terms of Service</h1>
        </div>
        
        <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
          <p className="text-lg font-medium text-slate-900 italic">Last Updated: January 28, 2026</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Edvance, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">2. Use License</h2>
            <p>
              Edvance grants you a personal, non-exclusive, non-transferable license to use the platform for personal, non-commercial educational purposes. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose.</li>
              <li>Attempt to decompile or reverse engineer any software contained on Edvance.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">3. AI Content</h2>
            <p>
              Edvance utilizes advanced AI models to generate educational content. While we strive for accuracy, AI-generated content may occasionally contain errors. We recommend cross-referencing critical information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">4. Disclaimer</h2>
            <p>
              The materials on Edvance are provided on an 'as is' basis. Edvance makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">5. Contact</h2>
            <p>
              For legal inquiries, contact: <br />
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
