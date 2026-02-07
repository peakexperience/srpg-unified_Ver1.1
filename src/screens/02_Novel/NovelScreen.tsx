import React, { useState } from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import type { NovelPhase } from '@/core/types';

export const NovelScreen: React.FC = () => {
    const { currentScenario, currentPhaseIndex, nextPhase } = useGameStore();
    const [isAnimating, setIsAnimating] = useState(false);

    const phase = currentScenario?.phases[currentPhaseIndex] as NovelPhase | undefined;

    if (!phase || phase.type !== 'NOVEL') {
        return null;
    }

    const handleClick = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            nextPhase();
            setIsAnimating(false);
        }, 300);
    };

    return (
        <div
            className="w-full h-full relative bg-slate-900 cursor-pointer"
            onClick={handleClick}
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/50 via-slate-900 to-slate-950">
                {/* Background pattern for demo */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-800/40 to-transparent"></div>
                    <svg className="absolute bottom-0 w-full h-1/3 text-emerald-900/30" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,100 L0,60 Q25,40 50,60 T100,60 L100,100 Z" fill="currentColor" />
                    </svg>
                </div>
            </div>

            {/* Character (placeholder) */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
                <div className="w-48 h-72 bg-gradient-to-b from-amber-400/80 to-amber-600/80 rounded-t-full flex items-center justify-center">
                    <span className="text-4xl">👤</span>
                </div>
            </div>

            {/* Text Box */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/90 to-transparent">
                <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    {/* Speaker */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className="px-4 py-1 bg-amber-600 rounded-full text-white text-sm font-bold">
                            {phase.speaker}
                        </div>
                    </div>

                    {/* Text */}
                    <p className="text-white text-lg leading-relaxed">
                        {phase.text}
                    </p>

                    {/* Click indicator */}
                    <div className="absolute bottom-2 right-4 text-slate-500 text-xs animate-pulse">
                        ▼ クリックで続ける
                    </div>
                </div>
            </div>
        </div>
    );
};
