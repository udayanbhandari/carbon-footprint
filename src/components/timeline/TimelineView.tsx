import clsx from 'clsx';
import { CLIMATE_TIMELINE } from '../../data/carbonData';

export function TimelineView() {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center animate-fade-in">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            <span aria-hidden="true">📅</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Climate Timeline</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the key milestones in climate science, policy, and global impacts from 1856 to the net zero targets of 2050.
          </p>
        </header>

        <div className="relative border-l-4 border-gray-200 ml-6 md:ml-1/2 md:-translate-x-1/2">
          {CLIMATE_TIMELINE.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div 
                key={event.id} 
                className={clsx(
                  'mb-12 w-full md:w-1/2 relative pl-8 md:pl-0',
                  isLeft ? 'md:pr-12 md:left-0' : 'md:pl-12 md:left-1/2'
                )}
              >
                <div 
                  className={clsx(
                    'absolute top-0 w-10 h-10 rounded-full flex items-center justify-center text-xl bg-white border-4 border-brand-500 shadow-sm z-10',
                    '-left-5',
                    isLeft ? 'md:-right-5 md:left-auto' : 'md:-left-5'
                  )}
                  aria-hidden="true"
                >
                  {event.icon}
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-glow transition-shadow duration-300 animate-slide-up" style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-brand-600 font-black text-xl">{event.year}</span>
                    <span className={clsx(
                      'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg',
                      event.type === 'scientific' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'political' ? 'bg-purple-100 text-purple-800' :
                      event.type === 'disaster' ? 'bg-red-100 text-red-800' :
                      event.type === 'target' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {event.type}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                  {event.details && (
                    <p className="text-gray-500 text-sm mt-3 pt-3 border-t border-gray-100 italic">
                      {event.details}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
