import React from 'react';
import { Users, Heart, Zap, Star } from 'lucide-react';
import { useSaveStore } from '@/core/stores/useSaveStore';

// ===================================
// PartyView Component
// ===================================

interface PartyViewProps {
    onMemberClick?: (characterId: string) => void;
}

export const PartyView: React.FC<PartyViewProps> = ({ onMemberClick }) => {
    const { currentGameState } = useSaveStore();

    if (!currentGameState) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">ゲームデータがありません</p>
                    <p className="text-sm mt-2">ニューゲームを開始するか、セーブデータをロードしてください</p>
                </div>
            </div>
        );
    }

    const { party, characters } = currentGameState;

    // Create empty slots for visual display
    const partySlots = Array.from({ length: party.maxSize }, (_, i) => ({
        index: i,
        memberId: party.members[i] || null,
    }));

    return (
        <div className="p-6">
            {/* Party Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users size={24} className="text-amber-400" />
                    パーティー
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    {party.members.length} / {party.maxSize} 人
                </p>
            </div>

            {/* Party Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {partySlots.map(({ index, memberId }) => {
                    if (!memberId) {
                        return (
                            <div
                                key={`empty-${index}`}
                                className="bg-slate-800/30 rounded-xl p-6 border-2 border-dashed border-slate-700 flex items-center justify-center min-h-[200px]"
                            >
                                <div className="text-center text-slate-600">
                                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">空きスロット</p>
                                </div>
                            </div>
                        );
                    }

                    const charState = characters[memberId];
                    if (!charState) return null;

                    return (
                        <div
                            key={memberId}
                            onClick={() => onMemberClick?.(memberId)}
                            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer group"
                        >
                            {/* Character Avatar Placeholder */}
                            <div className="w-full aspect-square bg-slate-700 rounded-lg mb-4 flex items-center justify-center text-4xl group-hover:bg-slate-600 transition-colors">
                                👤
                            </div>

                            {/* Character Name */}
                            <h3 className="text-white font-bold text-lg mb-2">{memberId}</h3>

                            {/* Level */}
                            <div className="flex items-center gap-2 text-amber-400 mb-3">
                                <Star size={14} />
                                <span className="text-sm font-bold">Lv.{charState.level}</span>
                            </div>

                            {/* Stats */}
                            <div className="space-y-2">
                                {/* HP Bar */}
                                <div>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-red-400 flex items-center gap-1">
                                            <Heart size={12} /> HP
                                        </span>
                                        <span className="text-slate-400">{charState.currentHp}</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-red-500 to-red-400"
                                            style={{ width: `${Math.min(100, charState.currentHp)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* MP Bar */}
                                <div>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-blue-400 flex items-center gap-1">
                                            <Zap size={12} /> MP
                                        </span>
                                        <span className="text-slate-400">{charState.currentMp}</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                                            style={{ width: `${Math.min(100, charState.currentMp)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Game Progress Info */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-bold mb-3">ゲーム進行状況</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500">チャプター</p>
                        <p className="text-white font-bold">{currentGameState.chapter}</p>
                    </div>
                    <div>
                        <p className="text-slate-500">プレイ時間</p>
                        <p className="text-white font-bold">
                            {Math.floor(currentGameState.playTimeSeconds / 3600)}時間
                            {Math.floor((currentGameState.playTimeSeconds % 3600) / 60)}分
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500">仲間数</p>
                        <p className="text-white font-bold">
                            {Object.values(characters).filter(c => c.isRecruited).length}人
                        </p>
                    </div>
                    <div>
                        <p className="text-slate-500">アイテム</p>
                        <p className="text-white font-bold">
                            {Object.keys(currentGameState.inventory).length}種類
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
