import clsx from 'clsx';
import { CLIMATE_TIMELINE } from '../../data/carbonData';

export function TimelineView() {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-transparent">
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center animate-fade-in">
          <div className="w-14 h-14 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
            <span aria-hidden="true">📅</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Climate Timeline</h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Explore the key milestones in climate science, policy, and global impacts from 1856 to the net zero targets of 2050.
          </p>
        </header>

        {/* Timeline: single column centered for all devices */}
        <div className="relative">
          {/* Vertical line centered */}
          <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 sm:-translate-x-px" aria-hidden="true" />

          <div className="space-y-8">
            {CLIMATE_TIMELINE.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={event.id}
                  className="relative flex items-center justify-center sm:justify-start"
                >
                  {/* Left spacer on desktop/tablet to align with the center line */}
                  <div className="hidden sm:block w-[calc(50%-1.25rem)] pr-4 text-right">
                    {isEven && (
                      <div
                        className="bg-white rounded-2xl p-5 shadow-card hover:shadow-glow transition-shadow duration-300 animate-slide-up inline-block text-left w-full"
                        style={{ animationDelay: `${Math.min(index * 80, 500)}ms` }}
                      >
                        <TimelineCardContent event={event} />
                      </div>
                    )}
                  </div>

                  {/* Center dot / Icon container */}
                  <div className="absolute left-0 sm:left-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shadow-sm sm:-translate-x-1/2" aria-hidden="true">
                    {event.icon}
                  </div>

                  {/* Timeline Card content on the right side */}
                  <div className="ml-14 sm:ml-0 sm:pl-4 flex-1 sm:w-[calc(50%-1.25rem)] sm:max-w-[calc(50%-1.25rem)]">
                    {/* Only render on right if odd (or always on mobile) */}
                    <div className="sm:hidden">
                      <div
                        className="bg-white rounded-2xl p-5 shadow-card hover:shadow-glow transition-shadow duration-300 animate-slide-up"
                        style={{ animationDelay: `${Math.min(index * 80, 500)}ms` }}
                      >
                        <TimelineCardContent event={event} />
                      </div>
                    </div>
                    
                    <div className="hidden sm:block">
                      {!isEven && (
                        <div
                          className="bg-white rounded-2xl p-5 shadow-card hover:shadow-glow transition-shadow duration-300 animate-slide-up"
                          style={{ animationDelay: `${Math.min(index * 80, 500)}ms` }}
                        >
                          <TimelineCardContent event={event} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-12" />
      </div>
    </div>
  );
}

/* Extracted card content to avoid duplication */
function TimelineCardContent({ event }: { event: typeof CLIMATE_TIMELINE[number] }) {
  return (
    <>
      <div className="flex items-center gap-2.5 mb-2">
        <span className="text-brand-600 font-black text-lg">{event.year}</span>
        <span className={clsx(
          'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md',
          event.type === 'scientific' ? 'bg-blue-100 text-blue-800' :
          event.type === 'political' ? 'bg-purple-100 text-purple-800' :
          event.type === 'disaster' ? 'bg-red-100 text-red-800' :
          event.type === 'target' ? 'bg-emerald-100 text-emerald-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {event.type}
        </span>
      </div>
      <h2 className="text-base font-bold text-gray-900 mb-1.5">{event.title}</h2>
      <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
      {event.details && (
        <p className="text-gray-500 text-sm mt-2.5 pt-2.5 border-t border-gray-100 italic">
          {event.details}
        </p>
      )}
    </>
  );
}
