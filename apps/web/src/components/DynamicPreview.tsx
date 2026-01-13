'use client';
import { useState } from 'react';

type Entity = {
    name: string;
    fields: { name: string; type: string; optional: boolean }[];
};

type Config = {
    appName: string;
    features: string[];
    entities: Entity[];
};

export default function DynamicPreview({ config }: { config: Config }) {
    const [activeEntity, setActiveEntity] = useState<string>(config.entities?.[0]?.name || 'Dashboard');

    // Mock Data Generators
    const generateMockData = (entity: Entity) => {
        return Array.from({ length: 5 }).map((_, i) => {
            const row: any = { id: i + 1 };
            entity.fields.forEach(f => {
                if (f.type === 'Int') row[f.name] = Math.floor(Math.random() * 100);
                else if (f.type === 'Boolean') row[f.name] = Math.random() > 0.5 ? 'Yes' : 'No';
                else if (f.type === 'DateTime') row[f.name] = new Date().toLocaleDateString();
                else row[f.name] = `${f.name} ${i + 1}`;
            });
            return row;
        });
    };

    const currentEntity = config.entities?.find(e => e.name === activeEntity);

    return (
        <div className="flex h-[600px] w-full bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-slate-300 flex flex-col">
                <div className="h-16 flex items-center px-6 font-bold text-white text-xl border-b border-slate-800">
                    {config.appName}
                </div>
                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => setActiveEntity('Dashboard')}
                        className={`w-full text-left px-4 py-2 rounded transition ${activeEntity === 'Dashboard' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
                    >
                        Dashboard
                    </button>
                    <div className="text-xs font-semibold text-slate-500 mt-4 mb-2 uppercase tracking-wide">Data Manager</div>
                    {config.entities?.map(e => (
                        <button
                            key={e.name}
                            onClick={() => setActiveEntity(e.name)}
                            className={`w-full text-left px-4 py-2 rounded transition ${activeEntity === e.name ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
                        >
                            {e.name}
                        </button>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">U</div>
                        <div className="text-sm">
                            <div className="text-white">Admin User</div>
                            <div className="text-xs text-slate-500">admin@app.com</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-8">
                    <h2 className="text-xl font-bold text-slate-800">{activeEntity}</h2>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-500">
                            + New {activeEntity === 'Dashboard' ? 'Item' : activeEntity}
                        </button>
                    </div>
                </header>

                {/* content */}
                <div className="flex-1 p-8 overflow-auto">
                    {activeEntity === 'Dashboard' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(config.entities || []).slice(0, 3).map(e => (
                                <div key={e.name} className="bg-white p-6 rounded-xl border shadow-sm">
                                    <div className="text-slate-500 text-sm mb-1">Total {e.name}s</div>
                                    <div className="text-3xl font-bold text-slate-900">{Math.floor(Math.random() * 500) + 10}</div>
                                </div>
                            ))}
                            <div className="bg-white p-6 rounded-xl border shadow-sm col-span-full">
                                <h3 className="font-bold mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-4 text-sm pb-4 border-b last:border-0">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <div className="flex-1 text-slate-600">New record created in <strong>{config.entities?.[0]?.name}</strong></div>
                                            <div className="text-slate-400">2m ago</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : currentEntity ? (
                        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-100 text-slate-900 font-semibold">
                                    <tr>
                                        <th className="px-6 py-3 border-b">ID</th>
                                        {currentEntity.fields.map(f => (
                                            <th key={f.name} className="px-6 py-3 border-b">{f.name}</th>
                                        ))}
                                        <th className="px-6 py-3 border-b text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generateMockData(currentEntity).map((row: any) => (
                                        <tr key={row.id} className="border-b last:border-0 hover:bg-slate-50">
                                            <td className="px-6 py-3">{row.id}</td>
                                            {currentEntity.fields.map(f => (
                                                <td key={f.name} className="px-6 py-3">{row[f.name]}</td>
                                            ))}
                                            <td className="px-6 py-3 text-right">
                                                <button className="text-indigo-600 hover:underline">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
