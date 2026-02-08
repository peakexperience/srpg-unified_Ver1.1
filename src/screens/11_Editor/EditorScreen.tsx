import React from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import { CardEditor } from '@/components/features/CardEditor';
import { Settings } from 'lucide-react';

export const EditorScreen: React.FC = () => {
    const { setScreen } = useGameStore();

    return (
        <div className="w-full h-full bg-slate-950 flex flex-col">
            {/* Header */}
            <header className="h-14 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings size={20} className="text-emerald-400" />
                    カードエディタ
                </h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setScreen('TITLE')}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        ← タイトルへ
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-hidden">
                <CardEditor />
            </main>
        </div>
    );
};

