
import React, { useMemo, useState, useEffect } from 'react';
import { Product, UserProfile } from '../types';
import { getBuyingDecision } from '../services/geminiService';
import { Check, X, AlertTriangle, ShieldCheck, Zap, AlertOctagon, TrendingUp, DollarSign, Clock, ArrowRight, Lock, Sparkles, ExternalLink, Globe } from 'lucide-react';

interface BuyingAssistantProps {
  product: Product;
  user: UserProfile;
  shelf: Product[];
  onAddToShelf: () => void;
  onDiscard: () => void;
  onUnlockPremium: () => void;
}

const BuyingAssistant: React.FC<BuyingAssistantProps> = ({ product, user, shelf, onAddToShelf, onDiscard, onUnlockPremium }) => {
  const [isUnlocked, setIsUnlocked] = useState(!!user.isPremium);
  
  useEffect(() => {
    setIsUnlocked(!!user.isPremium);
  }, [user.isPremium]);

  const decisionData = useMemo(() => {
    return getBuyingDecision(product, shelf, user);
  }, [product, shelf, user]);

  const { verdict, audit, shelfConflicts, comparison } = decisionData;

  const getVerdictIcon = () => {
      switch(verdict.decision) {
          case 'AVOID': return <X size={20} className="text-white" />;
          case 'CAUTION': return <AlertTriangle size={20} className="text-white" />;
          default: return <Check size={20} className="text-white" />;
      }
  };

  const getVerdictGradient = () => {
      switch(verdict.color) {
          case 'rose': return 'from-rose-500 to-red-600';
          case 'amber': return 'from-amber-400 to-orange-500';
          default: return 'from-teal-500 to-emerald-600';
      }
  };

  return (
    <div className={`min-h-screen pb-32 animate-in slide-in-from-bottom-8 duration-500 bg-zinc-50`}>
        <div className="pt-12 px-6 pb-6 bg-white rounded-b-[2.5rem] shadow-sm border-b border-zinc-100 relative overflow-hidden z-20">
            <button onClick={onDiscard} className="absolute top-6 left-6 p-2 bg-zinc-100 rounded-full text-zinc-500 hover:bg-zinc-200 transition-colors z-10">
                <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center relative z-10 mt-4">
                <div className="w-16 h-16 bg-white border border-zinc-100 shadow-lg rounded-2xl flex items-center justify-center mb-4">
                     <span className="text-2xl">🧴</span>
                </div>
                <h1 className="text-xl font-black text-zinc-900 leading-tight mb-1 max-w-xs">{product.name}</h1>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{product.brand || 'Unknown Brand'}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 rounded-lg">
                    <span className="text-[10px] font-black text-zinc-900 uppercase mr-1">RM</span>
                    <span className="text-sm font-black text-zinc-900">{product.estimatedPrice || '??'}</span>
                    <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-1 rounded ml-1">Live Search</span>
                </div>
            </div>
        </div>

        <div className="relative">
            <div className="px-6 -mt-6 relative z-20">
                <div className={`rounded-[2rem] p-5 text-white shadow-xl bg-gradient-to-br ${getVerdictGradient()} relative overflow-hidden`}>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                            {getVerdictIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-80 block mb-0.5">Ground Truth Verdict</span>
                            <h2 className="text-xl font-black tracking-tight leading-none truncate">{verdict.title}</h2>
                        </div>
                        <div className="text-right bg-black/10 px-3 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                            <span className="block text-[9px] font-bold uppercase tracking-wide opacity-80 mb-0.5">Match</span>
                            <span className="text-xl font-black leading-none">{product.suitabilityScore}%</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 relative z-10">
                        <p className="text-xs font-medium leading-relaxed opacity-95">{verdict.description}</p>
                    </div>
                </div>
            </div>

            <div className="relative mt-6 px-6 space-y-4">
                 {/* VERIFIED SOURCES SECTION */}
                 {product.sourceUrls && product.sourceUrls.length > 0 && (
                     <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-100 shadow-sm animate-in fade-in duration-700">
                         <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <Globe size={14} className="text-teal-500" /> Verified Data Sources
                         </h3>
                         <div className="space-y-2">
                             {product.sourceUrls.map((source, i) => (
                                 <a 
                                     key={i} 
                                     href={source.uri} 
                                     target="_blank" 
                                     rel="noopener noreferrer"
                                     className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-teal-200 transition-colors group"
                                 >
                                     <span className="text-xs font-bold text-zinc-600 truncate mr-4">{source.title}</span>
                                     <ExternalLink size={12} className="text-zinc-400 group-hover:text-teal-500 shrink-0" />
                                 </a>
                             ))}
                         </div>
                     </div>
                 )}

                 {/* Premium Overlay for other details */}
                 {!isUnlocked && (
                     <div className="p-8 bg-white rounded-[2rem] border border-zinc-100 text-center relative overflow-hidden">
                         <Lock className="mx-auto mb-4 text-teal-600" size={24} />
                         <h3 className="text-lg font-black text-zinc-900 mb-2">Reveal Deep Analysis</h3>
                         <p className="text-xs text-zinc-500 mb-6">See safety risks, ingredient breakdowns, and local store comparisons.</p>
                         <button 
                            onClick={onUnlockPremium}
                            className="bg-zinc-900 text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                         >
                            <Sparkles size={12} className="inline mr-2 text-amber-400" /> Reveal Details
                         </button>
                     </div>
                 )}

                 {isUnlocked && (
                    <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-100 shadow-sm">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-3">Ground Ingredients</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.ingredients.slice(0, 10).map((ing, i) => (
                                <span key={i} className="px-3 py-1.5 bg-zinc-50 text-zinc-600 text-[9px] font-black rounded-lg uppercase border border-zinc-100">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                 )}
            </div>
        </div>

        {isUnlocked && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-zinc-100 z-50 pb-safe">
                <div className="flex gap-3 max-w-md mx-auto">
                    <button onClick={onDiscard} className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold text-sm">Cancel</button>
                    <button onClick={onAddToShelf} className="flex-[2] py-4 bg-teal-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-500/20">Add to Routine <ArrowRight size={18} className="inline ml-1" /></button>
                </div>
            </div>
        )}
    </div>
  );
};

export default BuyingAssistant;
