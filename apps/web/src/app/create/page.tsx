'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Entity = {
    name: string;
    fields: { name: string; type: string; optional: boolean }[];
};



export default function CreatePage() {
    const [mode, setMode] = useState<'magic' | 'manual'>('magic');
    const [prompt, setPrompt] = useState('');

    // Manual State
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [features, setFeatures] = useState<string[]>([]);
    const [entities, setEntities] = useState<Entity[]>([]);
    const [newEntityName, setNewEntityName] = useState('');

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Manual Handlers
    const toggleFeature = (f: string) => {
        setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
    };
    const addEntity = () => {
        if (!newEntityName) return;
        setEntities([...entities, { name: newEntityName, fields: [{ name: 'name', type: 'String', optional: false }] }]);
        setNewEntityName('');
    };
    const addField = (entityIndex: number) => {
        const updated = [...entities];
        updated[entityIndex].fields.push({ name: 'newField', type: 'String', optional: false });
        setEntities(updated);
    };
    const updateField = (entIdx: number, fieldIdx: number, key: string, val: any) => {
        const updated = [...entities];
        // @ts-ignore
        updated[entIdx].fields[fieldIdx][key] = val;
        setEntities(updated);
    };

    const handleManualSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    config: { appName: name, features, entities }
                }),
            });
            const data = await res.json();
            if (data.id) router.push(`/projects/${data.id}`);
        } catch (err) {
            console.error(err);
            alert('Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleMagicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (data.id) router.push(`/projects/${data.id}`);
        } catch (err) {
            console.error(err);
            alert('Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 pt-20">
            <div className="w-full max-w-2xl bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl relative">

                {/* Mode Switcher */}
                <div className="absolute top-8 right-8 flex gap-2">
                    <button
                        onClick={() => setMode('magic')}
                        className={`text-xs px-3 py-1 rounded-full border ${mode === 'magic' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-600 text-slate-400'}`}
                    >
                        AI Magic
                    </button>
                    <button
                        onClick={() => setMode('manual')}
                        className={`text-xs px-3 py-1 rounded-full border ${mode === 'manual' ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-600 text-slate-400'}`}
                    >
                        Manual
                    </button>
                </div>

                {mode === 'magic' ? (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Describe your Dream App</h1>
                            <p className="text-slate-400">Tell us what you want to build, and we'll handle the specs, database, and code.</p>
                        </div>

                        <form onSubmit={handleMagicSubmit} className="space-y-4">
                            <textarea
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-4 text-lg focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                                placeholder="e.g. I want a marketplace where users can sell vintage sneakers. It needs payments and file uploads for product images..."
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading || !prompt}
                                className="w-full h-14 bg-white text-slate-900 font-bold text-lg rounded-xl hover:bg-slate-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                                        Thinking...
                                    </>
                                ) : (
                                    <>
                                        ✨ Generate App
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        {/* Progress System */}
                        <div className="flex items-center justify-between mb-8 text-sm font-medium text-slate-400 pr-20">
                            <span className={step >= 1 ? "text-indigo-400" : ""}>1. Basics</span>
                            <span className={step >= 2 ? "text-indigo-400" : ""}>2. Data</span>
                            <span className={step >= 3 ? "text-indigo-400" : ""}>3. Review</span>
                        </div>

                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">App Basics</h2>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">App Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        placeholder="My Awesome SaaS"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Features</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {['Auth', 'Payments', 'Database', 'Storage', 'Admin', 'AI'].map(f => (
                                            <button
                                                key={f}
                                                onClick={() => toggleFeature(f)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${features.includes(f)
                                                    ? 'bg-indigo-600 border-indigo-500 text-white'
                                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }`}
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => setStep(2)} disabled={!name} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 rounded-lg disabled:opacity-50">Next: Data Model</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Data Model</h2>
                                <div className="space-y-4">
                                    {entities.map((ent, idx) => (
                                        <div key={idx} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="font-bold text-lg">{ent.name}</h3>
                                                <button onClick={() => addField(idx)} className="text-xs text-indigo-400 hover:text-indigo-300">+ Add Field</button>
                                            </div>
                                            <div className="space-y-2">
                                                {ent.fields.map((field, fIdx) => (
                                                    <div key={fIdx} className="flex gap-2">
                                                        <input
                                                            value={field.name}
                                                            onChange={(e) => updateField(idx, fIdx, 'name', e.target.value)}
                                                            className="bg-slate-800 rounded px-2 py-1 text-sm w-1/3"
                                                        />
                                                        <select
                                                            value={field.type}
                                                            onChange={(e) => updateField(idx, fIdx, 'type', e.target.value)}
                                                            className="bg-slate-800 rounded px-2 py-1 text-sm w-1/3"
                                                        >
                                                            <option value="String">String</option>
                                                            <option value="Int">Int</option>
                                                            <option value="Boolean">Boolean</option>
                                                            <option value="DateTime">DateTime</option>
                                                        </select>
                                                        <label className="flex items-center gap-1 text-xs text-slate-400">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.optional}
                                                                onChange={(e) => updateField(idx, fIdx, 'optional', e.target.checked)}
                                                            />
                                                            Opt
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        value={newEntityName}
                                        onChange={e => setNewEntityName(e.target.value)}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"
                                        placeholder="New Entity"
                                    />
                                    <button onClick={addEntity} disabled={!newEntityName} className="bg-slate-700 hover:bg-slate-600 px-4 rounded-lg">Add</button>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(1)} className="flex-1 h-12 border border-slate-700 rounded-lg hover:bg-slate-800">Back</button>
                                    <button onClick={() => setStep(3)} className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-lg">Next</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Review</h2>
                                <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
                                    <p className="font-semibold text-lg">{name}</p>
                                    <p className="text-sm text-slate-400 mt-2">{features.join(', ')}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="flex-1 h-12 border border-slate-700 rounded-lg hover:bg-slate-800">Back</button>
                                    <button onClick={handleManualSubmit} disabled={loading} className="flex-1 h-12 bg-green-600 hover:bg-green-500 rounded-lg font-bold">
                                        {loading ? 'Building...' : `Generate`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
