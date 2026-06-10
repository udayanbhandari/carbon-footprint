import { useState } from 'react';
import clsx from 'clsx';
import { WIZARD_STEPS, REDUCTION_TIPS } from '../../data/carbonData';

export function NextStepView() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [complete, setComplete] = useState(false);

  const currentStep = WIZARD_STEPS[step];

  function handleSelect(optionId: string) {
    setSelections(s => ({ ...s, [currentStep.id]: optionId }));
    
    if (step < WIZARD_STEPS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      setTimeout(() => setComplete(true), 300);
    }
  }

  function getActionPlan() {
    const tipIds = new Set<string>();
    Object.values(selections).forEach(optId => {
      for (const s of WIZARD_STEPS) {
        const opt = s.options.find(o => o.id === optId);
        if (opt) {
          opt.tipIds.forEach(id => tipIds.add(id));
        }
      }
    });

    const tips = Array.from(tipIds)
      .map(id => REDUCTION_TIPS.find(t => t.id === id)!)
      .filter(Boolean);
    const totalSaving = tips.reduce((sum, t) => sum + t.estimatedSavingKg, 0);

    return { tips, totalSaving };
  }

  if (complete) {
    const plan = getActionPlan();
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-transparent">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              <span aria-hidden="true">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">What's my next step?</h1>
            <p className="text-gray-600 text-lg">
              Potential savings: <strong className="text-brand-600">{plan.totalSaving} kg CO₂e / year</strong>
            </p>
          </header>

          <ol aria-label="Your personalised election action plan" className="space-y-4">
            {plan.tips.map((tip, i) => (
              <li key={tip.id} className="bg-white rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" aria-hidden="true">
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{tip.title}</h2>
                    <p className="text-gray-600 mb-3">{tip.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-lg">
                        Saves ~{tip.estimatedSavingKg} kg CO₂e
                      </span>
                      {tip.savesMoney && (
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg">
                          💰 Saves money
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          
          <button 
            onClick={() => { setComplete(false); setStep(0); setSelections({}); }}
            className="block mx-auto mt-8 text-brand-600 font-medium hover:text-brand-800 transition-colors min-h-[44px] px-4"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-transparent">
      <div className="max-w-2xl w-full">
        <div aria-label={`Step ${step + 1} of ${WIZARD_STEPS.length}`} className="flex justify-center gap-2 mb-8">
          {WIZARD_STEPS.map((_, i) => (
            <div key={i} className={clsx('h-1.5 rounded-full transition-all duration-300', i <= step ? 'w-8 bg-brand-500' : 'w-4 bg-gray-200')} />
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-card animate-scale-in">
          <h1 id="wiz-q" className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {currentStep.question}
          </h1>

          <div role="group" aria-labelledby="wiz-q" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStep.options.map(opt => {
              const isSelected = selections[currentStep.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={clsx(
                    'p-5 rounded-2xl border-2 text-left transition-all duration-200 min-h-[44px]',
                    isSelected 
                      ? 'border-brand-500 bg-brand-50 shadow-glow' 
                      : 'border-gray-100 hover:border-brand-200 hover:bg-gray-50 hover:shadow-soft'
                  )}
                >
                  <div className="text-3xl mb-3" aria-hidden="true">{opt.icon}</div>
                  <div className="font-bold text-gray-900 text-lg mb-1">{opt.label}</div>
                  <div className="text-sm text-gray-500">{opt.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
