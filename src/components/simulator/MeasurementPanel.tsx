import React, { useState } from 'react';
import { MeasurementResult } from '../../types/quantum';
import { Sparkles, BarChart2, Zap } from 'lucide-react';

interface MeasurementPanelProps {
  onMeasureOneShot: () => void;
  onRunShots: (shots: number) => void;
  lastResult: MeasurementResult | null;
  collapsedBasis: string | null;
}

export const MeasurementPanel: React.FC<MeasurementPanelProps> = ({
  onMeasureOneShot,
  onRunShots,
  lastResult,
  collapsedBasis,
}) => {
  const [shotCount, setShotCount] = useState<number>(1024);

  return (
    <div className="paper-card p-3 select-none">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-warm-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-dark-text">
            Quantum Measurement & Collapse
          </span>
        </div>

        {collapsedBasis && (
          <div className="flex items-center space-x-1.5 bg-soft-warm border border-[#E8C5BC] px-2 py-0.5 rounded text-xs font-mono font-bold text-warm-accent">
            <span>Collapsed to:</span>
            <span>{collapsedBasis}</span>
          </div>
        )}
      </div>

      {/* Measurement Trigger Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {/* One-shot with collapse */}
        <div className="bg-background p-2.5 rounded border border-border/80 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-dark-text block mb-1">
              Projective Single-Shot
            </span>
            <p className="text-[11px] text-muted-text mb-2">
              Collapses the wavefunction to a single computational basis outcome according to Born’s rule.
            </p>
          </div>
          <button
            onClick={onMeasureOneShot}
            className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-warm-accent hover:bg-warm-accent-hover text-white transition-colors flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Measure & Collapse</span>
          </button>
        </div>

        {/* Multi-shot distribution */}
        <div className="bg-background p-2.5 rounded border border-border/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-dark-text">Multi-Shot Statistics</span>
              <div className="flex space-x-1">
                {[100, 1024, 4096].map(count => (
                  <button
                    key={count}
                    onClick={() => setShotCount(count)}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                      shotCount === count
                        ? 'bg-primary-green text-white font-bold'
                        : 'bg-surface border border-border text-muted-text hover:text-dark-text'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-muted-text mb-2">
              Samples repeated independent measurement trials to verify experimental probability distributions.
            </p>
          </div>
          <button
            onClick={() => onRunShots(shotCount)}
            className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-primary-green hover:bg-primary-green-hover text-white transition-colors flex items-center justify-center space-x-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Run {shotCount} Shots</span>
          </button>
        </div>
      </div>

      {/* Shots Histogram Results */}
      {lastResult?.shots && (
        <div className="pt-3 border-t border-border/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-dark-text uppercase tracking-wider">
              Experimental Frequency ({lastResult.totalShots} Shots)
            </span>
            <span className="text-[11px] text-muted-text">
              Outcome: <strong className="font-mono text-primary-green">{lastResult.basisOutcome}</strong>
            </span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {Object.entries(lastResult.shots)
              .filter(([_, count]) => count > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([basis, count]) => {
                const total = lastResult.totalShots || 1;
                const percent = ((count / total) * 100).toFixed(1);

                return (
                  <div key={basis} className="flex items-center text-xs font-mono">
                    <span className="w-16 font-bold text-dark-text">{basis}</span>
                    <div className="flex-1 h-3.5 bg-background rounded overflow-hidden mx-2 border border-border/40">
                      <div
                        className="h-full bg-warm-accent transition-all duration-300 rounded-sm"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-muted-text text-[11px]">{count}</span>
                    <span className="w-14 text-right font-semibold text-dark-text text-[11px]">
                      {percent}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
