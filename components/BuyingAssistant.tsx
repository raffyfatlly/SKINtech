
import React, { useMemo, useState, useEffect } from 'react';
import { Product, UserProfile } from '../types';
import { getBuyingDecision } from '../services/geminiService';
import { Check, X, AlertTriangle, ShieldCheck, Zap, AlertOctagon, TrendingUp, DollarSign, Clock, ArrowRight, Lock, Sparkles, ExternalLink, Globe, Info, Microscope, ListChecks, ThumbsUp, ThumbsDown } from 'lucide-react';

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

  const { verdict, audit } = decisionData;

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
    <div className={`min-h-screen pb-48 animate-in slide-in-from-bottom-8 duration-500 bg-zinc-50`}>
        {/* HEADER */}
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
                    <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-1 rounded ml-1">Live Price</span>
                </div>
            </div>
        </div>

        {/* HERO VERDICT */}
        <div className="relative">
            <div className="px-6 -mt-6 relative z-20">
                <div className={`rounded-[2rem] p-5 text-white shadow-xl bg-gradient-to-br ${getVerdictGradient()} relative overflow-hidden`}>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                            {getVerdictIcon()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-80 block mb-0.5">Holistic Match Verdict</span>
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

            {/* DEEP ANALYSIS CONTENT */}
            <div className="relative mt-6 px-6 space-y-4 pb-12">
                 
                 {/* SCIENTIFIC VERDICT */}
                 {isUnlocked && product.scientificVerdict && (
                    <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Microscope size={14} /> Clinical Review
                        </h3>
                        <p className="text-sm text-zinc-700 font-medium leading-relaxed italic">
                            "{product.scientificVerdict}"
                        </p>
                    </div>
                 )}

                 {/* PROS & CONS GRID */}
                 {isUnlocked && (product.pros?.length || product.cons?.length) && (
                     <div className="grid grid-cols-1 gap-4">
                        {product.pros && product.pros.length > 0 && (
                            <div className="bg-emerald-50/50 p-5 rounded-[2rem] border border-emerald-100">
                                <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ThumbsUp size={12} /> Key Benefits for You
                                </h4>
                                <ul className="space-y-2">
                                    {product.pros.map((pro, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs font-medium text-emerald-800">
                                            <span className="text-emerald-400 mt-1">•</span> {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {product.cons && product.cons.length > 0 && (
                            <div className="bg-rose-50/50 p-5 rounded-[2rem] border border-rose-100">
                                <h4 className="text-[10px] font-bold text-rose-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ThumbsDown size={12} /> Potential Conflicts
                                </h4>
                                <ul className="space-y-2">
                                    {product.cons.map((con, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs font-medium text-rose-800">
                                            <span className="text-rose-400 mt-1">•</span> {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                     </div>
                 )}

                 {/* USAGE ADVICE */}
                 {isUnlocked && product.usageAdvice && (
                     <div className="bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <h3 className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Clock size={14} /> Usage Strategy
                        </h3>
                        <p className="text-sm font-medium leading-relaxed">
                            {product.usageAdvice}
                        </p>
                     </div>
                 )}

                 {/* VERIFIED SOURCES */}
                 {product.sourceUrls && product.sourceUrls.length > 0 && (
                     <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-100 shadow-sm">
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
                                     className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-100 hover:border-teal-200 group"
                                 >
                                     <span className="text-xs font-bold text-zinc-600 truncate mr-4">{source.title}</span>
                                     <ExternalLink size={12} className="text-zinc-400 group-hover:text-teal-500 shrink-0" />
                                 </a>
                             ))}
                         </div>
                     </div>
                 )}

                 {/* Premium Paywall */}
                 {!isUnlocked && (
                     <div className="p-8 bg-white rounded-[2rem] border border-zinc-100 text-center relative overflow-hidden shadow-sm">
                         <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600 border border-teal-100">
                             <Lock size={20} />
                         </div>
                         <h3 className="text-lg font-black text-zinc-900 mb-2">Unlock Deep Analysis</h3>
                         <p className="text-xs text-zinc-500 mb-6 max-w-xs mx-auto">Get a full scientific verdict, fungal acne triggers, comedogenic ratings, and specific pros/cons for your skin profile.</p>
                         <button 
                            onClick={onUnlockPremium}
                            className="bg-zinc-900 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-zinc-900/10"
                         >
                            <Sparkles size={12} className="inline mr-2 text-amber-400" /> Reveal Full Report
                         </button>
                     </div>
                 )}

                 {/* Ingredient Pills */}
                 {isUnlocked && (
                    <div className="bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm">
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ListChecks size={14} /> Full INCI Profile
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {product.ingredients.map((ing, i) => (
                                <span key={i} className="px-3 py-1.5 bg-zinc-50 text-zinc-600 text-[10px] font-black rounded-lg uppercase border border-zinc-100">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                 )}
            </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-zinc-100 z-50 pb-safe">
            <div className="flex gap-3 max-w-md mx-auto">
                <button onClick={onDiscard} className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-bold text-sm hover:bg-zinc-200 transition-colors">Cancel</button>
                <button 
                    onClick={onAddToShelf} 
                    className={`flex-[2] py-4 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                        ${isUnlocked ? 'bg-teal-500 text-white shadow-teal-500/20' : 'bg-zinc-200 text-zinc-400 grayscale cursor-not-allowed'}
                    `}
                    disabled={!isUnlocked}
                >
                    Add to Routine <ArrowRight size={18} />
                </button>
            </div>
            {!isUnlocked && (
                <p className="text-center mt-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Premium membership required to add products</p>
            )}
        </div>
    </div>
  );
};

export default BuyingAssistant;
