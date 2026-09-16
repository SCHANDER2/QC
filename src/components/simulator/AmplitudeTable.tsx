import React, { useState } from 'react';
import { AmplitudeItem } from '../../types/quantum';
import { ComplexNumber } from '../../quantum/complex';
import { ChevronDown, ChevronUp, Binary } from 'lucide-react';

interface AmplitudeTableProps {
  amplitudes: AmplitudeItem[];
  isExplorerMode: boolean;
}

export const AmplitudeTable: React.FC<AmplitudeTableProps> = ({
  amplitudes,
  isExplorerMode,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [sortByProb, setSortByProb] = useState(false);

  // Default display limit for large statevectors (e.g. 2^4 = 16 or 2^8 = 256)
  const displayLimit = showAll ? amplitudes.length : 8;

  let items = [...amplitudes];
  if (sortByProb) {
    items.sort((a, b) => b.probability - a.probability);
  }

  const visibleItems = items.slice(0, displayLimit);

  return (
    <div className="paper-card p-3 select-none">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <div className="flex items-center space-x-2">
          <Binary className="w-4 h-4 text-primary-green" />
          <span className="text-xs font-bold uppercase tracking-wider text-dark-text">
            State Amplitudes & Probabilities
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setSortByProb(!sortByProb)}
            className={`px-2 py-0.5 rounded text-[11px] border transition-colors ${
              sortByProb
                ? 'bg-soft-green text-primary-green border-primary-green font-medium'
                : 'bg-surface text-muted-text border-border hover:text-dark-text'
            }`}
          >
            {sortByProb ? 'Sorted: Probability' : 'Basis Order'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="text-[11px] text-muted-text border-b border-border/60">
              <th className="pb-1 font-medium">Basis |b⟩</th>
              <th className="pb-1 font-medium">Amplitude α_b</th>
              <th className="pb-1 font-medium">Probability P(b)</th>
              {isExplorerMode && <th className="pb-1 font-medium text-right">Phase φ</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {visibleItems.map(item => {
              const probPercent = (item.probability * 100).toFixed(1);
              const isNonZero = item.probability > 0.0001;

              return (
                <tr
                  key={item.index}
                  className={`hover:bg-background/60 transition-colors ${
                    isNonZero ? 'text-dark-text' : 'text-muted-text/50'
                  }`}
                >
                  <td className="py-1.5 font-bold">
                    <span className={isNonZero ? 'text-primary-green' : ''}>{item.basis}</span>
                  </td>

                  <td className="py-1.5 text-xs">
                    {isNonZero ? ComplexNumber.from(item.amplitude).toString(3) : '0'}
                  </td>

                  <td className="py-1.5 pr-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-border/50 rounded-full overflow-hidden flex-shrink-0">
                        <div
                          className="h-full bg-primary-green rounded-full transition-all duration-300"
                          style={{ width: `${item.probability * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px]">{probPercent}%</span>
                    </div>
                  </td>

                  {isExplorerMode && (
                    <td className="py-1.5 text-right text-[11px]">
                      {isNonZero ? (
                        <span className="text-dark-text font-medium">{item.phaseDeg}°</span>
                      ) : (
                        <span className="text-muted-text/40">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {amplitudes.length > 8 && (
        <div className="mt-3 pt-2 border-t border-border/40 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center space-x-1 text-xs text-primary-green hover:underline font-medium"
          >
            <span>{showAll ? 'Show Fewer States' : `Show All ${amplitudes.length} States`}</span>
            {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
};
