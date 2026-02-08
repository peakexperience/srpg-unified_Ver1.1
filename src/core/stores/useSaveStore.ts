import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SaveData, SaveSlot, CharacterSaveState, PartyState } from '../types/saveData';

// ===================================
// Constants
// ===================================
const MAX_SLOTS = 3;
const STORAGE_KEY = 'srpg-save-data';

// ===================================
// Helper Functions
// ===================================
const generateSaveId = (): string => {
    return `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const createEmptySlot = (): SaveSlot => ({
    isEmpty: true,
    data: null,
});

const createDefaultSaveData = (slotIndex: number): SaveData => ({
    saveId: generateSaveId(),
    slotIndex,
    timestamp: new Date().toISOString(),
    playTimeSeconds: 0,
    chapter: 1,
    party: {
        members: [],
        maxSize: 4,
    },
    characters: {},
    inventory: {},
    flags: {},
});

// ===================================
// Store Interface
// ===================================
interface SaveStoreState {
    slots: SaveSlot[];
    currentSlotIndex: number | null;
    playStartTime: number | null;

    // Actions
    save: (slotIndex: number) => void;
    load: (slotIndex: number) => SaveData | null;
    deleteSlot: (slotIndex: number) => void;
    setCurrentSlot: (slotIndex: number | null) => void;

    // Game State Management
    startPlaySession: () => void;
    getPlayTime: () => number;
    updateCharacter: (characterId: string, state: Partial<CharacterSaveState>) => void;
    updateParty: (party: Partial<PartyState>) => void;
    setChapter: (chapter: number) => void;
    setFlag: (flagId: string, value: boolean) => void;
    addToInventory: (itemId: string, count: number) => void;

    // Current Game State (in-memory, not yet saved)
    currentGameState: SaveData | null;
    initNewGame: () => void;
}

// ===================================
// Store Implementation
// ===================================
export const useSaveStore = create<SaveStoreState>()(
    persist(
        (set, get) => ({
            slots: Array.from({ length: MAX_SLOTS }, () => createEmptySlot()),
            currentSlotIndex: null,
            playStartTime: null,
            currentGameState: null,

            // Save current game state to a slot
            save: (slotIndex: number) => {
                const { currentGameState, getPlayTime, slots } = get();
                if (!currentGameState) return;

                const updatedData: SaveData = {
                    ...currentGameState,
                    slotIndex,
                    timestamp: new Date().toISOString(),
                    playTimeSeconds: getPlayTime(),
                };

                const newSlots = [...slots];
                newSlots[slotIndex] = {
                    isEmpty: false,
                    data: updatedData,
                };

                set({
                    slots: newSlots,
                    currentSlotIndex: slotIndex,
                    currentGameState: updatedData,
                });
            },

            // Load game state from a slot
            load: (slotIndex: number) => {
                const { slots } = get();
                const slot = slots[slotIndex];

                if (slot.isEmpty || !slot.data) return null;

                set({
                    currentSlotIndex: slotIndex,
                    currentGameState: { ...slot.data },
                    playStartTime: Date.now(),
                });

                return slot.data;
            },

            // Delete a save slot
            deleteSlot: (slotIndex: number) => {
                const { slots } = get();
                const newSlots = [...slots];
                newSlots[slotIndex] = createEmptySlot();
                set({ slots: newSlots });
            },

            setCurrentSlot: (slotIndex: number | null) => {
                set({ currentSlotIndex: slotIndex });
            },

            // Start tracking play time
            startPlaySession: () => {
                set({ playStartTime: Date.now() });
            },

            // Get total play time in seconds
            getPlayTime: () => {
                const { currentGameState, playStartTime } = get();
                const baseTime = currentGameState?.playTimeSeconds || 0;
                const sessionTime = playStartTime
                    ? Math.floor((Date.now() - playStartTime) / 1000)
                    : 0;
                return baseTime + sessionTime;
            },

            // Update a character's state
            updateCharacter: (characterId: string, state: Partial<CharacterSaveState>) => {
                const { currentGameState } = get();
                if (!currentGameState) return;

                const existingState = currentGameState.characters[characterId] || {
                    level: 1,
                    exp: 0,
                    currentHp: 100,
                    currentMp: 50,
                    isRecruited: false,
                };

                set({
                    currentGameState: {
                        ...currentGameState,
                        characters: {
                            ...currentGameState.characters,
                            [characterId]: { ...existingState, ...state },
                        },
                    },
                });
            },

            // Update party composition
            updateParty: (party: Partial<PartyState>) => {
                const { currentGameState } = get();
                if (!currentGameState) return;

                set({
                    currentGameState: {
                        ...currentGameState,
                        party: { ...currentGameState.party, ...party },
                    },
                });
            },

            // Set current chapter
            setChapter: (chapter: number) => {
                const { currentGameState } = get();
                if (!currentGameState) return;
                set({
                    currentGameState: { ...currentGameState, chapter },
                });
            },

            // Set a game flag
            setFlag: (flagId: string, value: boolean) => {
                const { currentGameState } = get();
                if (!currentGameState) return;
                set({
                    currentGameState: {
                        ...currentGameState,
                        flags: { ...currentGameState.flags, [flagId]: value },
                    },
                });
            },

            // Add items to inventory
            addToInventory: (itemId: string, count: number) => {
                const { currentGameState } = get();
                if (!currentGameState) return;
                const currentCount = currentGameState.inventory[itemId] || 0;
                set({
                    currentGameState: {
                        ...currentGameState,
                        inventory: {
                            ...currentGameState.inventory,
                            [itemId]: Math.max(0, currentCount + count),
                        },
                    },
                });
            },

            // Initialize a new game
            initNewGame: () => {
                set({
                    currentGameState: createDefaultSaveData(0),
                    currentSlotIndex: null,
                    playStartTime: Date.now(),
                });
            },
        }),
        {
            name: STORAGE_KEY,
            partialize: (state) => ({
                slots: state.slots,
            }),
        }
    )
);
