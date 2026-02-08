import React from 'react';
import { ArrowLeft, ExternalLink, Package, Shield, Swords, Sparkles, User, MapPin } from 'lucide-react';

interface DetailViewProps {
    item: Record<string, unknown>;
    onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ item, onBack }) => {
    // Helper to determine icon based on item type/keys
    const getIcon = () => {
        if (item.job) return <User size={48} className="text-slate-400" />;
        if (item.atk) return <Swords size={48} className="text-red-400" />;
        if (item.def) return <Shield size={48} className="text-blue-400" />;
        if (item.heal) return <Sparkles size={48} className="text-emerald-400" />;
        if (item.location) return <MapPin size={48} className="text-amber-400" />;
        return <Package size={48} className="text-slate-400" />;
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800">
            {/* Header / Toolbar */}
            <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                    <span className="text-sm font-medium">戻る</span>
                </button>
                <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="JSONを表示">
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Section */}
                    <div className="flex flex-col md:flex-row gap-8 mb-8">
                        {/* ID Card / Image Placeholder */}
                        <div className="w-full md:w-64 aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 flex items-center justify-center shrink-0 shadow-lg">
                            {getIcon()}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700 font-mono">
                                    ID: {String(item.id)}
                                </span>
                                {item.type && (
                                    <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-xs rounded border border-blue-900/50">
                                        {String(item.type)}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2">{String(item.name || 'Unknown Item')}</h1>

                            {item.job && (
                                <p className="text-xl text-amber-500 mb-4">{String(item.job)}</p>
                            )}

                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mb-6">
                                <p className="text-slate-300 leading-relaxed">
                                    {String(item.description || 'No description available.')}
                                </p>
                            </div>

                            {/* Tags */}
                            {item.defaultTags && Array.isArray(item.defaultTags) && (
                                <div className="flex flex-wrap gap-2">
                                    {(item.defaultTags as string[]).map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-400 text-sm rounded-full border border-slate-700">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats / Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Render key-value pairs for other properties */}
                        {Object.entries(item).map(([key, value]) => {
                            // Skip already displayed fields
                            if (['id', 'name', 'description', 'type', 'job', 'defaultTags'].includes(key)) return null;
                            if (typeof value === 'object' && value !== null) return null; // Simple values only for now

                            return (
                                <div key={key} className="bg-slate-800/30 rounded-lg p-4 border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">{key}</p>
                                    <p className="text-slate-200 font-mono text-sm truncate" title={String(value)}>
                                        {String(value)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Raw Data (for debug/dev) */}
                    <div className="mt-8 pt-8 border-t border-slate-800">
                        <details className="group">
                            <summary className="cursor-pointer text-slate-500 hover:text-slate-300 text-sm font-medium flex items-center gap-2">
                                <span>Raw Data</span>
                            </summary>
                            <pre className="mt-4 bg-slate-950 p-4 rounded-lg overflow-x-auto text-xs font-mono text-slate-400 border border-slate-800">
                                {JSON.stringify(item, null, 2)}
                            </pre>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
};
