import React from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import type { ScenarioData, NovelPhase, BattlePhase, ResultPhase } from '@/core/types';

// デモ用シナリオデータ
const DEMO_SCENARIO: ScenarioData = {
    id: 'demo-chapter-01',
    title: '第1章：始まりの森',
    phases: [
        {
            type: 'NOVEL',
            speaker: 'レミ',
            text: 'ここは...どこなの？不思議な森に迷い込んでしまったわ。',
            backgroundId: 'bg-forest-01',
        } as NovelPhase,
        {
            type: 'BATTLE',
            enemyId: 'enemy-slime-01',
            heroIds: ['char-1'],
        } as BattlePhase,
        {
            type: 'RESULT',
            rewards: { exp: 100, gold: 50 },
        } as ResultPhase,
    ],
};

const DEMO_MANIFEST = {
    id: 'demo-project',
    name: 'デモプロジェクト',
    version: '1.0.0',
    entryScenario: 'demo-chapter-01',
    defaultCharacters: ['char-1'],
    settings: {
        difficulty: 'normal' as const,
        enableBGM: true,
    },
};

export const TitleScreen: React.FC = () => {
    const { setScreen, loadProject } = useGameStore();

    const handleStart = () => {
        loadProject(DEMO_MANIFEST, DEMO_SCENARIO);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            {/* Title */}
            <div className="relative z-10 text-center mb-12">
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 mb-4 tracking-wider">
                    SRPG Creator Kit
                </h1>
                <p className="text-slate-400 text-sm tracking-widest uppercase">
                    JSON-Driven Game Framework
                </p>
            </div>

            {/* Menu */}
            <div className="relative z-10 flex flex-col gap-4 w-64">
                <button
                    onClick={handleStart}
                    className="py-4 px-8 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-amber-900/50 transition-all hover:scale-105 hover:shadow-xl"
                >
                    ▶ ゲーム開始
                </button>

                <button
                    onClick={() => setScreen('COLLECTION')}
                    className="py-3 px-8 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-700 transition-all hover:border-slate-500"
                >
                    📚 ライブラリ
                </button>

                <button
                    onClick={() => setScreen('EDITOR')}
                    className="py-3 px-8 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg border border-slate-700 transition-all hover:border-slate-500"
                >
                    🔧 エディタ
                </button>
            </div>

            {/* Version */}
            <div className="absolute bottom-4 right-4 text-slate-600 text-xs font-mono">
                v1.0.0
            </div>
        </div>
    );
};
