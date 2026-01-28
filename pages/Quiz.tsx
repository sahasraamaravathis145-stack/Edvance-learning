
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { Roadmap, AssessmentQuestion } from '../types';
import { generateQuizForLevel } from '../services/gemini';

interface Props {
  roadmap: Roadmap;
  onComplete: (success: boolean) => void;
}

export default function Quiz({ roadmap, onComplete }: Props) {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const level = roadmap.levels.find(l => l.id === levelId) || roadmap.levels[0];

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const q = await generateQuizForLevel(level);
        setQuestions(q);
      } catch (err) {
        console.error("Quiz load failed", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [level]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return (correct / questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">Preparing Your Assessment</h2>
          <p className="text-slate-500">Generating adaptive questions for {level.title}...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 80;
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-12 text-center border border-slate-100">
          <div className="mb-8">
            {passed ? (
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-12 h-12 text-emerald-600" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-amber-600" />
              </div>
            )}
            <h2 className="text-4xl font-black text-slate-900">{passed ? "Incredible Work!" : "Almost There!"}</h2>
            <p className="text-slate-500 mt-2">You scored {score}% in {level.title}.</p>
          </div>

          <div className="p-10 bg-slate-50 rounded-3xl mb-10 border border-slate-200/50">
            <div className={`text-7xl font-black mb-2 ${passed ? 'text-emerald-500' : 'text-amber-500'}`}>
              {score}%
            </div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Assessment Result</div>
          </div>

          {passed ? (
            <div className="space-y-6">
              <p className="text-slate-600 text-lg leading-relaxed">
                You've demonstrated mastery of {level.title}. The next part of your roadmap is now unlocked!
              </p>
              <button
                onClick={() => {
                  onComplete(true);
                  navigate('/dashboard');
                }}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3"
              >
                Continue Path <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-slate-600 text-lg leading-relaxed">
                We recommend reviewing Level {level.id} topics once more. Our AI tutor is ready to help clarify any confusing parts.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/learn/${level.id}`)}
                  className="flex-1 bg-slate-100 text-slate-800 py-5 rounded-2xl font-black text-xl hover:bg-slate-200 transition-all"
                >
                  Review Concepts
                </button>
                <button
                  onClick={() => setShowResults(false)}
                  className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-blue-600 font-black uppercase tracking-widest text-xs">Final Evaluation</span>
          <h1 className="text-2xl font-black text-slate-900">{level.title}</h1>
        </div>
        <div className="text-slate-400 font-bold bg-white px-4 py-2 rounded-xl border border-slate-100">
          Question {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="w-full h-3 bg-slate-100 rounded-full mb-12 overflow-hidden border border-slate-200/50 p-0.5">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10 md:p-14 space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-100">
            <Sparkles className="w-3 h-3" /> Adaptive Scenario
          </div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">
            {q.question}
          </h3>
        </div>

        <div className="grid gap-4">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setAnswers({ ...answers, [q.id]: idx })}
              className={`group w-full p-6 text-left rounded-2xl border-2 transition-all flex items-center gap-6 ${
                answers[q.id] === idx
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black transition-all ${
                answers[q.id] === idx ? 'bg-blue-600 text-white rotate-6' : 'bg-white text-slate-400 group-hover:text-slate-600'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className={`text-lg font-bold ${answers[q.id] === idx ? 'text-blue-900' : 'text-slate-600'}`}>
                {opt}
              </span>
            </button>
          ))}
        </div>

        <div className="pt-10 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Answers are final</span>
          </div>
          <button
            onClick={handleNext}
            disabled={answers[q.id] === undefined}
            className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {currentIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
