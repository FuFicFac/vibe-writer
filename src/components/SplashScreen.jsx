import React, { useState } from 'react';
import useStore from '../store/useStore';
import { UserPlus, UserCircle, ChevronRight, Trash2, AlertTriangle, Download } from 'lucide-react';
import { backupProfileToZip } from '../utils/backupProfile';

export default function SplashScreen() {
    const { profiles, createProfile, setActiveProfile, deleteProfile, projects, folders, documents } = useStore();
    const [newProfileName, setNewProfileName] = useState('');
    const [profileToDelete, setProfileToDelete] = useState(null);
    const [isBackingUp, setIsBackingUp] = useState(false);

    const handleCreate = (e) => {
        e.preventDefault();
        if (newProfileName.trim()) {
            createProfile(newProfileName.trim());
        }
    };

    const handleDeleteClick = (e, profile) => {
        e.stopPropagation();
        setProfileToDelete(profile);
    };

    const handleConfirmDelete = () => {
        if (profileToDelete) {
            deleteProfile(profileToDelete.id);
            setProfileToDelete(null);
        }
    };

    const handleBackup = async () => {
        if (!profileToDelete) return;
        setIsBackingUp(true);
        await backupProfileToZip(profileToDelete.id, profiles, projects, folders, documents);
        setIsBackingUp(false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-seahawks-navy flex items-center justify-center p-6 text-seahawks-gray">
            <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 items-center md:items-stretch bg-[#001730] p-8 md:p-12 rounded-2xl shadow-2xl border border-seahawks-gray/10">
                {/* Branding Side */}
                <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-4 md:pr-8 md:border-r border-seahawks-gray/20">
                    <div className="flex items-baseline select-none group cursor-default">
                        <div className="flex items-center font-black uppercase text-8xl tracking-tighter">
                            <span className="vw-text-primary transform -rotate-3 transition-transform duration-300 hover:scale-[1.2] hover:-rotate-12">V</span>
                            <span className="text-seahawks-green transform translate-y-1 transition-transform duration-300 hover:scale-[1.2] hover:rotate-6">i</span>
                            <span className="vw-text-primary transform scale-110 transition-transform duration-300 hover:scale-[1.3] hover:-rotate-6">b</span>
                            <span className="text-seahawks-gray transform -translate-y-0.5 transition-transform duration-300 hover:scale-[1.2] hover:rotate-12">e</span>
                        </div>
                    </div>
                    <div>
                        <span className="font-bold text-4xl tracking-[0.3em] text-seahawks-green uppercase opacity-90">Writer</span>
                    </div>
                    <p className="text-lg text-seahawks-gray/70 pt-4">Who is writing today?</p>
                </div>

                {/* Profiles Side */}
                <div className="flex-1 w-full flex flex-col justify-center space-y-8">
                    {profiles && profiles.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-seahawks-gray/50 uppercase tracking-widest pl-1">Select Pin Name</h3>
                            <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                                {profiles.map(profile => (
                                    <button
                                        key={profile.id}
                                        onClick={() => setActiveProfile(profile.id)}
                                        className="flex items-center justify-between p-4 rounded-xl border border-seahawks-gray/20 bg-seahawks-navy hover:bg-[#001730] hover:border-seahawks-green/50 transition-all group text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-full bg-seahawks-green/10 text-seahawks-green group-hover:bg-seahawks-green group-hover:text-[#001024] transition-colors">
                                                <UserCircle size={24} />
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-lg leading-tight">{profile.name}</div>
                                                <div className="text-xs text-seahawks-gray/50 mt-1">Last active: {new Date(profile.lastActive || profile.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ChevronRight size={20} className="text-seahawks-gray/30 group-hover:text-seahawks-green transition-colors transform group-hover:translate-x-1" />
                                            <button
                                                onClick={(e) => handleDeleteClick(e, profile)}
                                                className="p-2 -mr-2 rounded-lg text-seahawks-gray/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                title="Delete Pin Name"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className={profiles?.length > 0 ? "space-y-4 pt-6 border-t border-seahawks-gray/10" : "space-y-4"}>
                        <h3 className="text-xs font-semibold text-seahawks-gray/50 uppercase tracking-widest pl-1">
                            {profiles && profiles.length > 0 ? "Or Create New Pin Name" : "Create Your First Pin Name"}
                        </h3>
                        <form onSubmit={handleCreate} className="flex flex-col gap-3">
                            <input
                                autoFocus
                                type="text"
                                value={newProfileName}
                                onChange={(e) => setNewProfileName(e.target.value)}
                                placeholder="Enter Pin Name..."
                                className="w-full px-5 py-3.5 rounded-xl border border-seahawks-gray/20 bg-seahawks-navy text-white placeholder:text-seahawks-gray/40 focus:outline-none focus:border-seahawks-green focus:ring-1 focus:ring-seahawks-green transition-all text-lg"
                            />
                            <button
                                type="submit"
                                onClick={handleCreate}
                                disabled={!newProfileName.trim()}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-seahawks-green text-[#001024] font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <UserPlus size={20} />
                                <span>{profiles?.length > 0 ? "Add Pin Name" : "Get Started"}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Delete Warning Modal */}
            {profileToDelete && (
                <div className="fixed inset-0 z-[110] bg-[#001024]/90 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="max-w-md w-full bg-[#001730] p-8 rounded-2xl shadow-2xl border border-red-500/30">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse border border-red-500/30">
                                <AlertTriangle size={40} className="text-red-500" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-white uppercase tracking-wider animate-pulse text-red-500">Warning!</h2>
                                <p className="text-seahawks-gray text-lg">
                                    You are about to delete the Pin Name <strong className="text-white">{profileToDelete.name}</strong>.
                                </p>
                                <p className="text-red-400/90 text-sm max-w-sm mx-auto p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                    If you proceed, <strong>all projects, folders, and documents</strong> under this Pin Name will be permanently lost and cannot be recovered.
                                </p>
                            </div>

                            <div className="w-full space-y-3 pt-4 border-t border-seahawks-gray/10">
                                <button
                                    onClick={handleBackup}
                                    disabled={isBackingUp}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-seahawks-navy border border-seahawks-gray/20 text-white font-bold text-lg hover:bg-seahawks-green hover:text-[#001024] hover:border-seahawks-green transition-all"
                                >
                                    <Download size={20} />
                                    <span>{isBackingUp ? "Backing up..." : "Backup to ZIP (.md files)"}</span>
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setProfileToDelete(null)}
                                        className="flex-1 py-3.5 rounded-xl bg-seahawks-navy border border-seahawks-gray/20 text-seahawks-gray hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        className="flex-1 py-3.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        Delete Forever
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
