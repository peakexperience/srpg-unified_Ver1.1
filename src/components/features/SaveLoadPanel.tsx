import React, { useState } from 'react';
import { Save, Trash2, Play, Clock, Calendar, Users } from 'lucide-react';
import { useSaveStore } from '@/core/stores/useSaveStore';
import type { SaveSlot } from '@/core/types/saveData';

// ===================================
// Helper Functions
// ===================================
const formatPlayTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}時間${minutes}分`;
};

const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// ===================================
// SaveSlotCard Component
// ===================================
interface SaveSlotCardProps {
    slot: SaveSlot;
    index: number;
    mode: 'save' | 'load';
    onSave: (index: number) => void;
    onLoad: (index: number) => void;
    onDelete: (index: number) => void;
}

const SaveSlotCard: React.FC<SaveSlotCardProps> = ({
    slot,
    index,
    mode,
    onSave,
    onLoad,
    onDelete,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);

    if (slot.isEmpty || !slot.data) {
        return (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 border-dashed">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">スロット {index + 1} - 空き</p>
                    {mode === 'save' && (
                        <button
                            onClick={() => onSave(index)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors"
                        >
                            <Save size={16} />
                            ここにセーブ
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const { data } = slot;

    return (
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-white">スロット {index + 1}</h3>
                    <p className="text-sm text-amber-400">チャプター {data.chapter}</p>
                </div>
                <button
                    onClick={() => setShowConfirm(true)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
                    title="削除"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="space-y-2 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDate(data.timestamp)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{formatPlayTime(data.playTimeSeconds)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>パーティー: {data.party.members.length}/{data.party.maxSize}人</span>
                </div>
            </div>

            <div className="flex gap-2">
                {mode === 'load' && (
                    <button
                        onClick={() => onLoad(index)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <Play size={16} />
                        ロード
                    </button>
                )}
                {mode === 'save' && (
                    <button
                        onClick={() => onSave(index)}
                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <Save size={16} />
                        上書きセーブ
                    </button>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full mx-4 border border-slate-700">
                        <h4 className="text-lg font-bold text-white mb-2">削除確認</h4>
                        <p className="text-slate-400 mb-4">
                            スロット {index + 1} のセーブデータを削除しますか？
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            >
                                キャンセル
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(index);
                                    setShowConfirm(false);
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ===================================
// SaveLoadPanel Component
// ===================================
interface SaveLoadPanelProps {
    mode: 'save' | 'load';
    onComplete?: () => void;
}

export const SaveLoadPanel: React.FC<SaveLoadPanelProps> = ({ mode, onComplete }) => {
    const { slots, save, load, deleteSlot } = useSaveStore();

    const handleSave = (index: number) => {
        save(index);
        onComplete?.();
    };

    const handleLoad = (index: number) => {
        load(index);
        onComplete?.();
    };

    const handleDelete = (index: number) => {
        deleteSlot(index);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
                {mode === 'save' ? 'セーブ' : 'ロード'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {slots.map((slot, index) => (
                    <SaveSlotCard
                        key={index}
                        slot={slot}
                        index={index}
                        mode={mode}
                        onSave={handleSave}
                        onLoad={handleLoad}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};
