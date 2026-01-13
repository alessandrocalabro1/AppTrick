'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type FileNode = { path: string; content: string };

import DynamicPreview from '@/components/DynamicPreview';

export default function ProjectPage() {
    const params = useParams();
    const id = params?.id;
    const [project, setProject] = useState<any>(null);
    const [tab, setTab] = useState<'app' | 'code' | 'overview'>('app');
    const [files, setFiles] = useState<FileNode[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

    useEffect(() => {
        if (!id) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        // Fetch Project
        fetch(`${apiUrl}/projects`)
            .then(res => res.json())
            .then(projects => {
                const found = projects.find((p: any) => p.id === id);
                if (found) setProject(found);
            })
            .catch(err => console.error(err));

        // Fetch Files
        fetch(`${apiUrl}/projects/${id}/files`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setFiles(data);
                    if (data.length > 0) setSelectedFile(data.find(f => f.path.includes('page.tsx')) || data[0]);
                }
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!project) return <div className="min-h-screen bg-slate-900 text-white p-20 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24 pb-20 flex flex-col items-center">
            <div className="max-w-6xl w-full px-6">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
                        <div className="text-sm text-slate-400">
                            Status: <span className="text-green-400 font-bold uppercase">{project.status}</span>
                        </div>
                    </div>

                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                        <button
                            onClick={() => setTab('app')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'app' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            App Preview
                        </button>
                        <button
                            onClick={() => setTab('code')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'code' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Code
                        </button>
                        <button
                            onClick={() => setTab('overview')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'overview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                            Overview
                        </button>
                    </div>
                </div>

                {tab === 'app' ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-slate-400 bg-indigo-900/30 border border-indigo-500/30 p-3 rounded-lg">
                            <span className="text-xl">✨</span>
                            This is a live interactive preview of your generated application structure and data models.
                        </div>
                        <DynamicPreview config={project.config} />
                    </div>
                ) : tab === 'overview' ? (
                    <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-xl text-center max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Ready to Ship</h2>
                        <p className="text-slate-400 mb-8">Your application configuration has been compiled and the codebase is ready.</p>

                        {project.status === 'COMPLETED' ? (
                            <a
                                href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/projects/${id}/download`}
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg transition shadow-lg shadow-indigo-500/25"
                            >
                                Download Source Code (ZIP)
                            </a>
                        ) : (
                            <p>Processing...</p>
                        )}
                    </div>
                ) : (
                    <div className="flex h-[600px] bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                        {/* File Tree */}
                        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                            <div className="p-4 border-b border-slate-800 font-mono text-xs text-slate-500 uppercase tracking-wider">Explorer</div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {files.map(f => (
                                    <button
                                        key={f.path}
                                        onClick={() => setSelectedFile(f)}
                                        className={`w-full text-left px-3 py-2 text-sm font-mono rounded ${selectedFile?.path === f.path ? 'bg-indigo-900/50 text-indigo-300' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'}`}
                                    >
                                        {f.path}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Code Viewer */}
                        <div className="flex-1 flex flex-col bg-[#0d1117]">
                            <div className="h-10 border-b border-slate-800 flex items-center px-4 text-xs font-mono text-slate-500">
                                {selectedFile?.path}
                            </div>
                            <div className="flex-1 overflow-auto p-4">
                                <pre className="font-mono text-sm text-slate-300">
                                    <code>{selectedFile?.content}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
