import { create } from 'zustand';
import type { ScreenType, ScenarioData, ProjectManifest } from '@/core/types';

// ===================================
// Game Store State Interface
// ===================================
interface GameState {
    // Current State
    currentScreen: ScreenType;
    currentProject: ProjectManifest | null;
    currentScenario: ScenarioData | null;
    currentPhaseIndex: number;

    // Player State
    playerStatus: {
        hp: number;
        maxHp: number;
        mp: number;
        maxMp: number;
    };

    // Game Flags
    flags: Record<string, unknown>;

    // Actions - Navigation
    setScreen: (screen: ScreenType) => void;
    nextPhase: () => void;

    // Actions - Project
    loadProject: (manifest: ProjectManifest, scenario: ScenarioData) => void;

    // Actions - Player
    updatePlayerStatus: (status: Partial<GameState['playerStatus']>) => void;

    // Actions - Flags
    setFlag: (key: string, value: unknown) => void;

    // Actions - Reset
    resetGame: () => void;
}

// ===================================
// Initial State
// ===================================
const initialState = {
    currentScreen: 'TITLE' as ScreenType,
    currentProject: null,
    currentScenario: null,
    currentPhaseIndex: 0,
    playerStatus: {
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
    },
    flags: {},
};

// ===================================
// Game Store
// ===================================
export const useGameStore = create<GameState>((set, get) => ({
    ...initialState,

    setScreen: (screen) => set({ currentScreen: screen }),

    nextPhase: () => {
        const state = get();
        const scenario = state.currentScenario;
        if (!scenario) return;

        const nextIndex = state.currentPhaseIndex + 1;
        if (nextIndex >= scenario.phases.length) {
            // End of scenario - return to title
            set({ currentScreen: 'TITLE', currentPhaseIndex: 0 });
            return;
        }

        const nextPhase = scenario.phases[nextIndex];
        set({
            currentPhaseIndex: nextIndex,
            currentScreen: nextPhase.type,
        });
    },

    loadProject: (manifest, scenario) => set({
        currentProject: manifest,
        currentScenario: scenario,
        currentPhaseIndex: 0,
        currentScreen: scenario.phases[0]?.type || 'NOVEL',
    }),

    updatePlayerStatus: (status) => set((state) => ({
        playerStatus: { ...state.playerStatus, ...status },
    })),

    setFlag: (key, value) => set((state) => ({
        flags: { ...state.flags, [key]: value },
    })),

    resetGame: () => set(initialState),
}));
