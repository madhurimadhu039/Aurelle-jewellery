import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Camera, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Upload, 
  Trash2, 
  Eye, 
  Sliders, 
  RefreshCw, 
  ShieldCheck, 
  Download,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';
import { productService } from '../services/productService';
import { 
  tryonService, 
  TRYON_NECKLACES, 
  DEMO_PORTRAITS, 
  TryOnNecklace, 
  DetectedAnatomy, 
  TryOnAdjustments, 
  DEFAULT_ADJUSTMENTS 
} from '../services/tryonService';

interface Props {
  product?: Product;
  onClose: () => void;
}

export const VirtualTryOnModal: React.FC<Props> = ({ product, onClose }) => {
  const { addToCart, formatINR } = useApp();

  // Selected Necklace state
  const initialNecklace = product 
    ? tryonService.resolveNecklace(product) 
    : TRYON_NECKLACES[0];
  const [selectedNecklace, setSelectedNecklace] = useState<TryOnNecklace>(initialNecklace);

  // Customer photo state
  const [customerImageUrl, setCustomerImageUrl] = useState<string>(DEMO_PORTRAITS[0].url);
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);
  const [customerImageEl, setCustomerImageEl] = useState<HTMLImageElement | null>(null);

  // AI Anatomy state
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [anatomy, setAnatomy] = useState<DetectedAnatomy | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(false);

  // Fine-tuning adjustments
  const [adjustments, setAdjustments] = useState<TryOnAdjustments>(DEFAULT_ADJUSTMENTS);
  const [showAdjustments, setShowAdjustments] = useState<boolean>(false);
  const [isComparingOriginal, setIsComparingOriginal] = useState<boolean>(false);

  // UI state
  const [added, setAdded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Lock background page scroll while Try-On modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  // If initial product changes
  useEffect(() => {
    if (product) {
      setSelectedNecklace(tryonService.resolveNecklace(product));
    }
  }, [product]);

  // Load image element and run AI landmark detection
  useEffect(() => {
    if (!customerImageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      setCustomerImageEl(img);
      setIsDetecting(true);
      setDetectionError(null);

      try {
        const detected = await tryonService.detectAnatomy(img);
        setAnatomy(detected);
        if (!detected.landmarksDetected) {
          setDetectionError('No clear neck detected. Centering piece with adaptive fit.');
        }
      } catch (err: any) {
        console.error('Modal Try-On anatomy detection error:', err);
        setDetectionError('Adaptive vision active.');
      } finally {
        setIsDetecting(false);
      }
    };
    img.onerror = () => {
      setUploadError('Failed to load image. Please select a valid photo.');
      setIsDetecting(false);
    };
    img.src = customerImageUrl;
  }, [customerImageUrl]);

  // Render composite canvas
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !customerImageEl || !anatomy) return;

    if (isComparingOriginal) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const w = customerImageEl.naturalWidth || customerImageEl.width;
        const h = customerImageEl.naturalHeight || customerImageEl.height;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(customerImageEl, 0, 0, w, h);
      }
      return;
    }

    await tryonService.renderTryOn(
      canvas,
      customerImageEl,
      anatomy,
      selectedNecklace,
      adjustments,
      showLandmarks
    );
  }, [customerImageEl, anatomy, selectedNecklace, adjustments, showLandmarks, isComparingOriginal]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Please upload a JPG, JPEG, PNG, or WebP photo.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image file is too large (max 10MB).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCustomerImageUrl(objectUrl);
    setIsCustomUpload(true);
    setAdjustments(DEFAULT_ADJUSTMENTS);
  };

  // Remove uploaded photo
  const handleRemovePhoto = () => {
    if (isCustomUpload && customerImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(customerImageUrl);
    }
    setCustomerImageUrl(DEMO_PORTRAITS[0].url);
    setIsCustomUpload(false);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setUploadError(null);
  };

  // Add to cart
  const handleAddToCart = () => {
    const fullProduct = productService.getById(selectedNecklace.id);
    if (fullProduct) {
      addToCart(fullProduct, 1);
    } else {
      addToCart({
        id: selectedNecklace.id,
        name: selectedNecklace.name,
        sku: selectedNecklace.id.toUpperCase(),
        category: (selectedNecklace.category as any) || 'Necklaces',
        price: selectedNecklace.price,
        purity: (selectedNecklace.purity.includes('18K') ? '18K' : selectedNecklace.purity.includes('24K') ? '24K' : '22K') as any,
        weightGrams: selectedNecklace.weightGrams,
        images: [selectedNecklace.image],
        description: selectedNecklace.description,
        rating: 4.9,
        reviewsCount: 18,
        stock: 5,
        style: selectedNecklace.styleLabel,
        occasion: ['Bridal', 'Gala'],
        material: selectedNecklace.purity,
      }, 1);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Download preview
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `Aurelle-${selectedNecklace.name.replace(/\s+/g, '-')}-TryOn.jpg`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#12100C] border border-[#D8B47A]/50 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col overflow-y-auto md:overflow-hidden shadow-2xl my-auto overscroll-contain">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-[#2C2720] bg-[#0E0C09] sticky top-0 z-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D8B47A]/10 text-[#D8B47A] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display-luxury text-sm sm:text-base font-bold text-[#F7F1E7] tracking-wide leading-tight">
                AURELLE AI VIRTUAL TRY-ON
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-400">MediaPipe 3D Landmark &amp; Adaptive Neck Fit</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/try-on?product=${selectedNecklace.id}`}
              onClick={onClose}
              className="hidden sm:flex items-center gap-1 text-[11px] text-[#D8B47A] hover:underline px-2.5 py-1 rounded bg-[#18140F] border border-[#2B2319]"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Full Studio</span>
            </Link>

            <button
              onClick={onClose}
              aria-label="Close Try-On Studio"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E1B15] transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto md:overflow-hidden">
          
          {/* Visualizer Canvas Area (7 cols) */}
          <div className="md:col-span-7 relative bg-[#070605] flex flex-col justify-between items-center min-h-[380px] sm:min-h-[460px] md:min-h-[520px] overflow-hidden select-none p-2">
            
            {/* Top Toolbar */}
            <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between gap-2 pointer-events-auto">
              <div className="flex items-center gap-1.5 bg-[#090806]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#2C2720] text-xs">
                <Camera className="w-3 h-3 text-[#D8B47A]" />
                <span className="text-white text-[11px] truncate max-w-[120px]">
                  {isCustomUpload ? 'Your Photo' : 'Model'}
                </span>
                {isCustomUpload && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    title="Remove your photo"
                    className="ml-1 text-gray-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Hold to Compare */}
                <button
                  type="button"
                  onMouseDown={() => setIsComparingOriginal(true)}
                  onMouseUp={() => setIsComparingOriginal(false)}
                  onTouchStart={() => setIsComparingOriginal(true)}
                  onTouchEnd={() => setIsComparingOriginal(false)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all select-none cursor-pointer ${
                    isComparingOriginal ? 'bg-[#D8B47A] text-[#090806]' : 'bg-[#090806]/90 text-gray-300 border border-[#2C2720]'
                  }`}
                  title="Hold to see original photo"
                >
                  <Eye className="w-3 h-3" />
                  <span>Compare</span>
                </button>

                {/* Fine-Tuning */}
                <button
                  type="button"
                  onClick={() => setShowAdjustments(!showAdjustments)}
                  className={`p-1.5 rounded-full border transition-all ${
                    showAdjustments ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]' : 'bg-[#090806]/90 text-gray-300 border-[#2C2720]'
                  }`}
                  title="Fine-tune placement"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AI Scanning Overlay */}
            {isDetecting && (
              <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                <div className="w-12 h-12 rounded-full border-2 border-[#D8B47A] border-t-transparent animate-spin mb-3" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D8B47A] block">
                  AI SCANNING NECK LANDMARKS...
                </span>
              </div>
            )}

            {/* HTML5 Canvas */}
            <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-h-[360px] sm:max-h-[440px] md:max-h-[500px] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Fine-Tuning Tray */}
            {showAdjustments && (
              <div className="absolute bottom-12 inset-x-3 z-20 bg-[#120F0B]/95 border border-[#D8B47A]/50 backdrop-blur-md rounded-xl p-3 shadow-2xl text-xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#241F18]">
                  <span className="font-bold text-white text-[10px] uppercase tracking-wider">Fine-Tune Fit</span>
                  <button
                    type="button"
                    onClick={() => setAdjustments(DEFAULT_ADJUSTMENTS)}
                    className="text-[10px] text-[#D8B47A] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Scale</span>
                    <input
                      type="range"
                      min="0.75"
                      max="1.35"
                      step="0.02"
                      value={adjustments.scaleMultiplier}
                      onChange={(e) => setAdjustments({ ...adjustments, scaleMultiplier: parseFloat(e.target.value) })}
                      className="w-full accent-[#D8B47A] h-1"
                    />
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Position Y</span>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      step="2"
                      value={adjustments.offsetY}
                      onChange={(e) => setAdjustments({ ...adjustments, offsetY: parseInt(e.target.value) })}
                      className="w-full accent-[#D8B47A] h-1"
                    />
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Angle</span>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      step="1"
                      value={adjustments.rotationDeg}
                      onChange={(e) => setAdjustments({ ...adjustments, rotationDeg: parseInt(e.target.value) })}
                      className="w-full accent-[#D8B47A] h-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Bar */}
            <div className="w-full py-2 px-3 bg-[#090806]/90 border-t border-[#241F18] flex items-center justify-between text-[11px] text-gray-400">
              <span className="truncate">Natural jewellery drop shadow &amp; lighting blend</span>
              <button
                type="button"
                onClick={handleDownloadImage}
                className="text-[#D8B47A] hover:underline flex items-center gap-1 font-semibold flex-shrink-0"
              >
                <Download className="w-3 h-3" />
                <span>Save</span>
              </button>
            </div>

          </div>

          {/* Controls & Switcher Area (5 cols) */}
          <div className="md:col-span-5 p-4 sm:p-5 bg-[#12100C] border-t md:border-t-0 md:border-l border-[#2C2720] flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-4">
              
              {/* Photo Upload Option */}
              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-[#D8B47A] block mb-1.5">
                  1. Your Photo
                </label>
                
                {uploadError && (
                  <div className="mb-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-300 text-[10px]">
                    {uploadError}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#18140F] hover:bg-[#201A13] border border-[#D8B47A]/50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#D8B47A]" />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomerImageUrl(DEMO_PORTRAITS[0].url);
                      setIsCustomUpload(false);
                      setAdjustments(DEFAULT_ADJUSTMENTS);
                    }}
                    className="py-2 px-3 rounded-xl bg-[#18140F] border border-[#241F18] text-gray-300 hover:text-white text-xs"
                  >
                    Sample Model
                  </button>
                </div>
              </div>

              {/* Necklace Switcher */}
              <div>
                <label className="text-xs uppercase font-bold tracking-wider text-[#D8B47A] block mb-1.5">
                  2. Switch Necklace ({TRYON_NECKLACES.length} Styles)
                </label>
                
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
                  {TRYON_NECKLACES.map((n) => {
                    const isSelected = selectedNecklace.id === n.id;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => setSelectedNecklace(n)}
                        className={`aspect-square rounded-lg p-1 border transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-[#18140F] border-[#D8B47A] ring-1 ring-[#D8B47A]'
                            : 'bg-[#14100C] border-[#241F18] opacity-70 hover:opacity-100'
                        }`}
                        title={n.name}
                      >
                        <img src={n.cutout} alt={n.name} className="max-h-full max-w-full object-contain" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Info Card */}
              <div className="p-3.5 rounded-xl bg-[#18140F] border border-[#241F18] text-xs space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#D8B47A] block">
                  {selectedNecklace.purity} &bull; {selectedNecklace.styleLabel}
                </span>
                <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-white leading-snug">
                  {selectedNecklace.name}
                </h4>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-extrabold text-[#F7F1E7]">
                    {formatINR(selectedNecklace.price)}
                  </span>
                  <span className="text-[10px] text-gray-400">{selectedNecklace.weightGrams}g Net</span>
                </div>
              </div>

            </div>

            {/* Bottom Purchase Actions */}
            <div className="pt-3 border-t border-[#241F18] space-y-2 mt-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  added
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag ({formatINR(selectedNecklace.price)})</span>
                  </>
                )}
              </button>

              <p className="text-[9px] text-gray-500 text-center leading-tight">
                <em>&ldquo;Virtual Try-On is an approximate visual preview. Actual jewellery appearance, dimensions and physical fit may vary.&rdquo;</em>
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
