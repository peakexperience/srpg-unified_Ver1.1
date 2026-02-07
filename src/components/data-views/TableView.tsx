import React from 'react';

export interface TableColumn {
    key: string;
    label: string;
    render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode;
}

interface TableViewProps {
    data: Record<string, unknown>[];
    columns: TableColumn[];
}

export function TableView({ data, columns }: TableViewProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-500">
                データがありません
            </div>
        );
    }

    return (
        <div className="overflow-auto h-full">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-slate-900 z-10">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr
                            key={(item.id as string) ?? rowIndex}
                            className="hover:bg-slate-800/50 transition-colors border-b border-slate-800"
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-3 text-sm text-slate-300">
                                    {col.render
                                        ? col.render(item[col.key], item)
                                        : String(item[col.key] ?? '-')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ===================================
// Column Definitions
// ===================================

const tagRenderer = (tags: string[]) => (
    <div className="flex gap-1 flex-wrap">
        {(tags || []).map((tag, i) => (
            <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded"
                style={{
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981'][i % 3] + '33',
                    color: ['#60a5fa', '#a78bfa', '#34d399'][i % 3],
                }}
            >
                {tag}
            </span>
        ))}
    </div>
);

export const CHARACTER_COLUMNS: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '名前' },
    { key: 'job', label: '職業' },
    { key: 'description', label: '説明' },
    { key: 'defaultTags', label: 'タグ', render: tagRenderer },
];

export const ENEMY_COLUMNS: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '名前' },
    { key: 'hp', label: 'HP' },
    { key: 'atk', label: 'ATK' },
    { key: 'def', label: 'DEF' },
    { key: 'exp', label: 'EXP' },
    { key: 'defaultTags', label: 'タグ', render: tagRenderer },
];

export const NPC_COLUMNS: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '名前' },
    { key: 'location', label: '場所' },
    { key: 'description', label: '説明' },
    { key: 'defaultTags', label: 'タグ', render: tagRenderer },
];

export const PLACE_COLUMNS: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '地名' },
    { key: 'type', label: 'タイプ' },
    { key: 'description', label: '説明' },
    { key: 'defaultTags', label: 'タグ', render: tagRenderer },
];

export const ITEM_COLUMNS: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '名前' },
    { key: 'type', label: '種類' },
    { key: 'effect', label: '効果' },
    { key: 'price', label: '価格' },
    { key: 'defaultTags', label: 'タグ', render: tagRenderer },
];

export const SOUND_COLUMNS: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '名前' },
    { key: 'type', label: 'タイプ' },
    { key: 'description', label: '説明' },
    { key: 'file', label: 'ファイル' },
];

export const EVENT_COLUMNS: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'イベント名' },
    { key: 'chapter', label: '章' },
    { key: 'status', label: 'ステータス' },
    { key: 'description', label: '説明' },
    { key: 'defaultTags', label: 'タグ', render: tagRenderer },
];

export const CG_COLUMNS: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: '名前' },
    { key: 'category', label: 'カテゴリ' },
    { key: 'description', label: '説明' },
];
