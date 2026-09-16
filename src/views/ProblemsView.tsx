import React, { useState } from 'react';
import { PROBLEMS_DATA } from '../data/problems';
import { FileQuestion, CheckCircle2, XCircle, HelpCircle, Trophy, RotateCcw } from 'lucide-react';

export const ProblemsView: React.FC = () => {
  const [activeProblemIdx, setActiveProblemIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [completedProblems, setCompletedProblems] = useState<{ [id: string]: boolean }>({});

  const currentProblem = PROBLEMS_DATA[activeProblemIdx];
  const selectedOption = currentProblem.options.find(opt => opt.id === selectedOptionId);

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setSubmitted(true);
    if (selectedOption?.isCorrect) {
      setCompletedProblems(prev => ({ ...prev, [currentProblem.id]: true }));
    }
  };

  const handleNextProblem = () => {
    setSelectedOptionId(null);
    setSubmitted(false);
    setShowHint(false);
    if (activeProblemIdx < PROBLEMS_DATA.length - 1) {
      setActiveProblemIdx(activeProblemIdx + 1);
    }
  };

  const handleResetProgress = () => {
    setCompletedProblems({});
    setSelectedOptionId(null);
    setSubmitted(false);
    setShowHint(false);
    setActiveProblemIdx(0);
  };

  const totalScore = Object.values(completedProblems).filter(Boolean).length;

  return (
    <div className="space-y-6 select-none max-w-4xl mx-auto">
      {/* Top Header & Score Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-muted-text uppercase block mb-1">
            Interactive Quantum Problem Set
          </span>
          <h1 className="text-3xl font-bold font-serif text-dark-text tracking-tight flex items-center space-x-2">
            <FileQuestion className="w-7 h-7 text-primary-green" />
            <span>Problem Lab & Exercises</span>
          </h1>
          <p className="text-xs text-muted-text mt-1">
            Test and consolidate your understanding of quantum mechanics, gate algebra, and entanglement.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-surface border border-border px-4 py-2 rounded-xl">
          <Trophy className="w-5 h-5 text-warm-accent" />
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-text block">
              Completed
            </span>
            <span className="font-mono text-sm font-bold text-dark-text">
              {totalScore} / {PROBLEMS_DATA.length} Solved
            </span>
          </div>
        </div>
      </div>

      {/* Problem Index Navigation Buttons */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {PROBLEMS_DATA.map((p, idx) => {
          const isCurrent = activeProblemIdx === idx;
          const isSolved = completedProblems[p.id];

          return (
            <button
              key={p.id}
              onClick={() => {
                setActiveProblemIdx(idx);
                setSelectedOptionId(null);
                setSubmitted(false);
                setShowHint(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center space-x-1 flex-shrink-0 ${
                isCurrent
                  ? 'bg-primary-green text-white font-bold shadow-xs'
                  : isSolved
                  ? 'bg-soft-green text-primary-green border border-[#C3D7CA]'
                  : 'bg-surface border border-border text-muted-text hover:text-dark-text'
              }`}
            >
              <span>#{idx + 1}</span>
              {isSolved && <CheckCircle2 className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      {/* Active Problem Card */}
      <div className="paper-card p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <span className="text-xs font-mono font-bold text-primary-green uppercase tracking-wider">
            Problem {activeProblemIdx + 1}: {currentProblem.category}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
              currentProblem.difficulty === 'Beginner'
                ? 'bg-soft-green text-primary-green'
                : currentProblem.difficulty === 'Intermediate'
                ? 'bg-[#EBF1F5] text-[#24526E]'
                : 'bg-soft-warm text-warm-accent'
            }`}
          >
            {currentProblem.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-bold font-serif text-dark-text leading-snug">
          {currentProblem.prompt}
        </h3>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentProblem.options.map(opt => {
            const isSelected = selectedOptionId === opt.id;
            let optStyle = 'bg-surface border-border hover:border-primary-green text-dark-text';

            if (submitted) {
              if (opt.isCorrect) {
                optStyle = 'bg-soft-green border-primary-green text-primary-green font-bold';
              } else if (isSelected && !opt.isCorrect) {
                optStyle = 'bg-soft-warm border-warm-accent text-warm-accent font-bold';
              }
            } else if (isSelected) {
              optStyle = 'bg-soft-green/60 border-primary-green text-primary-green font-semibold';
            }

            return (
              <div
                key={opt.id}
                onClick={() => !submitted && setSelectedOptionId(opt.id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between text-xs ${optStyle}`}
              >
                <span>{opt.text}</span>
                {submitted && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-primary-green flex-shrink-0 ml-2" />
                )}
                {submitted && isSelected && !opt.isCorrect && (
                  <XCircle className="w-4 h-4 text-warm-accent flex-shrink-0 ml-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Hint Accordion */}
        <div>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center space-x-1.5 text-xs text-muted-text hover:text-primary-green font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
          </button>
          {showHint && (
            <div className="mt-2 p-3 bg-background rounded-lg border border-border/70 text-xs text-muted-text italic">
              💡 {currentProblem.hint}
            </div>
          )}
        </div>

        {/* Post-Submission Feedback */}
        {submitted && selectedOption && (
          <div
            className={`p-4 rounded-lg border text-xs leading-relaxed ${
              selectedOption.isCorrect
                ? 'bg-soft-green border-[#C3D7CA] text-dark-text'
                : 'bg-soft-warm border-[#E8C5BC] text-dark-text'
            }`}
          >
            <span className="font-bold block mb-1">
              {selectedOption.isCorrect ? '✅ Well done!' : '❌ Not quite:'}
            </span>
            <p>{selectedOption.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <button
            onClick={handleResetProgress}
            className="flex items-center space-x-1 text-xs text-muted-text hover:text-dark-text"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Progress</span>
          </button>

          <div className="flex space-x-2">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOptionId}
                className="px-5 py-2 rounded-lg bg-primary-green hover:bg-primary-green-hover text-white font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextProblem}
                disabled={activeProblemIdx >= PROBLEMS_DATA.length - 1}
                className="px-5 py-2 rounded-lg bg-primary-green hover:bg-primary-green-hover text-white font-semibold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {activeProblemIdx < PROBLEMS_DATA.length - 1 ? 'Next Problem →' : 'All Problems Completed!'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
