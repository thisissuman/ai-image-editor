import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, PenTool, Megaphone, Wand2, ImageIcon, Download, X, ScanEye } from 'lucide-react';
import ThreeBackground from './components/ThreeBackground';
import { AppView, EditorMode } from './types';
import { GlassCard, BackButton, ImageUpload, ActionButton, ZoomableImage } from './components/UIComponents';
import { generateCoupleImage, generateCreativeImage, editImage, fileToBase64 } from './services/geminiService';

// --- Helper: Full Screen Result View ---
const FullScreenResult = ({ image, onClose }: { image: string, onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-black flex flex-col"
  >
     {/* Header / Close */}
     <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button 
          onClick={onClose}
          className="pointer-events-auto p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors shadow-lg"
        >
          <X size={24} />
        </button>
     </div>

     {/* Main View Area */}
     <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#050505]">
        <ZoomableImage src={image} alt="Generated Result" />
     </div>

     {/* Footer Actions */}
     <div className="p-6 bg-black/80 backdrop-blur-xl border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center z-20 safe-area-bottom">
        <span className="text-gray-400 text-sm flex items-center gap-2 animate-pulse">
           <ScanEye size={16} /> Hover or Hold to Zoom
        </span>
        <a 
          href={image} 
          download={`nanocanvas-${Date.now()}.png`}
          className="px-8 py-4 rounded-xl bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform w-full sm:w-auto justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          <Download size={20} /> Save Image
        </a>
     </div>
  </motion.div>
);

// --- Sub-components for Views ---

// 1. Couple Generator View
const CoupleGenerator = ({ onBack }: { onBack: () => void }) => {
  const [img1, setImg1] = useState<File | null>(null);
  const [img2, setImg2] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!img1 || !img2) return;
    setLoading(true);
    try {
      const b1 = await fileToBase64(img1);
      const b2 = await fileToBase64(img2);
      const res = await generateCoupleImage(b1, b2);
      setResult(res);
    } catch (e) {
      alert("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col p-6 max-w-md mx-auto w-full pt-20 overflow-y-auto no-scrollbar relative z-10">
        <BackButton onClick={onBack} />
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Love AI</h2>
        <p className="text-gray-400 mb-6">Merge two souls into one stylized masterpiece.</p>

        <GlassCard>
          <div className="flex gap-2">
            <ImageUpload label="Partner 1" image={img1} setImage={setImg1} />
            <ImageUpload label="Partner 2" image={img2} setImage={setImg2} />
          </div>
          <ActionButton onClick={handleGenerate} disabled={!img1 || !img2} loading={loading} text="Generate Couple" />
        </GlassCard>
      </div>
      {result && <FullScreenResult image={result} onClose={() => setResult(null)} />}
    </>
  );
};

// 2. Brand Logo Maker
const BrandLogoMaker = ({ onBack }: { onBack: () => void }) => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const fullPrompt = `Create a professional, minimalist, vector-style brand logo for: ${prompt}. High contrast, clean lines.`;
      const res = await generateCreativeImage(fullPrompt);
      setResult(res);
    } catch (e) {
      alert("Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col p-6 max-w-md mx-auto w-full pt-20 overflow-y-auto no-scrollbar relative z-10">
        <BackButton onClick={onBack} />
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Brand Identity</h2>
        <p className="text-gray-400 mb-6">Design unique logos in seconds.</p>

        <GlassCard>
          <label className="block text-sm font-medium text-gray-300 mb-2">Brand Name & Vibe</label>
          <textarea
            className="w-full bg-black/30 border border-gray-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none mb-4 resize-none h-32"
            placeholder="e.g. A coffee shop named 'Nebula Brew' with a space theme..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <ActionButton onClick={handleGenerate} disabled={!prompt} loading={loading} text="Create Logo" />
        </GlassCard>
      </div>
      {result && <FullScreenResult image={result} onClose={() => setResult(null)} />}
    </>
  );
};

// 3. Ad Maker
const AdMaker = ({ onBack }: { onBack: () => void }) => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const fullPrompt = `Create a high-converting, visually stunning advertisement image for: ${prompt}. Cinematic lighting, commercial photography style.`;
      const res = await generateCreativeImage(fullPrompt);
      setResult(res);
    } catch (e) {
      alert("Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col p-6 max-w-md mx-auto w-full pt-20 overflow-y-auto no-scrollbar relative z-10">
        <BackButton onClick={onBack} />
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Ad Studio</h2>
        <p className="text-gray-400 mb-6">Generate marketing visuals that sell.</p>

        <GlassCard>
          <label className="block text-sm font-medium text-gray-300 mb-2">Product Description</label>
          <textarea
            className="w-full bg-black/30 border border-gray-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none mb-4 resize-none h-32"
            placeholder="e.g. A sleek electric sneaker floating in a neon city..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <ActionButton onClick={handleGenerate} disabled={!prompt} loading={loading} text="Generate Ad" />
        </GlassCard>
      </div>
      {result && <FullScreenResult image={result} onClose={() => setResult(null)} />}
    </>
  );
};

