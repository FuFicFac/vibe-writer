import React, { useState } from 'react';
import { FolderPlus, BookOpen, ChevronLeft, ArrowRight, Clock } from 'lucide-react';
import useStore from '../store/useStore';
import clsx from 'clsx';

export default function ProjectScreen() {
    const {
        profiles,
        activeProfileId,
        projects,
        setActiveProject,
        setActiveProfile,
        createProject,
        documents,
        folders
    } = useStore();

    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    const activeProfile = profiles?.find(p => p.id === activeProfileId);

    // Get projects for this profile
    const profileProjects = projects
        .filter(p => !p.profileId || p.profileId === activeProfileId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Newest first

    const handleCreate = (e) => {
        e.preventDefault();
        if (newProjectName.trim()) {
            createProject(newProjectName.trim());
            // It automatically sets activeProjectId in the store, but wait, we changed it!
            // Actually, we didn't change createProject in useStore, we only changed createProfile.
            // Let's manually set the newly created project as active. The store `createProject` does update `activeProjectId`. Wait, let me check. If it does, App.jsx will unmount ProjectScreen.
        }
    };

    if (!activeProfile) return null;

    return (
        <div className="fixed inset-0 bg-[#001024] flex items-center justify-center z-50 p-4 font-sans animate-in fade-in duration-500">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-seahawks-green/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-seahawks-green/5 blur-[120px] rounded-full" />
            </div>

            <div className="bg-seahawks-navy/80 backdrop-blur-xl border border-seahawks-green/20 rounded-2xl p-8 md:p-12 w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-seahawks-gray/10 shrink-0">
                    <div>
                        <button
                            onClick={() => setActiveProfile(null)}
                            className="flex items-center gap-1.5 text-seahawks-gray/60 hover:text-white transition-colors mb-4 group text-sm font-medium"
                        >
                            <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                            Back to Pin Names
                        </button>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome back, <span className="text-seahawks-green">{activeProfile.name}</span>
                        </h1>
                        <p className="text-seahawks-gray">Select a project to continue writing, or start something new.</p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Create New Project Section */}
                    <div className="mb-8">
                        {!isCreating ? (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full relative group overflow-hidden rounded-xl border border-dashed border-seahawks-green/30 bg-seahawks-navy/30 hover:bg-seahawks-green/10 transition-all p-6 flex flex-col items-center justify-center gap-3"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-seahawks-green/0 via-seahawks-green/5 to-seahawks-green/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="p-3 rounded-full bg-seahawks-green/20 text-seahawks-green group-hover:scale-110 transition-transform">
                                    <FolderPlus size={28} />
                                </div>
                                <span className="text-lg font-bold text-seahawks-green">Create New Project</span>
                            </button>
                        ) : (
                            <form onSubmit={handleCreate} className="bg-seahawks-navy/50 border border-seahawks-green/40 p-6 rounded-xl animate-in slide-in-from-top-4 duration-300">
                                <h3 className="text-white font-medium mb-4">Name your new project</h3>
                                <div className="flex gap-3">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="E.g., The Great American Novel..."
                                        className="flex-1 bg-[#001024] border border-seahawks-gray/20 rounded-lg px-4 py-3 text-white placeholder-seahawks-gray/50 focus:outline-none focus:border-seahawks-green/50 transition-colors"
                                        value={newProjectName}
                                        onChange={(e) => setNewProjectName(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newProjectName.trim()}
                                        className="bg-seahawks-green hover:bg-[#58a535] text-[#001024] font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create <ArrowRight size={18} />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewProjectName('');
                                    }}
                                    className="text-seahawks-gray/60 hover:text-white text-sm mt-4 font-medium"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Project List */}
                    {profileProjects.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-white mb-4">Your Projects</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profileProjects.map(project => {
                                    // Calculate simplistic stats
                                    const projFolders = folders.filter(f => f.projectId === project.id);
                                    const projDocs = documents.filter(d => projFolders.some(f => f.id === d.folderId));
                                    const wordCount = projDocs.reduce((acc, d) => acc + (d.wordCount || 0), 0);

                                    // Format date
                                    const dateStr = new Date(project.updatedAt || project.createdAt).toLocaleDateString(undefined, {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    });

                                    return (
                                        <button
                                            key={project.id}
                                            onClick={() => setActiveProject(project.id)}
                                            className="text-left bg-[#001024]/60 hover:bg-[#001024] border border-seahawks-gray/10 hover:border-seahawks-green/40 p-5 rounded-xl transition-all group relative overflow-hidden flex flex-col h-full"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-seahawks-green opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="flex items-start justify-between mb-3">
                                                <div className="p-2 rounded-lg bg-seahawks-navy text-seahawks-green group-hover:bg-seahawks-green/20 transition-colors">
                                                    <BookOpen size={20} />
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-seahawks-gray/50 bg-seahawks-navy/30 px-2 py-1 rounded-md">
                                                    <Clock size={12} />
                                                    {dateStr}
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-seahawks-green transition-colors line-clamp-1">{project.name}</h3>

                                            <div className="mt-auto pt-4 flex items-center gap-4 text-sm text-seahawks-gray font-mono">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="opacity-50">Docs:</span>
                                                    <span className="text-white/80">{projDocs.length}</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-seahawks-gray/30" />
                                                <div className="flex items-center gap-1.5">
                                                    <span className="opacity-50">Words:</span>
                                                    <span className="text-white/80">{wordCount.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(105, 190, 40, 0.3);
                }
            `}</style>
        </div>
    );
}
