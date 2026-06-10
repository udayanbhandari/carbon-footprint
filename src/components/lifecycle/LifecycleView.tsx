import { useState } from 'react';
import clsx from 'clsx';

const LIFECYCLES = [
  {
    id: 'lc_smartphone',
    title: 'A Smartphone (70 kg CO₂e)',
    icon: '📱',
    steps: [
      { phase: 'Raw Materials (Mining)', percent: 20, desc: 'Extracting rare earth metals and lithium requires heavy machinery and chemical processing.' },
      { phase: 'Manufacturing', percent: 60, desc: 'Producing the battery, screen, and microchips is incredibly energy-intensive, accounting for the majority of the footprint.' },
      { phase: 'Transport', percent: 5, desc: 'Shipping globally via air and sea freight.' },
      { phase: 'Usage (3 years)', percent: 14, desc: 'Charging the device daily using grid electricity.' },
      { phase: 'End of Life', percent: 1, desc: 'Recycling or e-waste processing.' }
    ]
  },
  {
    id: 'lc_beef',
    title: '1kg of Beef (60 kg CO₂e)',
    icon: '🥩',
    steps: [
      { phase: 'Land Use Change', percent: 25, desc: 'Deforestation to clear land for pasture or growing feed crops reduces the earth\'s carbon sink capacity.' },
      { phase: 'Farming (Methane)', percent: 45, desc: 'Cows naturally produce methane (a potent greenhouse gas) during digestion.' },
      { phase: 'Animal Feed', percent: 15, desc: 'Growing, processing, and transporting feed crops.' },
      { phase: 'Processing & Transport', percent: 10, desc: 'Slaughter, refrigeration, and supply chain logistics.' },
      { phase: 'Retail & Cooking', percent: 5, desc: 'Supermarket refrigeration and cooking at home.' }
    ]
  },
  {
    id: 'lc_tshirt',
    title: 'A Cotton T-Shirt (5.5 kg CO₂e)',
    icon: '👕',
    steps: [
      { phase: 'Farming & Processing', percent: 40, desc: 'Growing cotton requires significant water and fertilizer (which emits N₂O).' },
      { phase: 'Manufacturing', percent: 20, desc: 'Spinning, weaving, and dyeing fabrics use substantial electricity and heat.' },
      { phase: 'Transport & Retail', percent: 15, desc: 'Shipping from factories to global retail outlets.' },
      { phase: 'Usage (Washing/Drying)', percent: 20, desc: 'Washing in hot water and using a tumble dryer over the item\'s lifetime.' },
      { phase: 'End of Life', percent: 5, desc: 'Most clothing ends up in landfill or incineration.' }
    ]
  }
];

export function LifecycleView() {
  const [expandedId, setExpandedId] = useState<string | null>(LIFECYCLES[0].id);

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-transparent">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10 text-center animate-fade-in">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            <span aria-hidden="true">🔄</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Product Lifecycles</h1>
          <p className="text-lg text-gray-600">
            Where do emissions actually come from? Understanding the hidden carbon cost behind everyday items.
          </p>
        </header>

        <div className="space-y-4" role="tablist">
          {LIFECYCLES.map((lc) => {
            const isExpanded = expandedId === lc.id;
            return (
              <div key={lc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  role="tab"
                  aria-expanded={isExpanded}
                  aria-controls={`panel-${lc.id}`}
                  onClick={() => setExpandedId(isExpanded ? null : lc.id)}
                  className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl" aria-hidden="true">{lc.icon}</span>
                    <span className="text-xl font-bold text-gray-900">{lc.title}</span>
                  </div>
                  <div className={clsx('transform transition-transform duration-200 text-gray-400', isExpanded && 'rotate-180')} aria-hidden="true">
                    ▼
                  </div>
                </button>
                
                <div 
                  id={`panel-${lc.id}`}
                  role="tabpanel"
                  className={clsx('overflow-hidden transition-all duration-300', isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0')}
                >
                  <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/50">
                    <ul className="space-y-4 mt-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                      {lc.steps.map((step, i) => (
                        <li key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={clsx(
                            'flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-brand-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2',
                            'absolute left-0 md:left-1/2'
                          )}></div>
                          
                          <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white p-4 rounded-xl shadow-sm border border-gray-100 ml-10 md:ml-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-gray-900 text-sm">{step.phase}</h3>
                              <span className="text-xs font-black text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{step.percent}%</span>
                            </div>
                            <p className="text-sm text-gray-600">{step.desc}</p>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full mt-3 overflow-hidden">
                              <div className="h-full bg-brand-500" style={{ width: `${step.percent}%` }} />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
