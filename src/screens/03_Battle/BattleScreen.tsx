import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import { useCardEditorStore } from '@/core/stores/useCardEditorStore';
import type { BattlePhase } from '@/core/types';

export const BattleScreen: React.FC = () => {
    const { currentScenario, currentPhaseIndex, nextPhase, playerStatus, updatePlayerStatus } = useGameStore();
    const { database } = useCardEditorStore();

    const phase = currentScenario?.phases[currentPhaseIndex] as BattlePhase | undefined;

    const [enemyHp, setEnemyHp] = useState(30);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [battleLog, setBattleLog] = useState<string[]>(['バトル開始！']);
    const [isAnimating, setIsAnimating] = useState(false);

    const enemy = phase?.enemyId ? database.enemies[phase.enemyId] : null;
    const maxEnemyHp = enemy?.stats.maxHp ?? 30;

    useEffect(() => {
        if (enemy) {
            setEnemyHp(enemy.stats.maxHp);
        }
    }, [enemy]);

    if (!phase || phase.type !== 'BATTLE') {
        return null;
    }

    const addLog = (msg: string) => {
        setBattleLog(prev => [...prev.slice(-4), msg]);
    };

    const handleAttack = () => {
        if (isAnimating || !isPlayerTurn) return;
        setIsAnimating(true);

        const damage = Math.floor(Math.random() * 10) + 8;
        const newEnemyHp = Math.max(0, enemyHp - damage);
        setEnemyHp(newEnemyHp);
        addLog(`プレイヤーの攻撃！ ${damage} ダメージ！`);

        if (newEnemyHp <= 0) {
            setTimeout(() => {
                addLog('敵を倒した！');
                setTimeout(() => nextPhase(), 1000);
            }, 500);
            return;
        }

        setIsPlayerTurn(false);
        setTimeout(() => {
            // Enemy turn
            const enemyDamage = Math.floor(Math.random() * 5) + 3;
            updatePlayerStatus({ hp: Math.max(0, playerStatus.hp - enemyDamage) });
            addLog(`${enemy?.name ?? 'エネミー'}の攻撃！ ${enemyDamage} ダメージ！`);
            setIsPlayerTurn(true);
            setIsAnimating(false);
        }, 1000);
    };

    const handleSkill = () => {
        if (isAnimating || !isPlayerTurn || playerStatus.mp < 10) return;
        setIsAnimating(true);

        const damage = Math.floor(Math.random() * 15) + 15;
        const newEnemyHp = Math.max(0, enemyHp - damage);
        setEnemyHp(newEnemyHp);
        updatePlayerStatus({ mp: playerStatus.mp - 10 });
        addLog(`必殺技発動！ ${damage} ダメージ！`);

        if (newEnemyHp <= 0) {
            setTimeout(() => {
                addLog('敵を倒した！');
                setTimeout(() => nextPhase(), 1000);
            }, 500);
            return;
        }

        setIsPlayerTurn(false);
        setTimeout(() => {
            const enemyDamage = Math.floor(Math.random() * 5) + 3;
            updatePlayerStatus({ hp: Math.max(0, playerStatus.hp - enemyDamage) });
            addLog(`${enemy?.name ?? 'エネミー'}の攻撃！ ${enemyDamage} ダメージ！`);
            setIsPlayerTurn(true);
            setIsAnimating(false);
        }, 1000);
    };

    return (
        <div className="w-full h-full bg-gradient-to-b from-red-950 via-slate-900 to-slate-950 flex flex-col">
            {/* Battle Field */}
            <div className="flex-1 flex items-center justify-around px-8 relative">
                {/* Player */}
                <div className="flex flex-col items-center">
                    <div className="w-32 h-40 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-5xl shadow-xl">
                        ⚔️
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-white font-bold">プレイヤー</p>
                        <div className="mt-2 w-32">
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all duration-300"
                                    style={{ width: `${(playerStatus.hp / playerStatus.maxHp) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">HP: {playerStatus.hp}/{playerStatus.maxHp}</p>
                        </div>
                        <div className="mt-1 w-32">
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${(playerStatus.mp / playerStatus.maxMp) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">MP: {playerStatus.mp}/{playerStatus.maxMp}</p>
                        </div>
                    </div>
                </div>

                {/* VS */}
                <div className="text-4xl font-black text-red-500 animate-pulse">VS</div>

                {/* Enemy */}
                <div className="flex flex-col items-center">
                    <div className={`w-32 h-40 bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-5xl shadow-xl transition-transform ${isAnimating && !isPlayerTurn ? 'translate-x-2' : ''}`}>
                        👾
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-white font-bold">{enemy?.name ?? 'エネミー'}</p>
                        <div className="mt-2 w-32">
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 transition-all duration-300"
                                    style={{ width: `${(enemyHp / maxEnemyHp) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">HP: {enemyHp}/{maxEnemyHp}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Battle Log */}
            <div className="h-24 bg-black/50 border-t border-slate-700 p-3 overflow-hidden">
                <div className="space-y-1">
                    {battleLog.map((log, i) => (
                        <p key={i} className="text-sm text-slate-300 animate-fade-in">{log}</p>
                    ))}
                </div>
            </div>

            {/* Commands */}
            <div className="h-20 bg-slate-900 border-t border-slate-700 p-4 flex justify-center gap-4">
                <button
                    onClick={handleAttack}
                    disabled={!isPlayerTurn || isAnimating}
                    className="px-8 py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-all"
                >
                    ⚔️ 攻撃
                </button>
                <button
                    onClick={handleSkill}
                    disabled={!isPlayerTurn || isAnimating || playerStatus.mp < 10}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-lg transition-all"
                >
                    ✨ 必殺技 (MP10)
                </button>
            </div>
        </div>
    );
};
