import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import { useViewMode } from '@/core/hooks/useViewMode';
import { ViewSwitcher } from '@/components/data-views/ViewSwitcher';
import { TableView, CHARACTER_COLUMNS, ENEMY_COLUMNS, NPC_COLUMNS, PLACE_COLUMNS, ITEM_COLUMNS, SOUND_COLUMNS, EVENT_COLUMNS, CG_COLUMNS } from '@/components/data-views/TableView';
import { GalleryView } from '@/components/data-views/GalleryView';
import { KanbanView } from '@/components/data-views/KanbanView';
import { DetailView } from '@/components/data-views/DetailView';
import { CardEditor } from '@/components/features/CardEditor';
import { SaveLoadPanel } from '@/components/features/SaveLoadPanel';
import { PartyView } from '@/components/features/PartyView';
import {
    Package, Sword, Sparkles, BookOpen, Library, Music, Settings,
    MapPin, User, Users, Skull, Box, Calendar, Image, Database,
    ArrowLeft, Save, Heart
} from 'lucide-react';

// ===================================
// Category Definitions
// ===================================
type PrimaryCategory = 'party' | 'item' | 'equipment' | 'skill' | 'story' | 'library' | 'sound' | 'studio';

interface SubCategoryDef {
    id: string;
    label: string;
    icon: React.ElementType;
}

const PRIMARY_CATEGORIES: { id: PrimaryCategory; label: string; icon: React.ElementType }[] = [
    { id: 'party', label: 'パーティー', icon: Heart },
    { id: 'item', label: 'アイテム', icon: Package },
    { id: 'equipment', label: '装備', icon: Sword },
    { id: 'skill', label: 'スキル', icon: Sparkles },
    { id: 'story', label: 'ストーリー', icon: BookOpen },
    { id: 'library', label: 'ライブラリ', icon: Library },
    { id: 'sound', label: '音', icon: Music },
    { id: 'studio', label: '工房', icon: Settings },
];

