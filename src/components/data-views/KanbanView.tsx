import React from 'react';

interface KanbanViewProps {
    data: Record<string, unknown>[];
}

export function KanbanView({ data }: KanbanViewProps) {
    // Group by status or type
    const getGroupKey = (item: Record<string, unknown>): string => {
        if (item.status) return item.status as string;
        if (item.type) return item.type as string;
        if (item.category) return item.category as string;
        return '未分類';
    };

    const groups = data.reduce<Record<string, Record<string, unknown>[]>>((acc, item) => {
        const key = getGroupKey(item);
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    const groupKeys = Object.keys(groups);

    if (groupKeys.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-500">
                データがありません
            </div>
        );
    }

    const columnColors: Record<string, string> = {
        '完了': 'border-green-500',
        '進行中': 'border-blue-500',
        '未実装': 'border-slate-500',
        '消費': 'border-emerald-500',
        '大事なもの': 'border-amber-500',
        'ストーリー': 'border-purple-500',
        'エンディング': 'border-pink-500',
        'フィールド': 'border-green-600',
        '街': 'border-blue-600',
        'ダンジョン': 'border-red-600',
    };

    return (
        <div className="flex gap-4 p-4 overflow-x-auto h-full">
            {groupKeys.map((groupKey) => (
                <div
                    key={groupKey}
                    className={`flex-shrink-0 w-72 bg-slate-900/50 rounded-xl border-t-4 ${columnColors[groupKey] ?? 'border-slate-600'}`}
                >
                    {/* Column header */}
                    <div className="px-4 py-3 border-b border-slate-800">
                        <h3 className="text-white font-bold text-sm flex items-center gap-2">
                            {groupKey}
                            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                                {groups[groupKey].length}
                            </span>
                        </h3>
                    </div>

                    {/* Column items */}
                    <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
                        {groups[groupKey].map((item, index) => (
                            <div
                                key={(item.id as string) ?? index}
                                className="bg-slate-800 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
                            >
                                <p className="text-white text-sm font-medium truncate">
                                    {(item.name as string) ?? 'Unknown'}
                                </p>
                                {item.description && (
                                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                                        {item.description as string}
                                    </p>
                                )}
                                {item.defaultTags && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {((item.defaultTags as string[]) || []).slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[9px] px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
