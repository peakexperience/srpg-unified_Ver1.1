import React, { useState } from 'react';
import { useCardEditorStore } from '@/core/stores/useCardEditorStore';
import { Copy, Upload, Settings } from 'lucide-react';

type EditorTab = 'cards' | 'json';

export const CardEditor: React.FC = () => {
    const { database, activeCharacterId, setActiveCharacter, exportJson, importJson } = useCardEditorStore();
    const [editorTab, setEditorTab] = useState<EditorTab>('cards');
    const [jsonInput, setJsonInput] = useState('');

    const activeCharacter = activeCharacterId ? database.characters[activeCharacterId] : null;

    const handleCopyJson = () => {
        navigator.clipboard.writeText(exportJson());
        alert('JSONをクリップボードにコピーしました！');
    };

    const handleImportJson = () => {
        try {
            importJson(jsonInput);
            alert('JSONをインポートしました！');
        } catch {
            alert('JSONのインポートに失敗しました');
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950">
            {/* Header - Tab Switcher */}
            <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                    <Settings size={18} />
                    <span className="text-sm font-bold">カードエディタ</span>
                </div>
                <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                    {(['cards', 'json'] as EditorTab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setEditorTab(tab)}
                            className={`px-3 py-1 text-xs font-bold uppercase rounded transition-all ${editorTab === tab
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            {tab === 'cards' ? 'カード編集' : 'JSON出力'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
                {editorTab === 'cards' ? (
                    <>
                        {/* Character List */}
                        <aside className="w-48 bg-slate-900/50 border-r border-slate-800 p-4 overflow-auto">
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                キャラクター
                            </h2>
                            <div className="space-y-2">
                                {Object.values(database.characters).map((char) => (
                                    <button
                                        key={char.id}
                                        onClick={() => setActiveCharacter(char.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeCharacterId === char.id
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                    >
                                        {char.name}
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* Character Detail */}
                        <section className="flex-1 p-6 overflow-auto">
                            {activeCharacter ? (
                                <div className="max-w-2xl">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="w-32 h-40 bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl flex items-center justify-center text-5xl border border-slate-700">
                                            👤
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{activeCharacter.name}</h2>
                                            <p className="text-emerald-400 font-medium">{activeCharacter.job}</p>
                                            <p className="text-slate-400 text-sm mt-2">{activeCharacter.description}</p>
                                        </div>
                                    </div>

                                    {/* Equipped Status */}
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                                            装備ステータス
                                        </h3>
                                        {activeCharacter.slots.statusCardId ? (
                                            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                                <p className="text-white font-bold">
                                                    {database.statuses[activeCharacter.slots.statusCardId]?.name}
                                                </p>
                                                <div className="grid grid-cols-5 gap-2 mt-3 text-sm">
                                                    {Object.entries(database.statuses[activeCharacter.slots.statusCardId]?.values ?? {}).map(([key, val]) => (
                                                        <div key={key} className="text-center">
                                                            <p className="text-slate-500 text-xs uppercase">{key}</p>
                                                            <p className="text-white font-bold">{val}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-500">未装備</p>
                                        )}
                                    </div>

                                    {/* Equipped Abilities */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                                            装備アビリティ ({activeCharacter.slots.abilityCardIds.length}/4)
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {activeCharacter.slots.abilityCardIds.map((abilId) => {
                                                const abil = database.abilities[abilId];
                                                return (
                                                    <div key={abilId} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                                        <p className="text-white font-bold text-sm">{abil?.name ?? abilId}</p>
                                                        <p className="text-slate-400 text-xs mt-1">{abil?.description}</p>
                                                    </div>
                                                );
                                            })}
                                            {Array.from({ length: 4 - activeCharacter.slots.abilityCardIds.length }).map((_, i) => (
                                                <div key={i} className="bg-slate-900/50 rounded-lg p-3 border border-dashed border-slate-700 flex items-center justify-center">
                                                    <p className="text-slate-600 text-sm">空きスロット</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-slate-500">キャラクターを選択してください</p>
                            )}
                        </section>
                    </>
                ) : (
                    /* JSON Tab */
                    <div className="flex-1 flex flex-col p-6">
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={handleCopyJson}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-sm"
                            >
                                <Copy size={16} />
                                JSONをコピー
                            </button>
                            <button
                                onClick={handleImportJson}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm"
                            >
                                <Upload size={16} />
                                インポート
                            </button>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <h3 className="text-sm font-bold text-slate-500 mb-2">現在のデータベース</h3>
                                <pre className="flex-1 bg-slate-900 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-auto border border-slate-800">
                                    {exportJson()}
                                </pre>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-sm font-bold text-slate-500 mb-2">インポートするJSON</h3>
                                <textarea
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder="JSONをペースト..."
                                    className="flex-1 bg-slate-900 p-4 rounded-xl text-white font-mono text-xs border border-slate-800 resize-none focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