const SUB_CATEGORIES: Record<PrimaryCategory, SubCategoryDef[]> = {
    party: [
        { id: 'current', label: '現在のパーティー', icon: Users },
        { id: 'save', label: 'セーブ', icon: Save },
        { id: 'load', label: 'ロード', icon: Database },
    ],
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
        { id: 'event', label: 'イベント', icon: Calendar },
        { id: 'cg', label: 'CG', icon: Image },
        { id: 'sound_db', label: '音', icon: Music },
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
// Data Cache Type
// ===================================
interface DataCache {
    characters: Record<string, unknown>[];
    enemies: Record<string, unknown>[];
    npcs: Record<string, unknown>[];
    backgrounds: Record<string, unknown>[];
    items: Record<string, unknown>[];
    bgm: Record<string, unknown>[];
    se: Record<string, unknown>[];
    events: Record<string, unknown>[];
    gallery: Record<string, unknown>[];
}

// ===================================
// Collection Screen Component
// ===================================
export const CollectionScreen: React.FC = () => {
    const { setScreen } = useGameStore();
    const { viewMode, setViewMode } = useViewMode('list');

    const [primaryCategory, setPrimaryCategory] = useState<PrimaryCategory>('library');
    const [subCategory, setSubCategory] = useState<string>('character');
    const [dataCache, setDataCache] = useState<DataCache | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null);

    const currentSubCategories = SUB_CATEGORIES[primaryCategory];

    // Load all JSON data on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [characters, enemies, npcs, backgrounds, items, bgm, se, events, gallery] = await Promise.all([
                    fetch('/game-data/database/characters.json').then(r => r.json()),
                    fetch('/game-data/database/enemies.json').then(r => r.json()),
                    fetch('/game-data/database/npcs.json').then(r => r.json()),
                    fetch('/game-data/database/backgrounds.json').then(r => r.json()),
                    fetch('/game-data/database/items.json').then(r => r.json()),
                    fetch('/game-data/database/bgm.json').then(r => r.json()),
                    fetch('/game-data/database/se.json').then(r => r.json()),
                    fetch('/game-data/database/events.json').then(r => r.json()),
                    fetch('/game-data/database/gallery.json').then(r => r.json()),
                ]);
                setDataCache({
                    characters: characters.characters || [],
                    enemies: enemies.enemies || [],
                    npcs: npcs.npcs || [],
                    backgrounds: backgrounds.locations || [],
                    items: items.items || [],
                    bgm: bgm.bgm || [],
                    se: se.se || [],
                    events: events.events || [],
                    gallery: gallery.images || [],
                });
            } catch (error) {
                console.error('Failed to load data:', error);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    // Auto view switch based on tab
    useEffect(() => {
        if (subCategory === 'character') {
            if (viewMode === 'list') setViewMode('gallery');
        }
    }, [subCategory]);

    // Handle primary category change
    const handlePrimaryChange = (category: PrimaryCategory) => {
        setPrimaryCategory(category);
        setSelectedItem(null); // Reset selection
        const firstSub = SUB_CATEGORIES[category][0];
        if (firstSub) {
            setSubCategory(firstSub.id);
        }
    };

    // Handle sub category change
    const handleSubCategoryChange = (id: string) => {
        setSubCategory(id);
        setSelectedItem(null); // Reset selection
    }

    // Get current data based on tab
    const getData = (): Record<string, unknown>[] => {
        if (!dataCache) return [];

        if (primaryCategory === 'library') {
            switch (subCategory) {
                case 'character': return dataCache.characters;
                case 'enemy': return dataCache.enemies;
                case 'npc': return dataCache.npcs;
                case 'place': return dataCache.backgrounds;
                case 'item_dict': return dataCache.items;
                case 'event': return dataCache.events;
                case 'cg': return dataCache.gallery;
                case 'sound_db':
                    const bgmList = dataCache.bgm.map(item => ({ ...item, type: 'BGM' }));
                    const seList = dataCache.se.map(item => ({ ...item, type: 'SE' }));
                    return [...bgmList, ...seList];
                default: return [];
            }
        }
        return [];
    };

    // Get columns based on tab
    const getColumns = () => {
        switch (subCategory) {
            case 'character': return CHARACTER_COLUMNS;
            case 'enemy': return ENEMY_COLUMNS;
            case 'npc': return NPC_COLUMNS;
            case 'place': return PLACE_COLUMNS;
            case 'item_dict': return ITEM_COLUMNS;
            case 'event': return EVENT_COLUMNS;
            case 'cg': return CG_COLUMNS;
            case 'sound_db': return SOUND_COLUMNS;
            default: return [];
        }
    };

    const currentData = getData();
    const currentColumns = getColumns();

    // ===================================
    // Render
    // ===================================
    return (
        <div className="w-full h-full bg-slate-950 flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            {/* Primary Navigation */}
            <header className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center">
                <button
                    onClick={() => setScreen('TITLE')}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors mr-2"
                >
                    <ArrowLeft size={18} className="text-slate-400" />
                </button>

                <nav className="flex items-center gap-1 overflow-x-auto flex-1">
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

                {/* View Switcher */}
                {primaryCategory === 'library' && !selectedItem && (
                    <div className="ml-4">
                        <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
                    </div>
                )}
            </header>

            {/* Secondary Navigation */}
            <nav className="h-10 bg-slate-900/50 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto">
                {currentSubCategories.map((sub) => {
                    const Icon = sub.icon;
                    const isActive = subCategory === sub.id;
                    return (
                        <button
                            key={sub.id}
                            onClick={() => handleSubCategoryChange(sub.id)}
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
            <main className="flex-1 overflow-hidden bg-slate-950/50 relative">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-slate-500">読み込み中...</div>
                    </div>
                ) : primaryCategory === 'library' ? (
                    // Library Mode
                    selectedItem ? (
                        <div className="absolute inset-0 z-10 bg-slate-950">
                            <DetailView item={selectedItem} onBack={() => setSelectedItem(null)} />
                        </div>
                    ) : (
                        <>
                            {/* List View */}
                            {viewMode === 'list' && (
                                <TableView data={currentData} columns={currentColumns} onItemClick={setSelectedItem} />
                            )}

                            {/* Gallery View */}
                            {viewMode === 'gallery' && (
                                <GalleryView data={currentData} onItemClick={setSelectedItem} />
                            )}

                            {/* Kanban View */}
                            {viewMode === 'kanban' && (
                                <KanbanView data={currentData} onItemClick={setSelectedItem} />
                            )}

                            {/* Custom View - placeholder for now */}
                            {viewMode === 'custom' && (
                                <div className="flex items-center justify-center h-full text-slate-500">
                                    <div className="text-center">
                                        <p className="text-lg font-medium">詳細表示</p>
                                        <p className="text-sm mt-2">カスタムビューは今後実装予定</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )
                ) : primaryCategory === 'studio' && subCategory === 'card_editor' ? (
                    // Editor Mode
                    <div className="w-full h-full">
                        <CardEditor />
                    </div>
                ) : primaryCategory === 'party' ? (
                    // Party Mode
                    <div className="w-full h-full overflow-auto">
                        {subCategory === 'current' && <PartyView />}
                        {subCategory === 'save' && <SaveLoadPanel mode="save" />}
                        {subCategory === 'load' && <SaveLoadPanel mode="load" />}
                    </div>
                ) : (
                    /* Other tabs - placeholder */
                    <div className="flex items-center justify-center h-full text-slate-500">
                        <div className="text-center">
                            <Database size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">{primaryCategory} / {subCategory}</p>
                            <p className="text-sm mt-2">このカテゴリは今後実装予定です</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer - Stats Bar */}
            <footer className="h-6 bg-slate-950 border-t border-slate-800 px-4 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase">
                <span>Category: {primaryCategory}/{subCategory}</span>
                <span>View: {selectedItem ? 'Detail' : viewMode}</span>
                <span>Items: {currentData.length}</span>
            </footer>
        </div>
    );
};
