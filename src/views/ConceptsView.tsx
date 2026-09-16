import React, { useState } from 'react';
import { CONCEPTS_DATA } from '../data/concepts';
import { BookOpen, CheckCircle, ChevronRight, Calculator, Play } from 'lucide-react';
import { QuantumEngine } from '../quantum/engine';
import { QuantumState } from '../quantum/state';

interface ConceptsViewProps {
  onLoadPresetToSimulator?: (presetId: string) => void;
}

export const ConceptsView: React.FC<ConceptsViewProps> = ({ onLoadPresetToSimulator }) => {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(CONCEPTS_DATA[0].id);
  const [showMath, setShowMath] = useState<boolean>(true);

  const concept = CONCEPTS_DATA.find(c => c.id === selectedConceptId) || CONCEPTS_DATA[0];

  // Compute live state for the concept's interactive preset if present
  let previewProbabilities: number[] = [1, 0];
  let previewBasisStrings: string[] = ['|0⟩', '|1⟩'];
  if (concept.interactivePreset) {
    const numQ = concept.interactivePreset.numQubits;
    let s = QuantumState.zeroState(numQ);
    for (const op of concept.interactivePreset.gates) {
      s = QuantumEngine.applyOperation(s, op);
    }
    previewProbabilities = s.getProbabilities();
    previewBasisStrings = previewProbabilities.map(
      (_, idx) => `|${idx.toString(2).padStart(numQ, '0')}⟩`
    );
  }

  const categories = Array.from(new Set(CONCEPTS_DATA.map(c => c.category)));

  return (
    <div className="space-y-6 select-none">
      <div>
        <span className="text-[11px] font-bold tracking-widest text-muted-text uppercase block mb-1">
          Interactive Textbook
        </span>
        <h1 className="text-3xl font-bold font-serif text-dark-text tracking-tight flex items-center space-x-2">
          <BookOpen className="w-7 h-7 text-primary-green" />
          <span>Fundamental Quantum Concepts</span>
        </h1>
        <p className="text-xs text-muted-text max-w-2xl leading-relaxed mt-1">
          Structured conceptual modules designed for intuitive understanding followed by rigorous mathematical formalisms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Concept Navigation Sidebar (3.5 / 12) */}
        <div className="lg:col-span-4 space-y-3">
          {categories.map(cat => (
            <div key={cat} className="paper-card p-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-text block mb-1.5 px-2">
                {cat}
              </span>
              <div className="space-y-1">
                {CONCEPTS_DATA.filter(c => c.category === cat).map(item => {
                  const isSelected = item.id === selectedConceptId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedConceptId(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                        isSelected
                          ? 'bg-soft-green text-primary-green font-bold'
                          : 'text-dark-text hover:bg-background'
                      }`}
                    >
                      <span>{item.title}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-primary-green' : 'text-muted-text/50'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Active Concept View (8.5 / 12) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="paper-card p-6 space-y-5">
            {/* Header */}
            <div className="pb-3 border-b border-border">
              <span className="text-xs font-mono font-semibold text-primary-green uppercase tracking-wider block mb-1">
                {concept.category}
              </span>
              <h2 className="text-2xl font-bold font-serif text-dark-text">
                {concept.title}
              </h2>
              <p className="text-xs font-serif italic text-muted-text mt-1">
                {concept.summary}
              </p>
            </div>

            {/* Plain-Language Explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark-text">
                Intuitive Explanation
              </h4>
              <p className="text-xs text-dark-text leading-relaxed">
                {concept.plainText}
              </p>
            </div>

            {/* Interactive Live Example */}
            {concept.interactivePreset && (
              <div className="p-4 bg-background rounded-lg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark-text">
                    Interactive Live State
                  </span>
                  {onLoadPresetToSimulator && (
                    <button
                      onClick={() => onLoadPresetToSimulator('bell_phi_plus')}
                      className="flex items-center space-x-1 text-xs text-primary-green hover:underline font-semibold"
                    >
                      <Play className="w-3 h-3" />
                      <span>Open in Simulator</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  {previewBasisStrings.map((basis, idx) => {
                    const prob = previewProbabilities[idx];
                    const percent = (prob * 100).toFixed(1);
                    return (
                      <div key={basis} className="flex items-center">
                        <span className="w-14 font-bold text-dark-text">{basis}</span>
                        <div className="flex-1 h-3 bg-surface rounded overflow-hidden mx-2 border border-border/40">
                          <div
                            className="h-full bg-primary-green transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-muted-text">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark-text">
                Key Principles
              </h4>
              <div className="space-y-1.5">
                {concept.keyTakeaways.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-dark-text">
                    <CheckCircle className="w-3.5 h-3.5 text-primary-green flex-shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Mathematics Expansion */}
            <div className="pt-3 border-t border-border/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <Calculator className="w-4 h-4 text-warm-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider text-dark-text">
                    Mathematical Formulation
                  </span>
                </div>
                <button
                  onClick={() => setShowMath(!showMath)}
                  className="text-xs text-primary-green hover:underline font-semibold"
                >
                  {showMath ? 'Hide Formalism' : 'Show Formalism'}
                </button>
              </div>

              {showMath && (
                <div className="p-3 bg-background rounded-lg border border-border/70 font-mono text-xs text-dark-text leading-relaxed">
                  <pre className="whitespace-pre-wrap">{concept.mathExplanation}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
