import { create } from 'zustand';
import type { GameDatabase, CharacterCard, StatusCard, AbilityCard, EnemyCard, CardType } from '@/core/types';

// ===================================
// Initial Database (Demo Data)
// ===================================
const INITIAL_DATABASE: GameDatabase = {
    characters: {
        'char-1': {
            id: 'char-1',
            name: 'アーサー',
            type: 'CHARACTER' as CardType.CHARACTER,
            job: 'パラディン',
            description: '聖剣を求める高潔な騎士。',
            image: '/game-data/assets/characters/char-1.svg',
            slots: {
                statusCardId: 'stat-hero',
                abilityCardIds: ['abil-slash', 'abil-heal'],
                stateCardIds: [],
            },
        },
        'char-2': {
            id: 'char-2',
            name: 'モルガナ',
            type: 'CHARACTER' as CardType.CHARACTER,
            job: '魔女',
            description: '闇の魔術を操る謎の女性。',
            image: '/game-data/assets/characters/char-2.svg',
            slots: {
                statusCardId: 'stat-mage',
                abilityCardIds: ['abil-fireball'],
                stateCardIds: [],
            },
        },
    },
    statuses: {
        'stat-hero': {
            id: 'stat-hero',
            name: '英雄の血統',
            type: 'STATUS' as CardType.STATUS,
            description: 'バランスの取れた成長を促す。',
            values: { hp: 100, mp: 20, str: 15, def: 12, spd: 10 },
        },
        'stat-mage': {
            id: 'stat-mage',
            name: '神秘の輝き',
            type: 'STATUS' as CardType.STATUS,
            description: '高い魔力だが体は脆い。',
            values: { hp: 50, mp: 100, str: 5, def: 5, spd: 12 },
        },
    },
    abilities: {
        'abil-slash': {
            id: 'abil-slash',
            name: '聖剣斬り',
            type: 'ABILITY' as CardType.ABILITY,
            description: '強力な縦斬り。',
            effectId: 'fx_slash_heavy',
            cost: 5,
            element: '聖',
        },
        'abil-heal': {
            id: 'abil-heal',
            name: '小回復',
            type: 'ABILITY' as CardType.ABILITY,
            description: 'HPを少量回復する。',
            effectId: 'fx_heal_light',
            cost: 8,
            element: '光',
        },
        'abil-fireball': {
            id: 'abil-fireball',
            name: '業火の玉',
            type: 'ABILITY' as CardType.ABILITY,
            description: '炎の球を発射する。',
            effectId: 'fx_fire_projectile',
            cost: 12,
            element: '火',
        },
    },
    enemies: {
        'enemy-slime-01': {
            id: 'enemy-slime-01',
            name: 'スライム',
            type: 'ENEMY' as CardType.ENEMY,
            description: '森に生息する小さなモンスター。',
            image: '/game-data/assets/characters/enemy-slime.svg',
            stats: { hp: 30, maxHp: 30, atk: 5, def: 2 },
            drops: { exp: 10, gold: 5 },
        },
    },
};

// ===================================
// Card Editor Store Interface
// ===================================
interface CardEditorState {
    database: GameDatabase;
    activeCharacterId: string | null;
    draggedCardType: CardType | null;

    // Actions
    setActiveCharacter: (id: string | null) => void;
    setDraggedCardType: (type: CardType | null) => void;
    equipStatus: (charId: string, statusId: string) => void;
    equipAbility: (charId: string, abilityId: string) => void;
    unequipAbility: (charId: string, abilityId: string) => void;
    exportJson: () => string;
    importJson: (json: string) => void;

    // CRUD
    updateCharacter: (char: CharacterCard) => void;
    addCharacter: (char: CharacterCard) => void;
    addStatusCard: (card: StatusCard) => void;
    addAbilityCard: (card: AbilityCard) => void;
    addEnemyCard: (card: EnemyCard) => void;
}

// ===================================
// Card Editor Store
// ===================================
export const useCardEditorStore = create<CardEditorState>((set, get) => ({
    database: INITIAL_DATABASE,
    activeCharacterId: 'char-1',
    draggedCardType: null,

    setActiveCharacter: (id) => set({ activeCharacterId: id }),
    setDraggedCardType: (type) => set({ draggedCardType: type }),

    equipStatus: (charId, statusId) =>
        set((state) => {
            const char = state.database.characters[charId];
            if (!char) return state;
            return {
                database: {
                    ...state.database,
                    characters: {
                        ...state.database.characters,
                        [charId]: {
                            ...char,
                            slots: { ...char.slots, statusCardId: statusId },
                        },
                    },
                },
            };
        }),

    equipAbility: (charId, abilityId) =>
        set((state) => {
            const char = state.database.characters[charId];
            if (!char) return state;
            if (char.slots.abilityCardIds.includes(abilityId)) return state;
            if (char.slots.abilityCardIds.length >= 4) return state;
            return {
                database: {
                    ...state.database,
                    characters: {
                        ...state.database.characters,
                        [charId]: {
                            ...char,
                            slots: {
                                ...char.slots,
                                abilityCardIds: [...char.slots.abilityCardIds, abilityId],
                            },
                        },
                    },
                },
            };
        }),

    unequipAbility: (charId, abilityId) =>
        set((state) => {
            const char = state.database.characters[charId];
            if (!char) return state;
            return {
                database: {
                    ...state.database,
                    characters: {
                        ...state.database.characters,
                        [charId]: {
                            ...char,
                            slots: {
                                ...char.slots,
                                abilityCardIds: char.slots.abilityCardIds.filter(
                                    (id) => id !== abilityId
                                ),
                            },
                        },
                    },
                },
            };
        }),

    exportJson: () => JSON.stringify(get().database, null, 2),

    importJson: (json) => {
        try {
            const parsed = JSON.parse(json);
            set({ database: parsed });
        } catch (e) {
            console.error('Failed to import JSON', e);
        }
    },

    updateCharacter: (char) =>
        set((state) => ({
            database: {
                ...state.database,
                characters: { ...state.database.characters, [char.id]: char },
            },
        })),

    addCharacter: (char) =>
        set((state) => ({
            database: {
                ...state.database,
                characters: { ...state.database.characters, [char.id]: char },
            },
        })),

    addStatusCard: (card) =>
        set((state) => ({
            database: {
                ...state.database,
                statuses: { ...state.database.statuses, [card.id]: card },
            },
        })),

    addAbilityCard: (card) =>
        set((state) => ({
            database: {
                ...state.database,
                abilities: { ...state.database.abilities, [card.id]: card },
            },
        })),

    addEnemyCard: (card) =>
        set((state) => ({
            database: {
                ...state.database,
                enemies: { ...state.database.enemies, [card.id]: card },
            },
        })),
}));
