import { useState } from 'react';
import clsx from 'clsx';
import { useAppStore } from '../../store/appStore';
import { ACTIVITY_CATEGORIES } from '../../data/carbonData';

export function CalculatorView() {
  const { footprintEntries, upsertFootprintEntry, removeFootprintEntry, footprintSummary } = useAppStore();
  const [activeCategory, setActiveCategory] = useState(ACTIVITY_CATEGORIES[0].id);

  const categoryData = ACTIVITY_CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-transparent">
      {/* Category Sidebar */}
      <div className="w-full md:w-64 bg-white/50 backdrop-blur-sm border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 p-4 overflow-x-auto md:overflow-y-auto">
        <h1 className="text-lg font-bold text-gray-900 mb-4 px-2 hidden md:block">Categories</h1>
        <div role="tablist" aria-label="Footprint categories" className="flex md:flex-col gap-2">
          {ACTIVITY_CATEGORIES.map(cat => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors whitespace-nowrap min-h-[44px]',
                  isActive ? 'bg-white shadow-soft text-brand-700 font-semibold' : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                )}
              >
                <span aria-hidden="true" className="text-xl">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="flex-1 p-6 md:p-8 overflow-y-auto bg-transparent" 
        id={`panel-${activeCategory}`} 
        role="tabpanel" 
        tabIndex={0} 
        aria-labelledby={activeCategory}
      >
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span aria-hidden="true">{categoryData.icon}</span>
              {categoryData.label}
            </h2>
            <p className="text-gray-500 mt-1">{categoryData.description}</p>
          </header>

          <div className="space-y-4">
            {categoryData.activities.map(act => {
              const entry = footprintEntries.find(e => e.activityId === act.id);
              const val = entry ? entry.quantity : 0;
              
              return (
                <div key={act.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 md:items-center animate-slide-up">
                  <div className="flex-1">
                    <label htmlFor={`input-${act.id}`} className="font-semibold text-gray-900 block mb-1">
                      {act.label}
                    </label>
                    <p className="text-sm text-gray-500 mb-3 md:mb-0">{act.description}</p>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <input
                      id={`input-${act.id}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={val || ''}
                      placeholder="0"
                      onChange={(e) => {
                        const num = parseFloat(e.target.value);
                        if (isNaN(num) || num <= 0) {
                          removeFootprintEntry(act.id);
                        } else {
                          upsertFootprintEntry({
                            activityId: act.id,
                            category: act.category,
                            quantity: num,
                            kgCO2e: num * act.emissionFactor,
                            recordedAt: new Date().toISOString()
                          });
                        }
                      }}
                      className="w-24 md:w-32 h-11 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-right bg-gray-50"
                    />
                    <span className="text-sm text-gray-500 min-w-[80px]">{act.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Card */}
          <div className="mt-12 bg-brand-900 text-white rounded-3xl p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-medium text-brand-200 mb-1">Your Total Footprint</h3>
              <div className="text-4xl font-black">
                {footprintSummary ? footprintSummary.totalTonnesCO2e.toFixed(2) : '0.00'} <span className="text-2xl font-medium text-brand-300">tonnes CO₂e</span>
              </div>
            </div>
            {footprintSummary && footprintSummary.totalKgCO2e > 0 && (
              <div className="flex gap-4 w-full md:w-auto text-sm font-medium">
                <div className="bg-white/10 rounded-xl p-4 flex-1 text-center">
                  <div className="text-brand-300 mb-1">Transport</div>
                  <div>{footprintSummary.categoryPercentages.transport.toFixed(0)}%</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex-1 text-center">
                  <div className="text-brand-300 mb-1">Food</div>
                  <div>{footprintSummary.categoryPercentages.food.toFixed(0)}%</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex-1 text-center">
                  <div className="text-brand-300 mb-1">Home</div>
                  <div>{footprintSummary.categoryPercentages.energy.toFixed(0)}%</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
