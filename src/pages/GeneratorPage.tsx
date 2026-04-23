import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { GoogleGenAI } from "@google/genai";
import { Zap, Wand2, Download, Loader2, Image as ImageIcon, CreditCard, AlertCircle, RefreshCw, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [numResults, setNumResults] = useState(1);

  const { user, refreshProfile } = useAuth();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (user && user.credits < 5) {
      setError("Insufficient credits. Please purchase more.");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedImages([]);

    try {
      // 1. Deduct credits from backend
      const deductRes = await fetch("/api/credits/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5 }),
      });

      if (!deductRes.ok) {
        const data = await deductRes.json();
        throw new Error(data.error || "Failed to deduct credits");
      }

      await refreshProfile(); // Update credits in UI

      // 2. Call Gemini API (Frontend)
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const results: string[] = [];

      // Generate multiple if requested (currently we just do one robust part to keep it fast, 
      // but we could loop or use a model that supports multi-image if available)
      // The nano-banana series usually returns one candidate with multiple parts if encouraged.
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: `Generate ${numResults} distinct high-quality, professional, aesthetic image(s) for the following prompt: ${prompt}. Style: Artistic, photorealistic, sharp details, 4k.` },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        }
      });

      if (response && response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64 = part.inlineData.data;
            results.push(`data:image/png;base64,${base64}`);
          }
        }
      }

      if (results.length === 0) {
        throw new Error("AI did not return any images. Please try a different prompt.");
      }

      setGeneratedImages(results);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `imagix-ai-image-${Date.now()}-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-slate-50 dark:bg-[#050505] flex flex-col md:flex-row border-b border-slate-200 dark:border-white/5 transition-colors">
        {/* LEFT: Prompt & Controls */}
        <section className="flex-1 md:flex-[1.2] p-6 md:p-12 lg:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5">
          <div className="max-w-md mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest mb-6 border border-slate-300 dark:border-white/10 text-slate-500 dark:text-brand-gray">
                 <Shield className="w-3 h-3" /> Private Workbench
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-[0.9] tracking-tighter mb-6 uppercase text-slate-900 dark:text-white">
                TURN YOUR<br />IMAGINATIONS<br /><span className="opacity-30">INTO REAL IMAGES.</span>
              </h1>
              <p className="text-slate-500 dark:text-brand-gray text-xs md:text-sm font-medium leading-relaxed max-w-sm">
                Powered by Google AI Studio. Professional grade visuals in seconds with zero permanent storage.
              </p>
            </motion.div>

            {/* Prompt Input Area */}
            <div className="space-y-6 md:space-y-8">
              <div className="relative">
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 mb-3 block px-1 font-bold">Concept Prompt</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  placeholder="e.g. A futuristic landscape with floating islands and neon waterfalls, photorealistic..."
                  className="w-full h-32 md:h-40 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-sm resize-none focus:outline-none focus:border-slate-900 dark:focus:border-brand-white placeholder:text-slate-300 dark:placeholder:text-white/10 transition-all font-medium text-slate-900 dark:text-white shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col justify-center shadow-sm">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-white/30 block mb-1 font-bold">Aspect Ratio</span>
                  <span className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">1:1 (Square)</span>
                </div>
                <div className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-2xl relative shadow-sm">
                  <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-white/30 block mb-1 font-bold">Results Count</span>
                  <select 
                    value={numResults}
                    onChange={(e) => setNumResults(Number(e.target.value))}
                    className="bg-transparent text-xs md:text-sm font-bold focus:outline-none cursor-pointer w-full appearance-none px-0 text-slate-900 dark:text-white"
                  >
                    <option value={1} className="bg-white dark:bg-brand-black text-slate-900 dark:text-white">1 Output</option>
                    <option value={2} className="bg-white dark:bg-brand-black text-slate-900 dark:text-white">2 Outputs</option>
                    <option value={3} className="bg-white dark:bg-brand-black text-slate-900 dark:text-white">3 Outputs</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full h-16 md:h-20 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xl flex items-center justify-center gap-4 active:scale-[0.98] transition-all hover:opacity-90 disabled:opacity-30 shadow-xl"
              >
                {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : "GENERATE IMAGE"}
                <span className="text-[10px] px-2.5 py-1 border border-white/20 dark:border-black/20 rounded-md bg-white/10 dark:bg-black/5 flex items-center gap-1">
                  {isGenerating ? "???" : "5 CR"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT: Display & Gallery */}
        <section className="flex-1 md:flex-[1.8] bg-slate-200/50 dark:bg-[#0a0a0a] p-6 md:p-12 lg:p-16 flex flex-col min-h-[500px]">
          <div className="flex-1 flex flex-col gap-8 md:gap-10">
            {/* Active Generation Preview */}
            <div className="flex-1 relative group rounded-[40px] overflow-hidden glass border border-slate-300 dark:border-white/5 bg-white/50 dark:bg-white/5 shadow-2xl">
               <AnimatePresence mode="wait">
                 {isGenerating ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 dark:bg-zinc-950/50 backdrop-blur-md z-10"
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-slate-300 dark:border-white/10 border-t-slate-900 dark:border-t-white rounded-full animate-spin mb-6"></div>
                      <span className="text-[10px] tracking-[0.3em] text-slate-900 dark:text-white/40 uppercase font-black animate-pulse">Engaging Neural Network...</span>
                    </motion.div>
                  ) : null}
               </AnimatePresence>

               {generatedImages.length > 0 ? (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full p-4 md:p-6 overflow-y-auto">
                   {generatedImages.map((url, i) => (
                     <div key={i} className="relative group rounded-3xl overflow-hidden aspect-square border border-slate-200 dark:border-white/5 shadow-lg bg-slate-100 dark:bg-black">
                       <img 
                         src={url} 
                         className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                         referrerPolicy="no-referrer"
                       />
                       <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => downloadImage(url, i)}
                            className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10 pointer-events-none p-8">
                   <div className="text-center">
                     <ImageIcon className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 text-slate-900 dark:text-white" />
                     <p className="text-sm md:text-xl font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white">AWAITING INPUT</p>
                   </div>
                 </div>
               )}
            </div>

            {/* Recent Generations (Placeholder) */}
            <div className="h-32 md:h-40 flex flex-nowrap md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {[...Array(4)].map((_, i) => (
                 <div key={i} className="aspect-square w-32 min-w-[8rem] md:w-full rounded-3xl border border-slate-200 dark:border-white/5 bg-white/20 dark:bg-white/[0.02] flex items-center justify-center opacity-20 hover:opacity-100 transition-all cursor-pointer border-dashed">
                    <span className="text-[8px] md:text-[10px] tracking-widest rotate-[-90deg] md:rotate-0 uppercase font-black text-slate-400 dark:text-white/40">History Lot {i+1}</span>
                 </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Trust Badges */}
      <div className="py-12 md:py-20 px-6 border-t border-slate-200 dark:border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 bg-white dark:bg-transparent">
        <div className="flex items-center gap-3 font-display font-black text-sm md:text-lg text-slate-900 dark:text-white uppercase"><Shield className="w-5 h-5" /> Ultra Secure</div>
        <div className="flex items-center gap-3 font-display font-black text-sm md:text-lg text-slate-900 dark:text-white uppercase"><Zap className="w-5 h-5" /> Warp Speed</div>
        <div className="flex items-center gap-3 font-display font-black text-sm md:text-lg text-slate-900 dark:text-white uppercase"><ImageIcon className="w-5 h-5" /> 4K Rendering</div>
      </div>
    </div>
  );
}
