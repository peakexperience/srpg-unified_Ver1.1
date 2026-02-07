import React from 'react';

interface GalleryViewProps {
    data: Record<string, unknown>[];
}

export function GalleryView({ data }: GalleryViewProps) {
    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-500">
                データがありません
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {data.map((item, index) => (
                <div
                    key={(item.id as string) ?? index}
                    className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-800 transition-all cursor-pointer group"
                >
                    {/* Image placeholder */}
                    <div className="w-full aspect-[3/4] bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg mb-3 flex items-center justify-center text-4xl group-hover:from-slate-600 group-hover:to-slate-700 transition-all">
                        {getEmoji(item)}
                    </div>

                    {/* Name */}
                    <h3 className="text-white font-bold text-sm truncate">
                        {(item.name as string) ?? 'Unknown'}
                    </h3>

                    {/* Subtitle/Type */}
                    {item.job && (
                        <p className="text-amber-400 text-xs mt-1">{item.job as string}</p>
                    )}
                    {item.type && (
                        <p className="text-blue-400 text-xs mt-1">{item.type as string}</p>
                    )}
                    {item.location && (
                        <p className="text-purple-400 text-xs mt-1">{item.location as string}</p>
                    )}

                    {/* Description */}
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                        {(item.description as string) ?? ''}
                    </p>

                    {/* Tags */}
                    {item.defaultTags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {((item.defaultTags as string[]) || []).slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function getEmoji(item: Record<string, unknown>): string {
    // Determine emoji based on item properties
    if (item.job) return '👤'; // Character
    if (item.hp && item.atk) return '👾'; // Enemy
    if (item.location) return '🧑‍🤝‍🧑'; // NPC
    if (item.effect) return '📦'; // Item
    if (item.file?.toString().includes('mp3')) return '🎵'; // BGM
    if (item.file?.toString().includes('wav')) return '🔊'; // SE
    if (item.category) return '🖼️'; // CG
    if (item.chapter) return '📖'; // Event
    return '📍'; // Location/default
}
