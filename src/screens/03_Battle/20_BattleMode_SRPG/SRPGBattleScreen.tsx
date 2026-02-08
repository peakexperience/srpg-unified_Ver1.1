import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Terminal, Sword, Move as MoveIcon, Zap } from 'lucide-react';

// ===================================
// SRPG Battle Types
// ===================================
export interface SRPGBattleConfig {
    enemyName: string;
    enemyHp: number;
    enemyMaxHp: number;
    heroHp: number;
    heroMaxHp: number;
    backgroundUrl?: string;
    specialMove: {
        name: string;
        description: string;
    };
}

interface SRPGBattleScreenProps {
    config: SRPGBattleConfig;
    onWin: () => void;
}

// State Machine Definitions
type TurnPhase = 'PLAYER_START' | 'PLAYER_ACTION' | 'ENEMY_START' | 'ENEMY_ACTION';
type InteractionState = 'IDLE' | 'MOVING' | 'ATTACK_SELECT' | 'TARGET_CONFIRM' | 'SKILL_ANIMATION';

export const SRPGBattleScreen: React.FC<SRPGBattleScreenProps> = ({ config, onWin }) => {
    const [log, setLog] = useState<string[]>(["Battle Commenced!"]);

    // Stats
    const [enemyHp, setEnemyHp] = useState(config.enemyHp);
    const [heroHp, setHeroHp] = useState(config.heroHp);
    const [sp, setSp] = useState(0); // Skill Points (0-100)

    // Positions (Index 0-24)
    const [heroIdx, setHeroIdx] = useState(12);
    const [enemyIdx, setEnemyIdx] = useState(2);

    // States
    const [turnPhase, setTurnPhase] = useState<TurnPhase>('PLAYER_START');
    const [interactionState, setInteractionState] = useState<InteractionState>('IDLE');

    // Animation / Visuals
    const [showBanner, setShowBanner] = useState(false);
    const [bannerText, setBannerText] = useState("");
    const [isHeroHovering, setIsHeroHovering] = useState(false);
    const [showSkillCutin, setShowSkillCutin] = useState(false);

    // --- Initial Start ---
    useEffect(() => {
        triggerPhase('PLAYER_START');
    }, []);

    // --- Helpers ---
    const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

    const getCoords = (idx: number) => ({ x: idx % 5, y: Math.floor(idx / 5) });

    const getDistance = (idxA: number, idxB: number) => {
        const a = getCoords(idxA);
        const b = getCoords(idxB);
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    };

    // --- Ranges ---
    const reachableTiles = useMemo(() => {
        const reachable = [];
        for (let i = 0; i < 25; i++) {
            if (getDistance(heroIdx, i) <= 2 && i !== enemyIdx) reachable.push(i);
        }
        return reachable;
    }, [heroIdx, enemyIdx]);

    const attackableTiles = useMemo(() => {
        if (interactionState !== 'ATTACK_SELECT' && interactionState !== 'TARGET_CONFIRM') return [];
        if (getDistance(heroIdx, enemyIdx) <= 1) return [enemyIdx];
        return [];
    }, [heroIdx, enemyIdx, interactionState]);

    // --- Phase Control ---
    const triggerPhase = (phase: TurnPhase) => {
        setTurnPhase(phase);

        if (phase === 'PLAYER_START') {
            setBannerText("PLAYER TURN");
            setShowBanner(true);
            setSp(prev => Math.min(100, prev + 20));

            setTimeout(() => {
                setShowBanner(false);
                setTurnPhase('PLAYER_ACTION');
                setInteractionState('IDLE');
                addLog("Your turn.");
            }, 2000);
        }
        else if (phase === 'ENEMY_START') {
            setBannerText("ENEMY TURN");
            setShowBanner(true);
            setInteractionState('IDLE');
            setTimeout(() => {
                setShowBanner(false);
                setTurnPhase('ENEMY_ACTION');
                executeEnemyAI();
            }, 2000);
        }
    };

    // --- Action Logic ---
    const handleHeroClick = () => {
        if (turnPhase !== 'PLAYER_ACTION') return;
        if (interactionState === 'SKILL_ANIMATION') return;

        if (interactionState === 'IDLE') {
            setInteractionState('MOVING');
            setIsHeroHovering(true);
            addLog("Move Mode: Select blue tile.");
        }
        else if (interactionState === 'MOVING') {
            setInteractionState('ATTACK_SELECT');
            setIsHeroHovering(false);
            addLog("Attack Mode: Select Enemy.");
        }
        else {
            setInteractionState('IDLE');
            addLog("Cancelled.");
        }
    };

    const handleTileClick = (idx: number) => {
        if (turnPhase !== 'PLAYER_ACTION') return;
        if (interactionState === 'SKILL_ANIMATION') return;

        if (interactionState === 'MOVING' && reachableTiles.includes(idx)) {
            setHeroIdx(idx);
            setIsHeroHovering(false);
            setInteractionState('ATTACK_SELECT');
            addLog("Moved. Select Enemy to Attack.");
        }
        else if (idx !== enemyIdx && idx !== heroIdx) {
            if (interactionState !== 'IDLE') {
                setInteractionState('IDLE');
                setIsHeroHovering(false);
                addLog("Action Cancelled.");
            }
        }
    };

    const handleEnemyClick = () => {
        if (turnPhase !== 'PLAYER_ACTION') return;
        if (interactionState === 'SKILL_ANIMATION') return;

        if (interactionState === 'MOVING') {
            let bestTile = heroIdx;
            let minDist = getDistance(heroIdx, enemyIdx);

            reachableTiles.forEach(tile => {
                const distToEnemy = getDistance(tile, enemyIdx);
                if (distToEnemy < minDist) {
                    minDist = distToEnemy;
                    bestTile = tile;
                }
            });

            if (bestTile !== heroIdx) setHeroIdx(bestTile);
            setIsHeroHovering(false);

            const newDist = getDistance(bestTile, enemyIdx);
            if (newDist <= 1) {
                setInteractionState('TARGET_CONFIRM');
                addLog(bestTile !== heroIdx ? "Dashed & Locked Target!" : "Locked Target!");
            } else {
                setInteractionState('ATTACK_SELECT');
                addLog("Moved closer.");
            }
            return;
        }

        const dist = getDistance(heroIdx, enemyIdx);
        if (interactionState === 'ATTACK_SELECT') {
            if (dist <= 1) {
                setInteractionState('TARGET_CONFIRM');
                addLog("Target Locked! Tap again to Strike.");
            } else {
                addLog("Too far to attack!");
            }
        }
        else if (interactionState === 'TARGET_CONFIRM') {
            const dmg = Math.floor(Math.random() * 20) + 20;
            applyDamageToEnemy(dmg);
        }
    };

    const applyDamageToEnemy = (dmg: number, isSkill: boolean = false) => {
        const newHp = Math.max(0, enemyHp - dmg);
        setEnemyHp(newHp);
        setSp(prev => Math.min(100, prev + 15));

        addLog(isSkill ? `>>> ULTIMATE HIT! ${dmg} DMG!` : `>> SLASH! Dealt ${dmg} DMG!`);

        if (newHp === 0) {
            addLog(">> ENEMY DEFEATED!");
            setTimeout(onWin, 1500);
        } else {
            triggerPhase('ENEMY_START');
        }
    };

    const handleSkill = () => {
        if (turnPhase !== 'PLAYER_ACTION' || sp < 100) return;

        setInteractionState('SKILL_ANIMATION');
        setShowSkillCutin(true);
        setSp(0);

        setTimeout(() => {
            setShowSkillCutin(false);
            const dmg = Math.floor(Math.random() * 30) + 60;
            applyDamageToEnemy(dmg, true);
        }, 2000);
    };

    const executeEnemyAI = () => {
        setTimeout(() => {
            const dist = getDistance(enemyIdx, heroIdx);

            if (dist <= 1) {
                const dmg = Math.floor(Math.random() * 10) + 5;
                setHeroHp(prev => Math.max(0, prev - dmg));
                setSp(prev => Math.min(100, prev + 10));
                addLog(`>> Enemy attacks! Taken ${dmg} DMG.`);
            } else {
                const enemyCoords = getCoords(enemyIdx);
                const heroCoords = getCoords(heroIdx);
                let nextIdx = enemyIdx;

                if (enemyCoords.x < heroCoords.x) nextIdx += 1;
                else if (enemyCoords.x > heroCoords.x) nextIdx -= 1;
                else if (enemyCoords.y < heroCoords.y) nextIdx += 5;
                else if (enemyCoords.y > heroCoords.y) nextIdx -= 5;

                if (nextIdx !== heroIdx) {
                    setEnemyIdx(nextIdx);
                    addLog(`>> Enemy moves closer...`);
                }
            }
            triggerPhase('PLAYER_START');
        }, 1000);
    };

    const handleGuard = () => {
        if (turnPhase !== 'PLAYER_ACTION') return;
        addLog(">> Defensive Stance. SP +10");
        setSp(prev => Math.min(100, prev + 10));
        triggerPhase('ENEMY_START');
    };

    const isTileReachable = (i: number) => {
        return interactionState === 'MOVING' && reachableTiles.includes(i);
    };

    return (
        <div className="w-full h-full relative bg-[#0a0f0f] overflow-hidden">
            {/* Background */}
            {config.backgroundUrl && (
                <div className="absolute inset-0 opacity-20 grayscale scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${config.backgroundUrl})`, backgroundSize: 'cover' }} />
            )}

            {/* --- PHASE BANNER --- */}
            <div className={`
                absolute top-1/2 left-0 w-full h-32 -translate-y-1/2 z-50 pointer-events-none flex items-center justify-center
                transition-all duration-500 transform
                ${showBanner ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
            `}>
                <div className="w-full h-24 bg-black/90 flex items-center justify-center border-y-2 border-yellow-500/50 shadow-2xl">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-[0.5em] animate-pulse">
                        {bannerText}
                    </h2>
                </div>
            </div>

            {/* --- SKILL CUT-IN --- */}
            <div className={`
                absolute inset-0 z-[60] flex flex-col items-center justify-center bg-blue-900/80 pointer-events-none
                transition-all duration-300
                ${showSkillCutin ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
            `}>
                <div className="relative w-full h-48 bg-black flex items-center justify-center border-y-4 border-blue-400 overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
                    <h2 className="relative z-10 text-5xl md:text-7xl italic font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 tracking-widest drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]">
                        {config.specialMove.name}
                    </h2>
                </div>
                <p className="mt-4 text-blue-100 text-xl">
                    "{config.specialMove.description}"
                </p>
            </div>

            {/* --- GRID FIELD --- */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-8 select-none">
                <div className="grid grid-cols-5 gap-2 transform rotate-[45deg] -skew-x-[10deg] scale-110 md:scale-125">
                    {[...Array(25)].map((_, i) => {
                        const isHero = i === heroIdx;
                        const isEnemy = i === enemyIdx && enemyHp > 0;
                        const isReachable = isTileReachable(i);
                        const isAttackable = interactionState === 'ATTACK_SELECT' && attackableTiles.includes(i);
                        const isTargetLocked = interactionState === 'TARGET_CONFIRM' && i === enemyIdx;

                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    if (isHero) handleHeroClick();
                                    else if (isEnemy) handleEnemyClick();
                                    else handleTileClick(i);
                                }}
                                className={`
                                    w-16 h-16 md:w-20 md:h-20 border transition-all duration-300 relative cursor-pointer
                                    ${isReachable
                                        ? 'bg-blue-500/30 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)] animate-pulse'
                                        : 'bg-black/40 border-white/5'}
                                    ${isTargetLocked
                                        ? 'bg-red-500/20 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,0.6)]'
                                        : ''}
                                    ${!isReachable && !isTargetLocked && !isHero && !isEnemy ? 'hover:bg-white/5' : ''}
                                `}
                            >
                                {/* Coordinates */}
                                <span className="absolute top-1 left-1 text-[8px] opacity-10 text-white pointer-events-none">
                                    {i % 5},{Math.floor(i / 5)}
                                </span>

                                {/* HERO */}
                                {isHero && (
                                    <div className={`
                                        absolute inset-0 flex flex-col items-center justify-center -rotate-[45deg] z-20 
                                        transition-all duration-500 transform-gpu
                                        ${isHeroHovering ? '-translate-y-6 drop-shadow-[0_15px_5px_rgba(0,0,0,0.5)]' : ''}
                                    `}>
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-sm shadow-[0_0_20px_rgba(37,99,235,0.8)] border-2 border-white/80 relative overflow-hidden">
                                            {sp >= 100 && <div className="absolute inset-0 bg-blue-300 mix-blend-overlay animate-pulse" />}
                                        </div>

                                        <div className="absolute -bottom-6 bg-blue-900/90 px-2 py-0.5 rounded text-[8px] text-blue-100 whitespace-nowrap border border-blue-400/50 flex flex-col items-center">
                                            <span>PLAYER</span>
                                            {interactionState === 'MOVING' && <MoveIcon size={8} className="text-yellow-300 mt-0.5" />}
                                            {(interactionState === 'ATTACK_SELECT' || interactionState === 'TARGET_CONFIRM') && <Sword size={8} className="text-red-300 mt-0.5" />}
                                        </div>
                                    </div>
                                )}

                                {/* ENEMY */}
                                {isEnemy && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-[45deg] z-10 transition-all duration-500 transform-gpu">
                                        <div className={`
                                            w-12 h-8 md:w-14 md:h-10 rounded-full shadow-[0_0_25px_rgba(220,38,38,0.6)]
                                            bg-gradient-to-br from-red-700 to-red-900
                                            ${isTargetLocked ? 'border-2 border-yellow-400 animate-pulse' : 'border border-red-400/30'}
                                            ${(interactionState === 'ATTACK_SELECT' && isAttackable) ? 'border-2 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.8)]' : ''}
                                        `} />
                                        <div className={`
                                            absolute -bottom-4 px-2 py-0.5 rounded text-[8px] whitespace-nowrap border transition-colors
                                            ${isTargetLocked ? 'bg-yellow-900/90 text-yellow-100 border-yellow-500' : 'bg-red-900/90 text-red-100 border-red-400/50'}
                                        `}>
                                            {isTargetLocked ? "TAP TO STRIKE!" : config.enemyName.toUpperCase()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- HUD --- */}
            <div className="absolute top-6 left-6 space-y-3 w-64 pointer-events-none z-10">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] text-blue-400 tracking-widest">KNIGHT HP</span>
                        <span className="text-xs text-white">{heroHp} / {config.heroMaxHp}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-700"
                            style={{ width: `${(heroHp / config.heroMaxHp) * 100}%` }}
                        />
                    </div>
                    {/* SP Gauge */}
                    <div className="flex justify-between items-end mb-1 mt-2">
                        <span className="text-[10px] text-yellow-400 tracking-widest">SP GAUGE</span>
                        <span className="text-xs text-white">{sp}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-white/10">
                        <div
                            className={`h-full transition-all duration-700 ${sp >= 100 ? 'bg-yellow-400 shadow-[0_0_10px_#fbbf24]' : 'bg-yellow-700'}`}
                            style={{ width: `${sp}%` }}
                        />
                    </div>
                </div>

                <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-[10px] text-red-400 tracking-widest">{config.enemyName.toUpperCase()} HP</span>
                        <span className="text-xs text-white">{enemyHp} / {config.enemyMaxHp}</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 to-orange-400 transition-all duration-700"
                            style={{ width: `${(enemyHp / config.enemyMaxHp) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* --- LOG --- */}
            <div className="absolute bottom-6 left-6 w-72 h-36 bg-black/90 border border-white/5 rounded-md p-3 overflow-hidden text-[10px] flex flex-col-reverse shadow-2xl backdrop-blur-sm z-10">
                <div className="absolute top-2 right-2 opacity-20"><Terminal size={12} /></div>
                {log.map((l, i) => (
                    <div key={i} className={`py-0.5 border-b border-white/5 ${i === 0 ? 'text-yellow-400' : 'text-green-500/60'}`}>
                        {`> ${l}`}
                    </div>
                ))}
            </div>

            {/* --- CONTROLS --- */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-10">
                <div className="text-right text-[10px] text-gray-400 mb-1 opacity-80">
                    {interactionState === 'SKILL_ANIMATION' ? "Casting Ultimate..." : "Turn: " + turnPhase}
                </div>

                {/* SKILL BUTTON */}
                <button
                    onClick={handleSkill}
                    disabled={turnPhase !== 'PLAYER_ACTION' || sp < 100}
                    className={`
                        w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all border-2 relative overflow-hidden group
                        ${turnPhase === 'PLAYER_ACTION' && sp >= 100
                            ? 'bg-blue-900 border-blue-400 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-bounce'
                            : 'bg-slate-900 border-transparent text-slate-700 opacity-50'}
                    `}
                >
                    {sp >= 100 && <div className="absolute inset-0 bg-blue-400/20 animate-pulse" />}
                    <Zap size={24} className={sp >= 100 ? "fill-yellow-300 text-yellow-300" : ""} />
                    <span className="text-[9px] font-bold mt-1 tracking-tighter uppercase relative z-10">
                        SKILL
                    </span>
                </button>

                {/* DEFEND BUTTON */}
                <button
                    onClick={handleGuard}
                    disabled={turnPhase !== 'PLAYER_ACTION'}
                    className={`
                        w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all border-2
                        ${turnPhase === 'PLAYER_ACTION'
                            ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-white'
                            : 'bg-slate-900 border-transparent text-slate-600 opacity-50'}
                    `}
                >
                    <Shield size={24} />
                    <span className="text-[9px] font-bold mt-1 tracking-tighter uppercase">Defend</span>
                </button>
            </div>
        </div>
    );
};
