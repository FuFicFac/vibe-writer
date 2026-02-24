import React from 'react';
import { BookOpen, FolderOpen, FileText } from 'lucide-react';

export default function WelcomeModal({ isOpen, onClose, profileName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-[#001024]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-seahawks-green/30 bg-seahawks-navy shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-seahawks-green/10 flex items-center justify-center mx-auto mb-6">
                        <BookOpen size={32} className="text-seahawks-green" />
                    </div>

                    <h2 className="text-2xl font-bold text-white">
                        Welcome, {profileName}!
                    </h2>

                    <p className="text-seahawks-gray">
                        You're all set up with your first project. To get started, open the <strong className="text-white">Binder</strong> (the sidebar menu).
                    </p>

                    <div className="bg-[#001730] p-4 rounded-xl text-left border border-seahawks-gray/10 space-y-3 mt-6">
                        <div className="flex items-start gap-3">
                            <FolderOpen size={18} className="text-seahawks-green shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <span className="font-semibold text-white block">Folders</span>
                                <span className="text-seahawks-gray">Organize your chapters, notes, and world-building materials.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <FileText size={18} className="text-seahawks-green shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <span className="font-semibold text-white block">Documents</span>
                                <span className="text-seahawks-gray">Write your actual content here. We've started you with a blank slate.</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-seahawks-green text-[#001024] font-bold text-lg hover:bg-white transition-colors"
                        >
                            I got it! Let's write.
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
