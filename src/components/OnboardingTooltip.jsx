import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function OnboardingTooltip({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="absolute right-14 top-1/2 -translate-y-1/2 z-40 flex items-center animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-seahawks-green text-[#001024] font-bold px-4 py-2 rounded-xl shadow-lg shadow-seahawks-green/20 border border-seahawks-green/50 whitespace-nowrap">
                Start here
            </div>
            <div className="text-seahawks-green animate-bounce ml-2 relative">
                <ArrowRight size={24} className="drop-shadow-md" />
            </div>
        </div>
    );
}
