// ===================================
// Screen & Phase Types
// ===================================
export type ScreenType =
    | 'TITLE'
    | 'NOVEL'
    | 'BATTLE'
    | 'RESULT'
    | 'COLLECTION'
    | 'EDITOR';

// ===================================
// Card Types
// ===================================
export enum CardType {
    CHARACTER = 'CHARACTER',
    STATUS = 'STATUS',
    ABILITY = 'ABILITY',
    STATE = 'STATE',
    ENEMY = 'ENEMY',
}

export interface CardBase {
    id: string;
    name: string;
    type: CardType;
    description: string;
    image?: string;
}

export interface CharacterCard extends CardBase {
    type: CardType.CHARACTER;
    job: string;
    slots: {
        statusCardId: string | null;
        abilityCardIds: string[];
        stateCardIds: string[];
    };
}

export interface StatusCard extends CardBase {
    type: CardType.STATUS;
    values: {
        hp: number;
        mp: number;
        str: number;
        def: number;
        spd: number;
    };
}

export interface AbilityCard extends CardBase {
    type: CardType.ABILITY;
    effectId: string;
    cost: number;
    element?: string;
}

export interface EnemyCard extends CardBase {
    type: CardType.ENEMY;
    stats: {
        hp: number;
        maxHp: number;
        atk: number;
        def: number;
    };
    drops?: {
        exp: number;
        gold: number;
        items?: string[];
    };
}

// ===================================
// Database Types
// ===================================
export interface GameDatabase {
    characters: Record<string, CharacterCard>;
    statuses: Record<string, StatusCard>;
    abilities: Record<string, AbilityCard>;
    enemies: Record<string, EnemyCard>;
}

// ===================================
// Scenario Types
// ===================================
export interface ScenarioPhase {
    type: 'NOVEL' | 'BATTLE' | 'RESULT';
}

export interface NovelPhase extends ScenarioPhase {
    type: 'NOVEL';
    speaker: string;
    text: string;
    backgroundId?: string;
}

export interface BattlePhase extends ScenarioPhase {
    type: 'BATTLE';
    enemyId: string;
    heroIds: string[];
    backgroundId?: string;
}

export interface ResultPhase extends ScenarioPhase {
    type: 'RESULT';
    rewards: {
        exp: number;
        gold: number;
        items?: string[];
    };
}

export interface ScenarioData {
    id: string;
    title: string;
    phases: (NovelPhase | BattlePhase | ResultPhase)[];
}

// ===================================
// Project Manifest Types
// ===================================
export interface ProjectManifest {
    id: string;
    name: string;
    version: string;
    entryScenario: string;
    defaultCharacters: string[];
    settings: {
        difficulty: 'easy' | 'normal' | 'hard';
        enableBGM: boolean;
    };
}

// ===================================
// View Mode Types (for Collection)
// ===================================
export type ViewMode = 'list' | 'gallery' | 'kanban' | 'custom';
