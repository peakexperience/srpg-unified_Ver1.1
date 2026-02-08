import React from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import type { BattlePhase } from '@/core/types';
import { RPGBattleScreen } from './10_BattleMode_RPG/RPGBattleScreen';
import { SRPGBattleScreen, type SRPGBattleConfig } from './20_BattleMode_SRPG/SRPGBattleScreen';

// ===================================
// Battle Mode Type
// ===================================
export type BattleMode = 'RPG' | 'SRPG';

// ===================================
// Battle Screen Router
// ===================================
export const BattleScreen: React.FC = () => {
    const { currentScenario, currentPhaseIndex, nextPhase } = useGameStore();
    const phase = currentScenario?.phases[currentPhaseIndex] as BattlePhase | undefined;

    if (!phase || phase.type !== 'BATTLE') {
        return null;
    }

    // Determine battle mode from phase config (default: SRPG for development)
    const battleMode: BattleMode = (phase as BattlePhase & { battleMode?: BattleMode }).battleMode ?? 'SRPG';

    console.log('[BattleScreen] Mode:', battleMode, '| Phase:', phase);

    const handleWin = () => {
        nextPhase();
    };

    // SRPG Mode
    if (battleMode === 'SRPG') {
        // Create SRPG config from phase data
        const srpgConfig: SRPGBattleConfig = {
            enemyName: 'Enemy',
            enemyHp: 100,
            enemyMaxHp: 100,
            heroHp: 100,
            heroMaxHp: 100,
            specialMove: {
                name: 'Ultimate Strike',
                description: 'A powerful attack that deals massive damage.'
            },
            // Can extend with phase.srpgConfig if available
            ...((phase as BattlePhase & { srpgConfig?: Partial<SRPGBattleConfig> }).srpgConfig ?? {})
        };

        return <SRPGBattleScreen config={srpgConfig} onWin={handleWin} />;
    }

    // RPG Mode (default)
    return <RPGBattleScreen onWin={handleWin} />;
};
