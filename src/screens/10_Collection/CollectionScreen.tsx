import React, { useState } from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import { useCardEditorStore } from '@/core/stores/useCardEditorStore';
import {
    Package, Sword, Sparkles, BookOpen, Library, Music, Settings,
    MapPin, User, Users, Skull, Box, Calendar, Image, Database,
    ArrowLeft
} from 'lucide-react';

// ===================================
// Category Definitions
// ===================================
type PrimaryCategory = 'item' | 'equipment' | 'skill' | 'story' | 'library' | 'sound' | 'studio';

interface SubCategoryDef {
    id: string;
    label: string;
    icon: React.ElementType;
}

const PRIMARY_CATEGORIES: { id: PrimaryCategory; label: string; icon: React.ElementType }[] = [
    { id: 'item', label: 'アイテム', icon: Package },
    { id: 'equipment', label: '装備', icon: Sword },
    { id: 'skill', label: 'スキル', icon: Sparkles },
    { id: 'story', label: 'ストーリー', icon: BookOpen },
    { id: 'library', label: 'ライブラリ', icon: Library },
    { id: 'sound', label: '音', icon: Music },
    { id: 'studio', label: '工房', icon: Settings },
];

const SUB_CATEGORIES: Record<PrimaryCategory, SubCategoryDef[]> = {
    item: [
        { id: 'consumable', label: '消費', icon: Package },
        { id: 'material', label: '素材', icon: Box },
        { id: 'key_item', label: '大事なもの', icon: Database },
    ],
    equipment: [
        { id: 'weapon', label: '武器', icon: Sword },
        { id: 'armor', label: '防具', icon: Sword },
        { id: 'accessory', label: 'アクセサリ', icon: Sparkles },
    ],
    skill: [
        { id: 'ability', label: 'アビリティ', icon: Sparkles },
        { id: 'magic', label: '魔法', icon: Sparkles },
        { id: 'special', label: '必殺技', icon: Sword },
    ],
    story: [
        { id: 'chapter', label: 'チャプター', icon: BookOpen },
        { id: 'event', label: 'イベント', icon: Calendar },
        { id: 'ending', label: 'エンディング', icon: BookOpen },
    ],
    library: [
        { id: 'place', label: '地名', icon: MapPin },
        { id: 'character', label: 'キャラ', icon: User },
        { id: 'npc', label: 'NPC', icon: Users },
        { id: 'enemy', label: 'エネミー', icon: Skull },
        { id: 'item_dict', label: 'アイテム', icon: Package },
        { id: 'event_dict', label: 'イベント', icon: Calendar },
        { id: 'cg', label: 'CG', icon: Image },
        { id: 'sound_dict', label: '音', icon: Music },
    ],
    sound: [
        { id: 'bgm', label: 'BGM', icon: Music },
        { id: 'se', label: 'SE', icon: Music },
        { id: 'voice', label: 'ボイス', icon: User },
    ],
    studio: [
        { id: 'card_editor', label: 'カード編集', icon: Settings },
        { id: 'json_view', label: 'JSON表示', icon: Database },
        { id: 'debug', label: 'デバッグ', icon: Settings },
    ],
};

