import React, { useEffect, useState } from 'react';
import { DishOption } from '../types';

interface AssemblyAnimationProps {
  dish: DishOption;
  onAnimationComplete: () => void;
}

const AssemblyAnimation: React.FC<AssemblyAnimationProps> = ({ dish, onAnimationComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence the animation steps
    const timers: ReturnType<typeof setTimeout>[] = [];
    
    timers.push(setTimeout(() => setStep(1), 100)); // Base
    timers.push(setTimeout(() => setStep(2), 1200)); // Mid
    timers.push(setTimeout(() => setStep(3), 2400)); // Top
    timers.push(setTimeout(() => onAnimationComplete(), 4000)); // Finish

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onAnimationComplete]);

  // Styles for the "3D" elements
  const layerBaseClass = "absolute inset-0 m-auto rounded-full transition-all duration-1000 ease-out preserve-3d shadow-xl border border-white/10";
  
  // Tart Assets (CSS approximations)
  const tartBase = "bg-amber-200 w-64 h-64 shadow-[0_20px_50px_rgba(0,0,0,0.5)]";
  const tartMid = "bg-yellow-100 w-56 h-56 opacity-90";
  const tartTop = "bg-gradient-to-tr from-amber-500 to-yellow-400 w-48 h-48 border-4 border-amber-300 opacity-90"; // Spiral abstract

  // Ring Assets (CSS approximations)
  const ringBase = "bg-stone-800 w-64 h-64 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"; // Seaweed
  const ringMid = "bg-zinc-100 w-52 h-52 ring-8 ring-zinc-200"; // Rice
  const ringTop = "bg-gradient-to-br from-pink-400 to-rose-600 w-40 h-40 rounded-full border-dashed border-4 border-white/50"; // Radish/Prosciutto

  const isTart = dish.id === 'tart';

  return (
    <div className="w-full h-full flex items-center justify-center perspective-container overflow-hidden bg-stone-900/50 backdrop-blur-sm">
      <div className="relative w-80 h-80 preserve-3d animate-[spin_10s_linear_infinite_reverse]" style={{ transform: 'rotateX(60deg) rotateZ(45deg)' }}>
        
        {/* Layer 1: Base */}
        <div 
          className={`${layerBaseClass} ${isTart ? tartBase : ringBase}`}
          style={{ 
            transform: step >= 1 ? 'translateZ(0px)' : 'translateZ(-400px)',
            opacity: step >= 1 ? 1 : 0
          }}
        >
            <div className="absolute inset-0 flex items-center justify-center text-white/20 font-serif text-4xl">
                {isTart ? "Crust" : "Nori"}
            </div>
        </div>

        {/* Layer 2: Middle */}
        <div 
          className={`${layerBaseClass} ${isTart ? tartMid : ringMid}`}
          style={{ 
            transform: step >= 2 ? 'translateZ(40px)' : 'translateZ(400px) rotateZ(180deg)',
            opacity: step >= 2 ? 1 : 0
          }}
        >
             <div className="absolute inset-0 flex items-center justify-center text-black/20 font-serif text-2xl">
                {isTart ? "Cream" : "Rice"}
            </div>
        </div>

        {/* Layer 3: Top/Garnish */}
        <div 
          className={`${layerBaseClass} ${isTart ? tartTop : ringTop}`}
          style={{ 
            transform: step >= 3 ? 'translateZ(80px)' : 'translateZ(800px) scale(0.5)',
            opacity: step >= 3 ? 1 : 0
          }}
        >
             {/* Decorative inner for spiral/flower effect */}
             <div className={`w-full h-full rounded-full border-4 border-white/30 ${isTart ? 'border-dashed' : 'border-dotted'}`} />
        </div>
        
        {/* Floating Particles/Dust */}
        <div className={`absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping" />
            <div className="absolute bottom-10 right-10 w-3 h-3 bg-amber-200 rounded-full animate-ping delay-300" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-white/10 rounded-full animate-pulse" style={{ transform: 'translateZ(100px)'}} />
        </div>

      </div>
      
      <div className="absolute bottom-10 text-stone-300 font-serif text-lg tracking-widest animate-pulse">
        ASSEMBLING {isTart ? "ROSETTE" : "PETALS"}...
      </div>
    </div>
  );
};

export default AssemblyAnimation;