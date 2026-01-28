
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { generateAssessment } from '../services/gemini';
import { AssessmentQuestion, UserProfile } from '../types';

interface Props {
  profile: UserProfile | null;
  onComplete: (score: number) => void;
}

export default function Assessment({ profile, onComplete }: Props) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate('/onboarding');
      return;
    }

    const loadQuestions = async () => {
      try {
        const q = await generateAssessment(profile.targetSkill, profile.proficiencyLevel);
        setQuestions(q);
      } catch (err) {
        console.error("Failed to load questions", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [profile, navigate]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: optionIndex });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    const score = (correct / questions.length) * 100;
    return score;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Customizing Your Assessment</h2>
          <p className="text-slate-500">Gemini is crafting questions based on your skill level...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const score = calculateScore();
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center space-y-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Assessment Complete!</h2>
            <p className="text-slate-500 mt-2">We've established your baseline competency.</p>
          </div>
          
          <div className="p-8 bg-slate-50 rounded-2xl">
            <div className="text-6xl font-black text-blue-600 mb-2">{score}%</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mastery Score</div>
          </div>

          <p className="text-slate-600">
            Great job, {profile?.name}! We're now ready to generate your customized learning roadmap based on these results.
          </p>

          <button
            onClick={() => {
              onComplete(score);
              navigate('/roadmap/generate');
            }}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            Generate My Roadmap <ChevronRight />
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Baseline Assessment</span>
          <h1 className="text-2xl font-bold text-slate-900">{profile?.targetSkill}</h1>
        </div>
        <div className="text-slate-400 font-medium">
          Question <span className="text-slate-900">{currentIndex + 1}</span> of {questions.length}
        </div>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full mb-12">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-10">
        <h3 className="text-2xl font-bold text-slate-900 leading-tight">
          {currentQuestion.question}
        </h3>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full p-6 text-left rounded-2xl border-2 transition-all flex items-center gap-4 ${
                answers[currentQuestion.id] === idx
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-100 hover:border-slate-200 text-slate-600'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                answers[currentQuestion.id] === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="font-medium text-lg">{option}</span>
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {currentIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-slate-400 justify-center">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Don't worry, this helps customize your path. Be honest!</span>
      </div>
    </div>
  );
}