// ===================================
// Collection Screen Component
// ===================================
export const CollectionScreen: React.FC = () => {
    const { setScreen } = useGameStore();
    const { database } = useCardEditorStore();

    const [primaryCategory, setPrimaryCategory] = useState<PrimaryCategory>('library');
    const [subCategory, setSubCategory] = useState<string>('character');

    const currentSubCategories = SUB_CATEGORIES[primaryCategory];

    // Handle primary category change
    const handlePrimaryChange = (category: PrimaryCategory) => {
        setPrimaryCategory(category);
        // Reset to first sub category
        const firstSub = SUB_CATEGORIES[category][0];
        if (firstSub) {
            setSubCategory(firstSub.id);
        }
    };

    // ===================================
    // Content Renderers
    // ===================================
    const renderContent = () => {
        // Library category contents
        if (primaryCategory === 'library') {
            switch (subCategory) {
                case 'character':
                    return renderCharacters();
                case 'enemy':
                    return renderEnemies();
                case 'place':
                    return renderPlaceholder('地名データ');
                case 'npc':
                    return renderPlaceholder('NPCデータ');
                case 'item_dict':
                    return renderPlaceholder('アイテム辞典');
                case 'event_dict':
                    return renderPlaceholder('イベント辞典');
                case 'cg':
                    return renderPlaceholder('CGギャラリー');
                case 'sound_dict':
                    return renderPlaceholder('サウンド一覧');
                default:
                    return renderPlaceholder('データなし');
            }
        }

        // Skill category
        if (primaryCategory === 'skill') {
            switch (subCategory) {
                case 'ability':
                    return renderAbilities();
                default:
                    return renderPlaceholder(`${subCategory} データ`);
            }
        }

        // Studio category
        if (primaryCategory === 'studio') {
            switch (subCategory) {
                case 'json_view':
                    return renderJsonView();
                default:
                    return renderPlaceholder(`${subCategory} 機能`);
            }
        }

        // Default placeholder for other categories
        return renderPlaceholder(`${primaryCategory}/${subCategory}`);
    };

    const renderPlaceholder = (label: string) => (
        <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Database size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">{label}</p>
            <p className="text-sm mt-2">データが登録されていません</p>
        </div>
    );

    const renderCharacters = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {Object.values(database.characters).map((char) => (
                <div
                    key={char.id}
                    className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 transition-all cursor-pointer group"
                >
                    <div className="w-full aspect-[3/4] bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg mb-3 flex items-center justify-center text-4xl group-hover:from-slate-600 group-hover:to-slate-700 transition-all">
                        👤
                    </div>
                    <h3 className="text-white font-bold text-sm truncate">{char.name}</h3>
                    <p className="text-amber-400 text-xs mt-1">{char.job}</p>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{char.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {char.slots.abilityCardIds.slice(0, 2).map((abilId) => (
                            <span key={abilId} className="text-[10px] px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded">
                                {database.abilities[abilId]?.name ?? abilId}
                            </span>
                        ))}
                        {char.slots.abilityCardIds.length > 2 && (
                            <span className="text-[10px] px-2 py-0.5 bg-slate-700 text-slate-400 rounded">
                                +{char.slots.abilityCardIds.length - 2}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderEnemies = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {Object.values(database.enemies).map((enemy) => (
                <div
                    key={enemy.id}
                    className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 hover:border-red-500/50 hover:bg-slate-800 transition-all cursor-pointer"
                >
                    <div className="w-full aspect-square bg-gradient-to-b from-purple-900/50 to-slate-800 rounded-lg mb-3 flex items-center justify-center text-4xl">
                        👾
                    </div>
                    <h3 className="text-white font-bold text-sm">{enemy.name}</h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{enemy.description}</p>
                    <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
                        <span className="text-red-400">HP: {enemy.stats.maxHp}</span>
                        <span className="text-orange-400">ATK: {enemy.stats.atk}</span>
                        <span className="text-blue-400">DEF: {enemy.stats.def}</span>
                        <span className="text-green-400">EXP: {enemy.drops?.exp ?? 0}</span>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderAbilities = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
            {Object.values(database.abilities).map((abil) => (
                <div
                    key={abil.id}
                    className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✨</span>
                        <h3 className="text-white font-bold text-sm">{abil.name}</h3>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2">{abil.description}</p>
                    <div className="flex gap-2 mt-3">
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

    const renderJsonView = () => {
        const { exportJson } = useCardEditorStore.getState();
        return (
            <div className="p-4 h-full">
                <pre className="h-full bg-slate-900 p-4 rounded-xl text-emerald-400 font-mono text-xs overflow-auto border border-slate-800">
                    {exportJson()}
                </pre>
            </div>
        );
    };

    // ===================================
    // Render
    // ===================================
    return (
        <div className="w-full h-full bg-slate-950 flex flex-col">
            {/* Primary Navigation */}
            <header className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center">
                <button
                    onClick={() => setScreen('TITLE')}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors mr-2"
                >
                    <ArrowLeft size={18} className="text-slate-400" />
                </button>

                <nav className="flex items-center gap-1 overflow-x-auto">
                    {PRIMARY_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = primaryCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handlePrimaryChange(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${isActive
                                        ? 'bg-amber-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <Icon size={16} />
                                {cat.label}
                            </button>
                        );
                    })}
                </nav>
            </header>

            {/* Secondary Navigation */}
            <nav className="h-10 bg-slate-900/50 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto">
                {currentSubCategories.map((sub) => {
                    const Icon = sub.icon;
                    const isActive = subCategory === sub.id;
                    return (
                        <button
                            key={sub.id}
                            onClick={() => setSubCategory(sub.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${isActive
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                }`}
                        >
                            <Icon size={14} />
                            {sub.label}
                        </button>
                    );
                })}
            </nav>

            {/* Content Area */}
            <main className="flex-1 overflow-auto bg-slate-950/50">
                {renderContent()}
            </main>

            {/* Footer - Stats Bar */}
            <footer className="h-6 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase">
                <span>Category: {primaryCategory}/{subCategory}</span>
                <span>Characters: {Object.keys(database.characters).length}</span>
                <span>Abilities: {Object.keys(database.abilities).length}</span>
                <span>Enemies: {Object.keys(database.enemies).length}</span>
            </footer>
        </div>
    );
};
