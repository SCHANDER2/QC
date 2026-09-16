import React, { useState } from 'react';
import { Lightbulb, BookOpen, AlertTriangle } from 'lucide-react';

interface ExplanationBannerProps {
  headline: string;
  explanation: string;
  mathNotes?: string;
  entanglementNote?: string;
}

export const ExplanationBanner: React.FC<ExplanationBannerProps> = ({
  headline,
  explanation,
  mathNotes,
  entanglementNote,
}) => {
  const [showMath, setShowMath] = useState(false);

  return (
    <div className="paper-card p-4 border-l-4 border-l-primary-green select-none">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-full bg-soft-green text-primary-green flex-shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-primary-green">
                What Just Happened?
              </span>
              <span className="text-xs text-muted-text">•</span>
              <span className="text-xs font-semibold text-dark-text">{headline}</span>
            </div>

            <p className="text-xs text-dark-text leading-relaxed">{explanation}</p>

            {entanglementNote && (
              <div className="mt-2.5 p-2 bg-soft-warm rounded border border-[#E8C5BC] flex items-start space-x-2 text-xs text-warm-accent">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{entanglementNote}</span>
              </div>
            )}
          </div>
        </div>

        {mathNotes && (
          <button
            onClick={() => setShowMath(!showMath)}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs rounded border border-border bg-surface hover:bg-background text-dark-text transition-colors flex-shrink-0 ml-3"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary-green" />
            <span>{showMath ? 'Hide Math' : 'Show Math'}</span>
          </button>
        )}
      </div>

      {showMath && mathNotes && (
        <div className="mt-3 pt-3 border-t border-border/60 bg-background/50 p-2.5 rounded font-mono text-xs text-dark-text leading-relaxed">
          <span className="text-[10px] text-muted-text uppercase font-semibold block mb-1">
            Mathematical Formalism
          </span>
          <pre className="whitespace-pre-wrap">{mathNotes}</pre>
        </div>
      )}
    </div>
  );
};
