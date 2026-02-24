import React from 'react';
import { Sidebar as SidebarIcon, FolderOpen, FileText, Columns, FolderPlus, FilePlus, ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import useStore from '../store/useStore';

export default function Sidebar({ isOpen, onClose }) {
    const {
        activeProjectId, activeDocumentId, activeDocumentIdSecondary, splitMode,
        folders, documents,
        setActiveDocument, setActiveDocumentSecondary, toggleDocumentContext,
        createFolder, createDocument
    } = useStore();

    const [addingFolder, setAddingFolder] = React.useState(false);
    const [addingDocToFolderId, setAddingDocToFolderId] = React.useState(null);
    const [newItemName, setNewItemName] = React.useState('');
    const [collapsedFolders, setCollapsedFolders] = React.useState(new Set());

    const toggleFolderCollapse = (folderId, e) => {
        e.stopPropagation();
        setCollapsedFolders(prev => {
            const next = new Set(prev);
            if (next.has(folderId)) {
                next.delete(folderId);
            } else {
                next.add(folderId);
            }
            return next;
        });
    };

    const projectFolders = folders
        .filter(f => f.projectId === activeProjectId)
        .sort((a, b) => a.order - b.order);

    const handleAddFolderClick = () => {
        if (!activeProjectId) return;
        setAddingFolder(true);
        setNewItemName('');
    };

    const handleAddDocumentClick = (folderId, e) => {
        e.stopPropagation();
        setAddingDocToFolderId(folderId);
        setNewItemName('');
    };

    const submitNewFolder = () => {
        if (newItemName.trim() && activeProjectId) {
            createFolder(activeProjectId, newItemName.trim());
        }
        setAddingFolder(false);
        setNewItemName('');
    };

    const submitNewDocument = (folderId) => {
        if (newItemName.trim() && folderId) {
            createDocument(folderId, newItemName.trim());
            // Auto expand the folder if we just added a doc to it
            setCollapsedFolders(prev => {
                const next = new Set(prev);
                next.delete(folderId);
                return next;
            });
        }
        setAddingDocToFolderId(null);
        setNewItemName('');
    };

    const handleKeyDown = (e, type, id = null) => {
        if (e.key === 'Enter') {
            type === 'folder' ? submitNewFolder() : submitNewDocument(id);
        } else if (e.key === 'Escape') {
            type === 'folder' ? setAddingFolder(false) : setAddingDocToFolderId(null);
            setNewItemName('');
        }
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-[#001024]/50 backdrop-blur-sm z-20 md:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={clsx(
                    "vw-surface-2 border-l vw-border flex flex-col transition-all duration-300 ease-in-out z-30 shadow-2xl md:shadow-none",
                    "fixed md:relative right-0 top-0 bottom-0 h-full",
                    isOpen ? "w-80 md:w-80 opacity-100 translate-x-0" : "w-80 md:w-0 opacity-0 md:opacity-0 translate-x-full md:translate-x-0 overflow-hidden md:border-none pointer-events-none md:pointer-events-auto"
                )}
            >
                <div className="h-16 border-b vw-border flex items-center justify-between px-4 shrink-0 bg-seahawks-navy/20">
                    <div className="flex items-center gap-2 font-medium text-lg vw-text-primary">
                        <SidebarIcon size={24} className="text-seahawks-gray" />
                        <span>Binder</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handleAddFolderClick}
                            title="New Folder"
                            className="p-2 rounded-md hover:bg-seahawks-navy/50 text-seahawks-green hover:text-white transition-colors hover-rock"
                        >
                            <FolderPlus size={24} className="transition-transform duration-300" />
                        </button>
                        <div className="w-px h-6 bg-seahawks-gray/20 mx-1"></div>
                        <button
                            onClick={onClose}
                            title="Close Sidebar"
                            className="p-2 rounded-md hover:bg-seahawks-navy/50 text-seahawks-gray hover:text-white transition-colors hover-rock md:hidden"
                        >
                            <SidebarIcon size={24} className="transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {projectFolders.map(folder => {
                        const folderDocs = documents
                            .filter(d => d.folderId === folder.id)
                            .sort((a, b) => a.order - b.order);

                        const folderWordCount = folderDocs.reduce((acc, d) => acc + (d.wordCount || 0), 0);
                        const isFolderCollapsed = collapsedFolders.has(folder.id);

                        return (
                            <div key={folder.id} className="mb-2">
                                {/* FOLDER HEADER */}
                                <div
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-seahawks-gray hover:bg-seahawks-navy/50 rounded-md group cursor-pointer vw-text-primary select-none border border-transparent hover:border-seahawks-gray/10"
                                    onClick={(e) => toggleFolderCollapse(folder.id, e)}
                                >
                                    <div className="text-seahawks-gray opacity-50">
                                        {isFolderCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                    <FolderOpen size={15} className="text-seahawks-green/80" />
                                    <span className="flex-1 truncate font-medium">{folder.name}</span>
                                    <span className="text-xs text-seahawks-gray/40 font-mono hidden group-hover:inline opacity-0 transition-opacity group-hover:opacity-100 mr-1">{folderWordCount.toLocaleString()}</span>
                                    <button
                                        onClick={(e) => handleAddDocumentClick(folder.id, e)}
                                        title="New Document"
                                        className="opacity-0 group-hover:opacity-100 p-1 text-seahawks-green hover:text-white transition-all rounded hover:bg-seahawks-navy/80"
                                    >
                                        <FilePlus size={14} />
                                    </button>
                                </div>

                                {/* FOLDER CONTENTS (DOCS) */}
                                {!isFolderCollapsed && (
                                    <div className="ml-5 mt-0.5 space-y-0.5 border-l vw-border-soft pl-[15px]">
                                        {folderDocs.map(doc => {
                                            const isPrimary = doc.id === activeDocumentId;
                                            const isSecondary = doc.id === activeDocumentIdSecondary;
                                            const isActive = isPrimary || isSecondary;
                                            return (
                                                <div
                                                    key={doc.id}
                                                    onClick={() => setActiveDocument(doc.id)}
                                                    className={clsx(
                                                        "flex items-center gap-2 px-2 py-1 text-sm rounded-md cursor-pointer group transition-colors",
                                                        isActive ? "bg-seahawks-navy text-white font-medium border border-seahawks-gray/20 shadow-sm" : "text-seahawks-gray/80 hover:bg-seahawks-navy/40 border border-transparent"
                                                    )}
                                                >
                                                    <FileText size={13} className={isActive ? "text-seahawks-green" : "opacity-40 group-hover:opacity-100 transition-opacity"} />
                                                    <span className="flex-1 truncate">{doc.name}</span>

                                                    {/* Open in Split View button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveDocumentSecondary(doc.id);
                                                        }}
                                                        title="Open in Right Pane"
                                                        className="opacity-0 group-hover:opacity-100 hover:text-white text-seahawks-gray/50 p-0.5 transition-opacity bg-seahawks-navy/30 rounded"
                                                    >
                                                        <Columns size={12} />
                                                    </button>

                                                    <span className="text-[10px] opacity-40 font-mono text-seahawks-gray">{(doc.wordCount || 0).toLocaleString()}</span>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDocumentContext(doc.id);
                                                        }}
                                                        title={doc.includeInContext ? "Included in AI Context" : "Excluded from AI Context"}
                                                        className={clsx(
                                                            "w-6 h-3 rounded-full relative shadow-inner border transition-colors hidden group-hover:block",
                                                            doc.includeInContext
                                                                ? "bg-seahawks-green/20 border-seahawks-green/30"
                                                                : "bg-seahawks-navy border-seahawks-gray/20"
                                                        )}
                                                    >
                                                        <div className={clsx(
                                                            "w-2 h-2 rounded-full absolute top-[1px] shadow-sm transition-all",
                                                            doc.includeInContext ? "bg-seahawks-green right-[1px]" : "bg-white left-[1px]"
                                                        )} />
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        {addingDocToFolderId === folder.id && (
                                            <div className="flex items-center gap-2 px-2 py-1 text-sm rounded-md bg-seahawks-navy/50 text-white border border-seahawks-green/30 mt-1 shadow-inner">
                                                <FileText size={13} className="text-seahawks-green opacity-80" />
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={newItemName}
                                                    onChange={(e) => setNewItemName(e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(e, 'doc', folder.id)}
                                                    onBlur={() => submitNewDocument(folder.id)}
                                                    placeholder="Document Name (Enter to save)"
                                                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-seahawks-gray/40 w-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {addingFolder && (
                        <div className="mb-2">
                            <div className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg bg-[#001730] text-white border border-seahawks-green/50 shadow-[0_0_15px_rgba(105,190,40,0.1)]">
                                <FolderPlus size={18} className="text-seahawks-green motion-safe:animate-pulse" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'folder')}
                                    onBlur={submitNewFolder}
                                    placeholder="New Folder Name (Enter to save)"
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-white font-bold placeholder:text-seahawks-gray/40 placeholder:font-normal w-full"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </aside >
        </>
    );
}
