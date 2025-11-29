import React, { useState, useCallback } from 'react';
import { DISH_OPTIONS, AppState } from './types';
import { generateDishImage } from './services/geminiService';
import DishSelector from './components/DishSelector';
import AssemblyAnimation from './components/AssemblyAnimation';
import { Camera, Sparkles, ChefHat } from 'lucide-react';

const App: React.FC = () => {
  const [selectedDishId, setSelectedDishId] = useState<'tart' | 'ring'>('tart');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedDish = DISH_OPTIONS.find(d => d.id === selectedDishId) || DISH_OPTIONS[0];

  const handleCreate = useCallback(async () => {
    if (appState !== AppState.IDLE && appState !== AppState.COMPLETE && appState !== AppState.ERROR) return;

    setAppState(AppState.ASSEMBLING);
    setGeneratedImage(null);
    setErrorMsg(null);

    // Start Generation in background while animation plays
    // We don't await here immediately to let animation start
    const generationPromise = generateDishImage(selectedDish.prompt)
      .then((imgData) => {
        return imgData;
      })
      .catch((err) => {
        console.error(err);
        return null; // Handle error later
      });

    // We store the promise to handle it after animation signals "ready"
    // For simplicity in this demo, we'll just wait for both.
    
    // However, to keep the React state clean, let's just trigger the API call
    // and store the result in a temp state or Ref if we were strictly optimizing,
    // but here we can just wait for the animation to finish visuals, then show image if ready.
    // To make it feel responsive, we'll actually wait for the animation callback to finalize the state.
    
    // We attach the promise to the window or a ref in a real app, 
    // but here let's just define a completion handler that checks both.
    
    try {
        const image = await generationPromise;
        if (!image) {
            setErrorMsg("Failed to generate image. Please check API key.");
             // If animation is still running, we'll handle state transition in onAnimationComplete
             // But if generation fails fast, we might want to know. 
             // For this demo, let's just let the animation finish its "show" then reveal the error or image.
        } else {
             // Preload image
             const img = new Image();
             img.src = image;
        }
        
        // Save for when animation is done
        (window as any).__tempImage = image;
        (window as any).__tempError = !image ? "Failed to generate." : null;
    } catch (e) {
        (window as any).__tempError = "Network or API Error";
    }

  }, [appState, selectedDish]);

  const handleAnimationComplete = () => {
    const img = (window as any).__tempImage;
    const err = (window as any).__tempError;

    if (img) {
      setGeneratedImage(img);
      setAppState(AppState.COMPLETE);
    } else if (err) {
      setErrorMsg(err);
      setAppState(AppState.ERROR);
    } else {
        // If animation finished but API is still thinking (rare given the timing, but possible)
        setAppState(AppState.GENERATING);
        // Poll or wait - simplistic approach for demo:
        // In a real app we'd use a more robust state machine. 
        // Let's just assume for the demo the API is fast enough or we show a spinner.
        const checkInterval = setInterval(() => {
            const delayedImg = (window as any).__tempImage;
            const delayedErr = (window as any).__tempError;
            if (delayedImg) {
                setGeneratedImage(delayedImg);
                setAppState(AppState.COMPLETE);
                clearInterval(checkInterval);
            } else if (delayedErr) {
                 setErrorMsg(delayedErr);
                 setAppState(AppState.ERROR);
                 clearInterval(checkInterval);
            }
        }, 500);
    }
    
    // Cleanup
    (window as any).__tempImage = null;
    (window as any).__tempError = null;
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-gold-500/30">
      
      {/* Header */}
      <header className="px-6 py-6 border-b border-stone-900 flex justify-between items-center bg-stone-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-600 rounded-full flex items-center justify-center text-stone-950 shadow-lg shadow-gold-600/20">
            <ChefHat size={20} />
          </div>
          <h1 className="text-xl font-serif font-semibold tracking-wide text-stone-100">
            Culinary<span className="text-gold-500">AI</span> Stylist
          </h1>
        </div>
        <div className="text-xs font-medium text-stone-500 uppercase tracking-widest border border-stone-800 px-3 py-1 rounded-full">
            Demo Mode
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Column: Controls & Info */}
        <div className="w-full lg:w-1/3 flex flex-col">
            <div className="mb-8">
                <h2 className="text-3xl font-serif text-white mb-2">Style Your Dish</h2>
                <p className="text-stone-400 leading-relaxed">
                    Select a concept to visualize the final plating. Our AI simulates professional food photography aesthetics.
                </p>
            </div>

            <DishSelector 
                options={DISH_OPTIONS} 
                selectedId={selectedDishId} 
                onSelect={setSelectedDishId}
                disabled={appState === AppState.ASSEMBLING || appState === AppState.GENERATING}
            />

            <button
                onClick={handleCreate}
                disabled={appState === AppState.ASSEMBLING || appState === AppState.GENERATING}
                className={`
                    w-full py-5 rounded-xl text-lg font-serif font-semibold tracking-wide shadow-2xl transition-all duration-300
                    flex items-center justify-center gap-3
                    ${appState === AppState.ASSEMBLING || appState === AppState.GENERATING 
                        ? 'bg-stone-800 text-stone-500 cursor-wait' 
                        : 'bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-stone-950 hover:shadow-gold-500/20 transform hover:-translate-y-1 active:translate-y-0'
                    }
                `}
            >
                {appState === AppState.ASSEMBLING || appState === AppState.GENERATING ? (
                    <>
                        <Sparkles className="animate-spin" /> Styling...
                    </>
                ) : (
                    <>
                        <Camera /> Create Masterpiece
                    </>
                )}
            </button>

            {errorMsg && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-800/50 text-red-300 rounded-lg text-sm">
                    {errorMsg}
                </div>
            )}
            
            <div className="mt-auto pt-12 text-xs text-stone-600">
                <p>Powered by Google Gemini 2.5</p>
            </div>
        </div>

        {/* Right Column: Preview Area */}
        <div className="w-full lg:w-2/3 h-[500px] lg:h-[700px]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-stone-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-stone-800">
                
                {/* State: Idle / Placeholder */}
                {appState === AppState.IDLE && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-600">
                        <div className="w-24 h-24 mb-6 rounded-full border-2 border-dashed border-stone-800 flex items-center justify-center">
                            <Camera size={32} />
                        </div>
                        <p className="font-serif text-lg text-stone-500">Preview Area</p>
                        <p className="text-sm">Select ingredients and click Create</p>
                    </div>
                )}

                {/* State: Assembling (Animation) */}
                {(appState === AppState.ASSEMBLING || appState === AppState.GENERATING) && (
                    <AssemblyAnimation 
                        dish={selectedDish} 
                        onAnimationComplete={handleAnimationComplete} 
                    />
                )}

                {/* State: Complete (Result) */}
                {appState === AppState.COMPLETE && generatedImage && (
                    <div className="absolute inset-0 animate-in fade-in duration-1000">
                        <img 
                            src={generatedImage} 
                            alt="Generated Dish" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                        <div className="absolute bottom-8 left-8 right-8">
                             <div className="inline-block px-3 py-1 bg-gold-500/20 backdrop-blur-md border border-gold-500/30 rounded text-gold-200 text-xs font-medium mb-3 uppercase tracking-wider">
                                AI Generated
                             </div>
                             <h3 className="text-3xl font-serif text-white shadow-black drop-shadow-md">
                                {selectedDish.title.split('–')[1]}
                             </h3>
                        </div>
                    </div>
                )}
                 
                {/* State: Error */}
                {appState === AppState.ERROR && !generatedImage && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400/80 bg-stone-900">
                        <p>Something went wrong.</p>
                        <button onClick={() => setAppState(AppState.IDLE)} className="mt-4 text-sm underline hover:text-red-300">Reset</button>
                     </div>
                )}

            </div>
        </div>

      </main>
    </div>
  );
};

export default App;