// ===================================
// Save Data Types
// ===================================

export interface CharacterSaveState {
    level: number;
    exp: number;
    currentHp: number;
    currentMp: number;
    isRecruited: boolean;
}

export interface PartyState {
    members: string[]; // characterId[]
    maxSize: number;
}

export interface SaveData {
    saveId: string;
    slotIndex: number;
    timestamp: string; // ISO8601
    playTimeSeconds: number;
    chapter: number;
    party: PartyState;
    characters: Record<string, CharacterSaveState>;
    inventory: Record<string, number>; // itemId: count
    flags: Record<string, boolean>;
}

export interface SaveSlot {
    isEmpty: boolean;
    data: SaveData | null;
}
