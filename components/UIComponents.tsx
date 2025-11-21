import React from 'react';
import { motion } from 'framer-motion';
import { Upload, X, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

export const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-colors text-white"
  >
    <ArrowLeft size={24} />
  </button>
);

interface ImageUploadProps {
  label: string;
  image: File | null;
  setImage: (file: File | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, image, setImage }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative group cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className={`border-2 border-dashed rounded-xl p-4 h-32 flex flex-col items-center justify-center transition-colors ${image ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-gray-400 bg-black/20'}`}>
          {image ? (
            <div className="relative w-full h-full">
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              <button 
                onClick={(e) => { e.preventDefault(); setImage(null); }}
                className="absolute top-1 right-1 bg-red-500 rounded-full p-1 z-20"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <>
              <Upload className="text-gray-400 mb-2" size={24} />
              <span className="text-xs text-gray-400">Tap to upload</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const ActionButton = ({ onClick, disabled, loading, text }: { onClick: () => void, disabled?: boolean, loading?: boolean, text: string }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 
      ${disabled || loading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/30 hover:scale-[1.02] active:scale-95'}`}
  >
    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
    {loading ? "Dreaming..." : text}
  </button>
);

export const ZoomableImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 50, y: 50 });

  const handleInteraction = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPosition({ 
      x: Math.min(100, Math.max(0, x)), 
      y: Math.min(100, Math.max(0, y)) 
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleInteraction(e.clientX, e.clientY, rect);
    setIsZoomed(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY, rect);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-crosshair touch-none"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsZoomed(true)}
      onTouchEnd={() => setIsZoomed(false)}
      onTouchMove={handleTouchMove}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain transition-transform duration-75 ease-linear pointer-events-none select-none"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: isZoomed ? 'scale(2.5)' : 'scale(1)'
        }}
      />
    </div>
  );
};
