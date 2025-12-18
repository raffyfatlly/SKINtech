
import React, { useMemo, useState, useEffect } from 'react';
import { Product, UserProfile } from '../types';
import { getBuyingDecision } from '../services/geminiService';
import { Check, X, AlertTriangle, ShieldCheck, Zap, AlertOctagon, TrendingUp, DollarSign, Clock, ArrowRight, Lock, Sparkles, ExternalLink, Globe, Info, Microscope, ListChecks, ThumbsUp, ThumbsDown, Crown, Pipette, Droplet, FlaskConical, Shield, Sun } from 'lucide-react';

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

  const getProductTypeIcon = () => {
      const type = product.type;
      const size = 48;
      const stroke = 1.2;
      switch(type) {
          case 'SERUM': return <Pipette size={size} strokeWidth={stroke} />;
          case 'MOISTURIZER': return <Droplet size={size} strokeWidth={stroke} />;
          case 'CLEANSER': return <FlaskConical size={size} strokeWidth={stroke} />;
          case 'SPF': return <Sun size={size} strokeWidth={stroke} />;
          case 'TREATMENT': return <Shield size={size} strokeWidth={stroke} />;
          default: return <Zap size={size} strokeWidth={stroke} />;
      }
  };

  const BlurOverlay = ({ title }: { title: string }) => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2.5rem] p-6 text-center group cursor-pointer border border-white/20" onClick={onUnlockPremium}>
        <div className="w-12 h-12 bg-teal-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
            <Lock size={20} />
        </div>
        <p className="text-xs font-black text-teal-900 uppercase tracking-widest mb-1">{title} Locked</p>
        <div className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-teal-700 bg-white px-3 py-1 rounded-full shadow-sm border border-teal-100">
             <Crown size={10} className="text-amber-500" /> UNLOCK TO REVEAL
        </div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-48 animate-in slide-in-from-bottom-8 duration-500 bg-zinc-50`}>
        {/* HEADER - CLINICAL TEAL STYLE */}
        <div 
            className="pt-12 px-6 pb-12 rounded-b-[3.5rem] relative overflow-hidden shadow-xl"
            style={{ backgroundColor: 'rgb(163, 206, 207)' }}
        >
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none mix-blend-overlay"></div>

            <button onClick={onDiscard} className="absolute top-6 left-6 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors z-30 border border-white/20">
                <X size={20} />
            </button>

            {/* DYNAMIC ICON HERO */}
            <div className="flex flex-col items-center text-center relative z-10">
                <div className="relative w-44 h-44 bg-white rounded-[3rem] mb-6 shadow-2xl flex items-center justify-center text-teal-500 p-8 group transition-all hover:scale-105">
                    <div className="absolute inset-4 border-2 border-teal-50 rounded-[2.5rem] opacity-50 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 animate-in zoom-in duration-700 drop-shadow-sm">
                        {getProductTypeIcon()}
                    </div>
                </div>

                <h1 className="text-3xl font-black text-white leading-none mb-2 tracking-tighter drop-shadow-md">{product.name}</h1>
                <p className="text-xs font-black text-teal-50 uppercase tracking-widest mb-6 opacity-90 drop-shadow-sm">{product.brand || 'Clinical Formulation'}</p>
                
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Est. Market Price</span>
                    <div className="w-px h-3 bg-white/30"></div>
                    <span className="text-lg font-black text-white tracking-tight">RM {product.estimatedPrice || '??'}</span>
                </div>
            </div>
        </div>

        {/* HERO MATCH CARD */}
        <div className="relative px-6 -mt-8 z-30">
            <div className={`rounded-[2.5rem] p-6 text-white shadow-2xl bg-gradient-to-br ${getVerdictGradient()} relative overflow-hidden ring-4 ring-white/50`}>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                        {getVerdictIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-0.5">Clinical Compatibility</span>
                        <h2 className="text-2xl font-black tracking-tighter leading-none truncate">{verdict.title}</h2>
                    </div>
                    <div className="text-right bg-black/10 px-4 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <span className="block text-[10px] font-bold uppercase tracking-wide opacity-80 mb-0.5">Match</span>
                        <span className="text-2xl font-black leading-none">{product.suitabilityScore}%</span>
                    </div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 relative z-10">
                    <p className="text-sm font-medium leading-relaxed opacity-95">{verdict.description}</p>
                </div>
            </div>
        </div>

        {/* ANALYSIS DATA */}
        <div className="mt-8 px-6 space-y-6 pb-12 relative z-20">
             
             {/* SCIENTIFIC VERDICT - BLURRED FOR GUESTS */}
             <div className="bg-white p-7 rounded-[2.5rem] border border-zinc-100 shadow-sm relative overflow-hidden min-h-[160px]">
                {!isUnlocked && <BlurOverlay title="Clinical Review" />}
                <h3 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Microscope size={14} /> AI Clinical Review
                </h3>
                <p className="text-sm text-zinc-700 font-medium leading-relaxed italic select-none">
                    "{product.scientificVerdict || "Detailed molecular analysis of this formulation against your specific biometric biomarkers suggests a highly targeted response for surface texture refinement."}"
                </p>
             </div>

             {/* PROS & CONS - BLURRED FOR GUESTS */}
             <div className="grid grid-cols-1 gap-4 relative min-h-[160px]">
                {!isUnlocked && <BlurOverlay title="Deep Analysis" />}
                {product.pros && product.pros.length > 0 && (
                    <div className="bg-emerald-50/50 p-7 rounded-[2.5rem] border border-emerald-100/50">
                        <h4 className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ThumbsUp size={14} /> Personalized Pros
                        </h4>
                        <ul className="space-y-3">
                            {product.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs font-semibold text-emerald-800">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div> {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {product.cons && product.cons.length > 0 && (
                    <div className="bg-rose-50/50 p-7 rounded-[2.5rem] border border-rose-100/50">
                        <h4 className="text-[11px] font-bold text-rose-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ThumbsDown size={14} /> Potential Risks
                        </h4>
                        <ul className="space-y-3">
                            {product.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs font-semibold text-rose-800">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5"></div> {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
             </div>

             {/* STRATEGY - BLURRED FOR GUESTS */}
             <div className="bg-white p-7 rounded-[2.5rem] border border-zinc-100 shadow-sm relative overflow-hidden min-h-[120px]">
                {!isUnlocked && <BlurOverlay title="Routine Strategy" />}
                <h3 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Clock size={14} /> Optimal Integration
                </h3>
                <p className="text-sm text-zinc-600 font-bold leading-relaxed relative z-20 select-none">
                    {product.usageAdvice || "Integrate this formulation gradually into your evening cycle to minimize potential sensitivity spikes while maximizing active ingredient absorption."}
                </p>
             </div>

             {/* SOURCES - ALWAYS VISIBLE */}
             {product.sourceUrls && product.sourceUrls.length > 0 && (
                 <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                     <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Globe size={14} className="text-teal-500" /> Evidence Sources
                     </h3>
                     <div className="space-y-2">
                         {product.sourceUrls.map((source, i) => (
                             <a 
                                 key={i} 
                                 href={source.uri} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-teal-200 group transition-all"
                             >
                                 <span className="text-xs font-bold text-zinc-600 truncate mr-4">{source.title}</span>
                                 <ExternalLink size={12} className="text-zinc-300 group-hover:text-teal-500 shrink-0" />
                             </a>
                         ))}
                     </div>
                 </div>
             )}

             {/* PREMIUM CALLOUT */}
             {!isUnlocked && (
                 <div className="p-8 bg-white rounded-[2.5rem] border border-teal-100 text-center relative overflow-hidden shadow-xl shadow-teal-500/5 animate-in zoom-in-95">
                     <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-teal-600 border border-teal-100 rotate-6 shadow-inner">
                         <Crown size={32} />
                     </div>
                     <h3 className="text-2xl font-black text-zinc-900 mb-2 tracking-tighter">Holistic Profile Locked</h3>
                     <p className="text-xs text-zinc-500 mb-8 max-w-xs mx-auto font-medium leading-relaxed">
                        Reveal the full scientific breakdown, including Fungal Acne safety, Comedogenic ratings, and deep ingredient synergies tailored to your skin state.
                     </p>
                     <button 
                        onClick={onUnlockPremium}
                        className="w-full bg-zinc-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-zinc-900/10 flex items-center justify-center gap-3"
                     >
                        <Sparkles size={16} className="text-amber-400 fill-amber-400" /> Reveal Deep Analysis
                     </button>
                 </div>
             )}

             {/* INGREDIENTS LIST - VISIBLE IF UNLOCKED */}
             {isUnlocked && (
                <div className="bg-white p-7 rounded-[2.5rem] border border-zinc-100 shadow-sm animate-in fade-in">
                    <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                        <ListChecks size={14} className="text-teal-600" /> Full INCI Profile
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ing, i) => (
                            <span key={i} className="px-4 py-2.5 bg-zinc-50 text-zinc-600 text-[10px] font-black rounded-xl uppercase border border-zinc-100">
                                {ing}
                            </span>
                        ))}
                    </div>
                </div>
             )}
        </div>

        {/* FOOTER - LIGHT THEMED RESTORED */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-xl border-t border-zinc-100 z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="flex gap-4 max-w-md mx-auto">
                <button onClick={onDiscard} className="flex-1 py-5 bg-zinc-100 text-zinc-600 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors">Discard</button>
                <button 
                    onClick={onAddToShelf} 
                    className={`flex-[2] py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3
                        ${isUnlocked ? 'bg-teal-500 text-white shadow-teal-500/20' : 'bg-zinc-200 text-zinc-400 grayscale cursor-not-allowed'}
                    `}
                    disabled={!isUnlocked}
                >
                    Save Match <ArrowRight size={18} />
                </button>
            </div>
            {!isUnlocked && (
                <p className="text-center mt-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Premium required for routine saving</p>
            )}
        </div>
    </div>
  );
};

export default BuyingAssistant;
