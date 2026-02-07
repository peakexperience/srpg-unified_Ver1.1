import React from 'react';
import { Menu, Grid3X3, LayoutList, IdCard } from 'lucide-react';
import type { ViewMode } from '@/core/hooks/useViewMode';

interface ViewSwitcherProps {
    currentView: ViewMode;
    onViewChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
    const views: { id: ViewMode; icon: typeof Menu; label: string }[] = [
        { id: 'list', icon: Menu, label: 'リスト表示' },
        { id: 'gallery', icon: Grid3X3, label: 'ギャラリー表示' },
        { id: 'kanban', icon: LayoutList, label: 'カンバン表示' },
        { id: 'custom', icon: IdCard, label: '詳細表示' },
    ];

    return (
        <div className="inline-flex gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700">
            {views.map((view) => {
                const Icon = view.icon;
                return (
                    <button
                        key={view.id}
                        onClick={() => onViewChange(view.id)}
                        className={`p-2 rounded transition-all ${currentView === view.id
                                ? 'bg-slate-700 text-amber-400'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                        title={view.label}
                    >
                        <Icon size={18} strokeWidth={2} />
                    </button>
                );
            })}
        </div>
    );
}
