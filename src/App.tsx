import React from 'react';
import { useGameStore } from '@/core/stores/useGameStore';
import { TitleScreen } from '@/screens/01_Title/TitleScreen';
import { NovelScreen } from '@/screens/02_Novel/NovelScreen';
import { BattleScreen } from '@/screens/03_Battle/BattleScreen';
import { ResultScreen } from '@/screens/04_Result/ResultScreen';
import { CollectionScreen } from '@/screens/10_Collection/CollectionScreen';
import { EditorScreen } from '@/screens/11_Editor/EditorScreen';

const App: React.FC = () => {
    const currentScreen = useGameStore((state) => state.currentScreen);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'TITLE':
                return <TitleScreen />;
            case 'NOVEL':
                return <NovelScreen />;
            case 'BATTLE':
                return <BattleScreen />;
            case 'RESULT':
                return <ResultScreen />;
            case 'COLLECTION':
                return <CollectionScreen />;
            case 'EDITOR':
                return <EditorScreen />;
            default:
                return <TitleScreen />;
        }
    };

    return (
        <div className="flex items-center justify-center w-screen h-screen bg-slate-950">
            <div className="game-viewport w-full max-w-4xl aspect-video bg-black shadow-2xl overflow-hidden ring-1 ring-white/10">
                {renderScreen()}
            </div>
        </div>
    );
};

export default App;
