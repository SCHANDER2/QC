import React from 'react';
import { ArrowRight, Activity, Grid, GitBranch, Share2, Sparkles, BookOpen } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const learningPaths = [
    {
      id: 'qubits',
      title: '1. Qubits',
      subtitle: 'The 2-Level Quantum System',
      description:
        'Explore continuous superposition, probability amplitudes α and β, and manipulate points directly on the 3D Bloch sphere.',
      icon: Activity,
      color: 'bg-soft-green text-primary-green',
    },
    {
      id: 'gates',
      title: '2. Quantum Gates',
      subtitle: 'Unitary State Rotations',
      description:
        'Understand reversible logic: Pauli-X, Y, Z, Hadamard superpositions, phase rotations, and matrix formalisms.',
      icon: Grid,
      color: 'bg-[#FBEAE5] text-[#8C3A21]',
    },
    {
      id: 'circuits',
      title: '3. Circuits',
      subtitle: 'Multi-Wire Quantum Execution',
      description:
        'Compose multi-qubit algorithms, step through time t=0...T, observe statevector butterflies, and run projective measurements.',
      icon: GitBranch,
      color: 'bg-[#EBF1F5] text-[#24526E]',
    },
    {
      id: 'simulate',
      title: '4. Entanglement',
      subtitle: 'Non-Local Quantum Correlations',
      description:
        'Synthesize Bell states (|00⟩+|11⟩)/√2 and observe why global pure states yield locally mixed states with Bloch radius r < 1.',
      icon: Share2,
      color: 'bg-[#FDF3E5] text-[#784A12]',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6 select-none">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-soft-green border border-[#C3D7CA] text-xs font-semibold text-primary-green mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Quantum Laboratory</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold font-serif text-dark-text tracking-tight leading-tight">
          Learn quantum computing by <span className="text-primary-green underline decoration-[#C3D7CA]">seeing it happen</span>.
        </h1>

        <p className="text-sm text-muted-text leading-relaxed">
          From single-qubit Bloch sphere rotations to multi-qubit entanglement and statevector collapse. Mathematically exact, transparent, and built for serious understanding.
        </p>

        {/* Primary Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('simulate')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-primary-green hover:bg-primary-green-hover text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <span>Open Multi-Qubit Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('qubits')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-border bg-surface hover:bg-background text-dark-text font-semibold text-xs transition-colors"
          >
            <span>Start with 3D Bloch Sphere</span>
          </button>
        </div>
      </div>

      {/* 4 Core Learning Paths */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-dark-text">
              Curated Learning Pathways
            </h3>
            <p className="text-xs text-muted-text">
              Master quantum mechanics step-by-step through direct observation.
            </p>
          </div>
          <button
            onClick={() => onNavigate('concepts')}
            className="text-xs text-primary-green hover:underline font-medium flex items-center space-x-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Browse All 15 Concepts</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learningPaths.map(path => {
            const Icon = path.icon;
            return (
              <div
                key={path.id}
                onClick={() => onNavigate(path.id)}
                className="paper-card-interactive p-5 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-wider text-muted-text uppercase">
                      {path.title}
                    </span>
                    <div className={`p-2 rounded-lg ${path.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-dark-text font-serif mb-1 group-hover:text-primary-green transition-colors">
                    {path.subtitle}
                  </h4>

                  <p className="text-xs text-muted-text leading-relaxed">
                    {path.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center text-xs font-semibold text-primary-green">
                  <span>Enter Lab</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Academic Rigor Highlights Banner */}
      <div className="paper-card p-6 bg-surface grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <span className="text-2xl font-bold font-serif text-dark-text block mb-1">
            Exact Statevector
          </span>
          <p className="text-xs text-muted-text">
            Simulates 2ⁿ complex amplitudes with floating-point tolerance; no fake visual interpolations.
          </p>
        </div>
        <div>
          <span className="text-2xl font-bold font-serif text-primary-green block mb-1">
            Partial Trace Purity
          </span>
          <p className="text-xs text-muted-text">
            Entangled multi-qubit states show mixed reduced states with Bloch radius r &lt; 1 inside the sphere.
          </p>
        </div>
        <div>
          <span className="text-2xl font-bold font-serif text-warm-accent block mb-1">
            Projective Collapse
          </span>
          <p className="text-xs text-muted-text">
            Single-shot measurement produces real wavefunction collapse; multi-shots generate empirical histograms.
          </p>
        </div>
      </div>
    </div>
  );
};
