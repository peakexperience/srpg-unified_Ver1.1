import React from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import type { ResultPhase } from '@/core/types';

export const ResultScreen: React.FC = () => {
    const { currentScenario, currentPhaseIndex, nextPhase, resetGame } = useGameStore();

    const phase = currentScenario?.phases[currentPhaseIndex] as ResultPhase | undefined;

    if (!phase || phase.type !== 'RESULT') {
        return null;
    }

    const handleContinue = () => {
        nextPhase();
    };

    const handleTitle = () => {
        resetGame();
    };

    return (
        <div className="w-full h-full bg-gradient-to-b from-amber-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center">
            {/* Victory text */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-4">
                    🏆 勝利！
                </h1>
                <p className="text-slate-400">バトルに勝利しました</p>
            </div>

            {/* Rewards */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 mb-8 w-80">
                <h2 className="text-lg font-bold text-amber-400 mb-6 text-center">獲得報酬</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">⭐</span>
                            <span className="text-slate-300">経験値</span>
                        </div>
                        <span className="text-xl font-bold text-green-400">+{phase.rewards.exp}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">💰</span>
                            <span className="text-slate-300">ゴールド</span>
                        </div>
                        <span className="text-xl font-bold text-yellow-400">+{phase.rewards.gold}</span>
                    </div>

                    {phase.rewards.items && phase.rewards.items.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📦</span>
                                <span className="text-slate-300">アイテム</span>
                            </div>
                            <span className="text-sm text-purple-400">{phase.rewards.items.join(', ')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleContinue}
                    className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg transition-all hover:scale-105"
                >
                    ▶ 続ける
                </button>
                <button
                    onClick={handleTitle}
                    className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg border border-slate-600 transition-all"
                >
                    タイトルへ
                </button>
            </div>
        </div>
    );
};