// 4. Photo Editor
const PhotoEditor = ({ onBack }: { onBack: () => void }) => {
  const [image, setImage] = useState<File | null>(null);
  const [mode, setMode] = useState<EditorMode>(EditorMode.ADD);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    try {
      const base64 = await fileToBase64(image);
      let fullPrompt = "";
      switch (mode) {
        case EditorMode.ADD:
          fullPrompt = `Add ${prompt} to this image. Blend it naturally.`;
          break;
        case EditorMode.REMOVE:
          fullPrompt = `Remove ${prompt} from this image. Fill in the background naturally.`;
          break;
        case EditorMode.CHANGE:
          fullPrompt = `Change ${prompt} in this image. Keep the rest consistent.`;
          break;
      }
      
      const res = await editImage(base64, fullPrompt);
      setResult(res);
    } catch (e) {
      alert("Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col p-6 max-w-md mx-auto w-full pt-20 overflow-y-auto no-scrollbar relative z-10">
        <BackButton onClick={onBack} />
        <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Magic Edit</h2>
        <p className="text-gray-400 mb-6">Modify reality with a text command.</p>

        <GlassCard>
          <ImageUpload label="Source Image" image={image} setImage={setImage} />
          
          <div className="flex bg-black/40 rounded-lg p-1 mb-4">
            {Object.values(EditorMode).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === m ? 'bg-gray-700 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
              >
                {m}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="w-full bg-black/30 border border-gray-600 rounded-xl p-4 text-white focus:ring-2 focus:ring-green-500 outline-none mb-4"
            placeholder={mode === EditorMode.CHANGE ? "change red car to blue" : "sunglasses"}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <ActionButton onClick={handleEdit} disabled={!image || !prompt} loading={loading} text="Apply Magic" />
        </GlassCard>
      </div>
      {result && <FullScreenResult image={result} onClose={() => setResult(null)} />}
    </>
  );
};

// --- Main App Component ---

const App = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);

  const menuItems = [
    { id: AppView.COUPLE_GENERATOR, title: "Couple Fusion", desc: "Merge photos into one", icon: <Heart className="text-pink-400" />, color: "from-pink-500/20 to-purple-500/20" },
    { id: AppView.BRAND_LOGO, title: "Logo Craft", desc: "AI Brand Identity", icon: <PenTool className="text-blue-400" />, color: "from-blue-500/20 to-cyan-500/20" },
    { id: AppView.AD_MAKER, title: "Ad Studio", desc: "Marketing Visuals", icon: <Megaphone className="text-orange-400" />, color: "from-orange-500/20 to-yellow-500/20" },
    { id: AppView.PHOTO_EDITOR, title: "Magic Edit", desc: "Add, Remove, Change", icon: <Wand2 className="text-emerald-400" />, color: "from-emerald-500/20 to-green-500/20" },
  ];

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* 3D Background Layer */}
      <ThreeBackground />

      {/* Content Layer */}
      <AnimatePresence mode="wait">
        {view === AppView.HOME && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10 flex flex-col justify-end pb-10 px-6 md:justify-center md:pb-0 max-w-lg mx-auto w-full"
          >
            <div className="mb-8 text-center">
              <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">NanoCanvas</h1>
              <p className="text-gray-400 text-lg">Unleash Gemini Nano Banana</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setView(item.id)}
                  className={`bg-gradient-to-br ${item.color} backdrop-blur-md border border-white/10 rounded-2xl p-4 text-left hover:border-white/30 transition-all flex flex-col gap-2`}
                >
                  <div className="p-2 bg-black/30 rounded-lg w-fit">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {view === AppView.COUPLE_GENERATOR && (
          <motion.div key="couple" className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            <CoupleGenerator onBack={() => setView(AppView.HOME)} />
          </motion.div>
        )}

        {view === AppView.BRAND_LOGO && (
          <motion.div key="logo" className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            <BrandLogoMaker onBack={() => setView(AppView.HOME)} />
          </motion.div>
        )}

        {view === AppView.AD_MAKER && (
          <motion.div key="ad" className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            <AdMaker onBack={() => setView(AppView.HOME)} />
          </motion.div>
        )}

        {view === AppView.PHOTO_EDITOR && (
          <motion.div key="edit" className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>
            <PhotoEditor onBack={() => setView(AppView.HOME)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
