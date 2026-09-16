import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Trash2, Undo2, Redo2 } from 'lucide-react';
import { ExecutionMode } from '../../types/quantum';

interface CircuitControlsProps {
  mode: ExecutionMode;
  currentStep: number;
  totalSteps: number;
  canUndo: boolean;
  canRedo: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const CircuitControls: React.FC<CircuitControlsProps> = ({
  mode,
  currentStep,
  totalSteps,
  canUndo,
  canRedo,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  onClear,
  onUndo,
  onRedo,
}) => {
  const isPlaying = mode === 'PLAY';

  return (
    <div className="paper-card p-3 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Execution Stepper Buttons */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors ${
            isPlaying
              ? 'bg-warm-accent text-white hover:bg-warm-accent-hover'
              : 'bg-primary-green text-white hover:bg-primary-green-hover'
          }`}
          title={isPlaying ? 'Pause simulation' : 'Run entire circuit'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Pause' : 'Run Circuit'}</span>
        </button>

        <button
          onClick={onStepBack}
          disabled={currentStep <= 0}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-medium border border-border bg-surface hover:bg-soft-green text-dark-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Step backward one gate"
        >
          <SkipBack className="w-3.5 h-3.5" />
          <span>Step Back</span>
        </button>

        <button
          onClick={onStepForward}
          disabled={currentStep >= totalSteps}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-medium border border-border bg-surface hover:bg-soft-green text-dark-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Step forward one gate"
        >
          <span>Step Forward</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onReset}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-medium border border-border bg-surface hover:bg-background text-dark-text transition-colors"
          title="Reset to initial ground state |0...0⟩"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Step Progress Counter */}
      <div className="flex items-center space-x-2 text-xs font-mono text-dark-text bg-background border border-border px-3 py-1.5 rounded">
        <span className="text-muted-text">Timeline:</span>
        <span className="font-bold">
          Step {currentStep} / {totalSteps}
        </span>
      </div>

      {/* History & Edit Controls */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 rounded border border-border bg-surface hover:bg-background text-dark-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Undo gate edit"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 rounded border border-border bg-surface hover:bg-background text-dark-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Redo gate edit"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-border mx-1" />

        <button
          onClick={onClear}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-medium border border-border bg-surface hover:bg-soft-warm hover:border-warm-accent text-dark-text transition-colors"
          title="Clear all gates from circuit"
        >
          <Trash2 className="w-3.5 h-3.5 text-warm-accent" />
          <span>Clear Circuit</span>
        </button>
      </div>
    </div>
  );
};
