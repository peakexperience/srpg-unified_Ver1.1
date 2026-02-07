import React, { useState } from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import { useCardEditorStore } from '@/core/stores/useCardEditorStore';
import { Menu, Grid3X3, User, Sword, Shield } from 'lucide-react';

type Tab = 'characters' | 'abilities' | 'enemies';

export const CollectionScreen: React.FC = () => {
    const { setScreen } = useGameStore();
    const { database } = useCardEditorStore();
    const [activeTab, setActiveTab] = useState<Tab>('characters');

    const tabs = [
        { id: 'characters' as Tab, label: 'キャラクター', icon: User },
        { id: 'abilities' as Tab, label: 'アビリティ', icon: Sword },
        { id: 'enemies' as Tab, label: 'エネミー', icon: Shield },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'characters':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.values(database.characters).map((char) => (
                            <div key={char.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 transition-all">
                                <div className="w-full aspect-[3/4] bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg mb-3 flex items-center justify-center text-4xl">
                                    👤
                                </div>
                                <h3 className="text-white font-bold text-sm">{char.name}</h3>
                                <p className="text-slate-400 text-xs mt-1">{char.job}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {char.slots.abilityCardIds.map((abilId) => (
                                        <span key={abilId} className="text-[10px] px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded">
                                            {database.abilities[abilId]?.name ?? abilId}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'abilities':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.values(database.abilities).map((abil) => (
                            <div key={abil.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">✨</span>
                                    <h3 className="text-white font-bold text-sm">{abil.name}</h3>
                                </div>
                                <p className="text-slate-400 text-xs">{abil.description}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 text-purple-300 rounded">
                                        MP {abil.cost}
                                    </span>
                                    {abil.element && (
                                        <span className="text-[10px] px-2 py-0.5 bg-red-900/50 text-red-300 rounded">
                                            {abil.element}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'enemies':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.values(database.enemies).map((enemy) => (
                            <div key={enemy.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                <div className="w-full aspect-square bg-gradient-to-b from-purple-900/50 to-slate-800 rounded-lg mb-3 flex items-center justify-center text-4xl">
                                    👾
                                </div>
                                <h3 className="text-white font-bold text-sm">{enemy.name}</h3>
                                <p className="text-slate-500 text-xs mt-1">{enemy.description}</p>
                                <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
                                    <span className="text-red-400">HP: {enemy.stats.maxHp}</span>
                                    <span className="text-orange-400">ATK: {enemy.stats.atk}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full bg-slate-900 flex flex-col">
            {/* Header */}
            <header className="h-14 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between">
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                    <Grid3X3 size={20} className="text-amber-400" />
                    ライブラリ
                </h1>
                <button
                    onClick={() => setScreen('TITLE')}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                    ← タイトルへ
                </button>
            </header>

            {/* Tabs */}
            <nav className="h-12 bg-slate-900 border-b border-slate-800 px-6 flex items-center gap-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id
                                ? 'bg-amber-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Content */}
            <main className="flex-1 overflow-auto p-6">
                {renderContent()}
            </main>
        </div>
    );
};
