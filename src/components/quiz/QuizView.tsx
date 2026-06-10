import { useState } from 'react';
import clsx from 'clsx';
import { useAppStore } from '../../store/appStore';
import { QUIZ_QUESTIONS, QUIZ_RESULT_CONFIG } from '../../data/carbonData';

// Safe-list colors for Tailwind text classes
const colorMap: Record<string, string> = {
  green: 'text-green-600',
  emerald: 'text-emerald-600',
  teal: 'text-teal-600',
  amber: 'text-amber-600',
  orange: 'text-orange-600'
};

export function QuizView() {
  const { quizScore, quizTotal, incrementScore, resetQuiz } = useAppStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isComplete = currentIdx >= QUIZ_QUESTIONS.length;
  const q = QUIZ_QUESTIONS[currentIdx];

  function handleAnswer(index: number) {
    if (revealed) return;
    setSelected(index);
    setRevealed(true);
    incrementScore(index === q.correctIndex);
  }

  function handleNext() {
    setSelected(null);
    setRevealed(false);
    setCurrentIdx(i => i + 1);
  }

  function handleRestart() {
    resetQuiz();
    setCurrentIdx(0);
    setSelected(null);
    setRevealed(false);
  }

  if (isComplete) {
    const pct = quizTotal > 0 ? Math.round((quizScore / quizTotal) * 100) : 0;
    const result = QUIZ_RESULT_CONFIG.find(c => quizScore >= c.minScore && quizScore <= c.maxScore) || QUIZ_RESULT_CONFIG[0];
    
    return (
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-transparent">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-card text-center animate-scale-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Results</h1>
          <div 
            role="progressbar" 
            aria-valuenow={pct} 
            aria-valuemin={0} 
            aria-valuemax={100}
            className="w-32 h-32 mx-auto my-6 bg-brand-50 rounded-full flex items-center justify-center border-4 border-brand-500 shadow-glow"
          >
            <span className="text-4xl font-black text-brand-600">{pct}%</span>
          </div>
          <div className="text-6xl mb-4" aria-hidden="true">{result.icon}</div>
          <h2 className={clsx('text-2xl font-bold mb-3', colorMap[result.color] || 'text-brand-600')}>{result.label}</h2>
          <p className="text-gray-600 mb-8">{result.description}</p>
          <button 
            onClick={handleRestart}
            className="w-full py-4 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors min-h-[44px]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-transparent">
      <header className="max-w-3xl mx-auto mb-8 text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Climate Knowledge Quiz</h1>
        <div 
          role="progressbar" 
          aria-valuenow={currentIdx + 1} 
          aria-valuemin={1} 
          aria-valuemax={QUIZ_QUESTIONS.length}
          aria-label={`Question ${currentIdx + 1} of ${QUIZ_QUESTIONS.length}`}
          className="h-2 bg-gray-200 rounded-full overflow-hidden max-w-md mx-auto"
        >
          <div 
            className="h-full bg-brand-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentIdx) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-card animate-slide-up">
        <h2 id="quiz-q" className="text-xl md:text-2xl font-semibold text-gray-900 mb-8">
          {q.question}
        </h2>

        <div role="radiogroup" aria-labelledby="quiz-q" className="space-y-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === q.correctIndex;
            const showCorrect = revealed && isCorrect;
            const showWrong = revealed && isSelected && !isCorrect;

            return (
              <button
                key={i}
                role="radio"
                aria-checked={isSelected}
                disabled={revealed}
                onClick={() => handleAnswer(i)}
                className={clsx(
                  'w-full flex items-center p-4 rounded-xl border-2 text-left transition-all duration-200 min-h-[44px]',
                  !revealed && isSelected && 'border-brand-500 bg-brand-50',
                  !revealed && !isSelected && 'border-gray-100 hover:border-gray-200 hover:bg-gray-50',
                  showCorrect && 'border-green-500 bg-green-50 text-green-900',
                  showWrong && 'border-red-500 bg-red-50 text-red-900',
                  revealed && !isCorrect && !isSelected && 'border-gray-100 opacity-50'
                )}
              >
                <div className={clsx(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0',
                  showCorrect ? 'border-green-500 bg-green-500' : 
                  showWrong ? 'border-red-500 bg-red-500' : 
                  isSelected ? 'border-brand-500' : 'border-gray-300'
                )}>
                  {showCorrect && <span aria-hidden="true" className="text-white text-xs">✓</span>}
                  {showWrong && <span aria-hidden="true" className="text-white text-xs">✕</span>}
                </div>
                <span className="font-medium text-lg">{opt}</span>
              </button>
            );
          })}
        </div>

        {revealed && (
          <div role="alert" aria-live="polite" className="mt-8 animate-slide-up">
            <div className={clsx(
              'p-5 rounded-2xl mb-6',
              selected === q.correctIndex ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
            )}>
              <p className="font-bold mb-2 text-lg">
                {selected === q.correctIndex ? '✓ Correct!' : '✕ Incorrect'}
              </p>
              <p className="leading-relaxed">{q.explanation}</p>
              {q.funFact && (
                <div className="mt-4 p-4 bg-white/50 rounded-xl text-sm border border-white/20">
                  <span className="font-bold">Did you know?</span> {q.funFact}
                </div>
              )}
            </div>
            
            <button
              onClick={handleNext}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors min-h-[44px]"
            >
              {currentIdx === QUIZ_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
