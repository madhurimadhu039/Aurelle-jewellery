import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Download, 
  Sliders, 
  ShieldCheck, 
  Info, 
  AlertCircle,
  ArrowRight,
  Maximize2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  tryonService, 
  TRYON_NECKLACES, 
  DEMO_PORTRAITS, 
  TryOnNecklace, 
  DetectedAnatomy, 
  TryOnAdjustments, 
  DEFAULT_ADJUSTMENTS 
} from '../services/tryonService';
import { productService } from '../services/productService';
import { useApp } from '../contexts/AppContext';

export const TryOnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addToCart, formatINR } = useApp();

  // Try-On Necklaces Catalogue
  const necklaces = TRYON_NECKLACES;
  const initialProductId = searchParams.get('product') || necklaces[0].id;
  const initialNecklace = necklaces.find((n) => n.id === initialProductId) || necklaces[0];

  const [selectedNecklace, setSelectedNecklace] = useState<TryOnNecklace>(initialNecklace);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Customer Photo & Canvas State
  const [customerImageUrl, setCustomerImageUrl] = useState<string>(DEMO_PORTRAITS[0].url);
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);
  const [customerImageEl, setCustomerImageEl] = useState<HTMLImageElement | null>(null);

  // AI Anatomy & Detection State
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [anatomy, setAnatomy] = useState<DetectedAnatomy | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(false);

  // Interactive Fine-Tuning Adjustments
  const [adjustments, setAdjustments] = useState<TryOnAdjustments>(DEFAULT_ADJUSTMENTS);
  const [showAdjustments, setShowAdjustments] = useState<boolean>(false);
  const [isComparingOriginal, setIsComparingOriginal] = useState<boolean>(false);

  // UI & Feedback State
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered Necklaces list
  const filteredNecklaces = necklaces.filter((n) => {
    if (selectedCategoryFilter === 'all') return true;
    return n.style === selectedCategoryFilter;
  });

  // Load image element when customerImageUrl changes
  useEffect(() => {
    if (!customerImageUrl) {
      setCustomerImageEl(null);
      setAnatomy(null);
      return;
    }

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
          setDetectionError(detected.message || 'No clear face or neck detected. Centering necklace on upper chest.');
        }
      } catch (err: any) {
        console.error('Anatomy detection error:', err);
        setDetectionError('AI face detection was unable to read landmarks. You can position the piece manually.');
      } finally {
        setIsDetecting(false);
      }
    };
    img.onerror = () => {
      setUploadError('Failed to load image. Please select a valid JPG, PNG, or WebP photo.');
      setIsDetecting(false);
    };
    img.src = customerImageUrl;
  }, [customerImageUrl]);

  // Re-render canvas whenever image, necklace, anatomy, adjustments, or flags change
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !customerImageEl || !anatomy) return;

    if (isComparingOriginal) {
      // Draw original photo only
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

  // Handle Photo Upload with format and size validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Invalid image format. Please upload a JPG, JPEG, PNG, or WebP photo.');
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Image file is too large. Please select a photo under 10 MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCustomerImageUrl(objectUrl);
    setIsCustomUpload(true);
    setAdjustments(DEFAULT_ADJUSTMENTS);
  };

  // Remove photo and return to studio model
  const handleRemovePhoto = () => {
    if (isCustomUpload && customerImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(customerImageUrl);
    }
    setCustomerImageUrl(DEMO_PORTRAITS[0].url);
    setIsCustomUpload(false);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setUploadError(null);
    setDetectionError(null);
  };

  // Add selected piece to shopping cart
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

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  // Download high-resolution try-on canvas composition
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `Aurelle-TryOn-${selectedNecklace.name.replace(/\s+/g, '-')}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#090806] text-[#F7F1E7] selection:bg-[#D8B47A]/30 selection:text-[#D8B47A] py-8 sm:py-12 text-left">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <nav className="text-xs text-gray-500 mb-3 flex items-center justify-center sm:justify-start gap-1.5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#D8B47A]">AI Virtual Try-On Studio</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D8B47A] font-bold block mb-1">
                AUGMENTED REALITY LUXURY SUITE
              </span>
              <h1 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal text-white">
                AI Virtual Try-On Studio
              </h1>
            </div>
            
            {/* Quick Action Badges */}
            <div className="flex items-center justify-center sm:justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="px-3 py-1.5 rounded-full bg-[#18140F] border border-[#2B2319] hover:border-[#D8B47A]/50 text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                <span>100% In-Browser Privacy</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGuidelinesModal(true)}
                className="px-3 py-1.5 rounded-full bg-[#18140F] border border-[#2B2319] hover:border-[#D8B47A]/50 text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-[#D8B47A]" />
                <span>Photo Tips</span>
              </button>
            </div>
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#120F0B] border border-[#2A231A] rounded-3xl overflow-hidden shadow-2xl">
          
          {/* ========================================================= */}
          {/* LEFT 7/12 COLS: HIGH-DEFINITION VIRTUAL PREVIEW CANVAS */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 relative bg-[#070605] flex flex-col justify-between overflow-hidden min-h-[460px] sm:min-h-[580px] lg:min-h-[660px]">
            
            {/* Top Canvas Bar (Photo controls, upload button, compare toggle) */}
            <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-20 flex items-center justify-between gap-2 pointer-events-auto">
              {/* Photo Source Tag */}
              <div className="flex items-center gap-1.5 bg-[#090806]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#2C2720] text-xs">
                <Camera className="w-3.5 h-3.5 text-[#D8B47A]" />
                <span className="text-white font-medium text-[11px] sm:text-xs truncate max-w-[140px] sm:max-w-xs">
                  {isCustomUpload ? 'Your Uploaded Photo' : 'Studio Mannequin'}
                </span>
                {isCustomUpload && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    title="Remove your photo"
                    aria-label="Remove uploaded photo"
                    className="ml-1 text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Top-Right Tools */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Before / After Compare Button */}
                <button
                  type="button"
                  onMouseDown={() => setIsComparingOriginal(true)}
                  onMouseUp={() => setIsComparingOriginal(false)}
                  onTouchStart={() => setIsComparingOriginal(true)}
                  onTouchEnd={() => setIsComparingOriginal(false)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all select-none cursor-pointer ${
                    isComparingOriginal 
                      ? 'bg-[#D8B47A] text-[#090806]' 
                      : 'bg-[#090806]/90 text-gray-300 hover:text-white border border-[#2C2720]'
                  }`}
                  title="Hold to see original photo"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hold: Original</span>
                  <span className="sm:hidden">Compare</span>
                </button>

                {/* Fine-Tuning Drawer Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdjustments(!showAdjustments)}
                  className={`p-2 rounded-full border transition-all ${
                    showAdjustments 
                      ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]' 
                      : 'bg-[#090806]/90 text-gray-300 hover:text-white border-[#2C2720]'
                  }`}
                  title="Fine-tune necklace position, scale, and angle"
                  aria-label="Fine-tune placement"
                >
                  <Sliders className="w-4 h-4" />
                </button>

                {/* AI Landmark Anchor Toggle */}
                <button
                  type="button"
                  onClick={() => setShowLandmarks(!showLandmarks)}
                  className={`p-2 rounded-full border transition-all ${
                    showLandmarks 
                      ? 'bg-[#D8B47A] text-[#090806] border-[#D8B47A]' 
                      : 'bg-[#090806]/90 text-gray-300 hover:text-white border-[#2C2720]'
                  }`}
                  title={showLandmarks ? 'Hide AI landmarks' : 'Show AI detected neck landmarks'}
                  aria-label="Toggle landmarks"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AI Scanning Radar Overlay while processing */}
            {isDetecting && (
              <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
                <div className="relative w-20 h-20 mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-[#D8B47A] border-t-transparent animate-spin" />
                  <div className="absolute inset-2 rounded-full border border-[#D8B47A]/30 animate-pulse" />
                  <Sparkles className="w-8 h-8 text-[#D8B47A] absolute inset-0 m-auto" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#D8B47A] block mb-1">
                  AI COMPUTER VISION SCANNING
                </span>
                <h4 className="font-serif-luxury text-xl font-bold text-white mb-2">
                  Mapping Facial &amp; Neck Landmarks...
                </h4>
                <p className="text-xs text-gray-400 max-w-sm">
                  Detecting chin contours, jaw angles, and collarbone proportions to calculate bespoke necklace drape.
                </p>
              </div>
            )}

            {/* Main Visualizer HTML5 Canvas */}
            <div className="flex-1 flex items-center justify-center p-2 relative overflow-hidden select-none">
              <canvas
                ref={canvasRef}
                className="max-h-[500px] sm:max-h-[600px] lg:max-h-[680px] w-auto max-w-full object-contain rounded-2xl shadow-2xl transition-all"
              />
            </div>

            {/* Detection / Warning Notice Banner if landmarks fallback is active */}
            {detectionError && (
              <div className="absolute top-16 inset-x-4 z-20 p-3 rounded-xl bg-amber-950/80 border border-amber-600/50 backdrop-blur-md flex items-start gap-2.5 text-xs text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-[11px] leading-relaxed">
                  <strong>Adaptive Drape Mode:</strong> {detectionError}
                </div>
              </div>
            )}

            {/* Interactive Fine-Tuning Sliding Control Tray */}
            {showAdjustments && (
              <div className="absolute bottom-16 inset-x-3 sm:inset-x-4 z-20 bg-[#120F0B]/95 border border-[#D8B47A]/50 backdrop-blur-md rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-3 duration-200 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#241F18] mb-3">
                  <div className="flex items-center gap-1.5 font-bold text-white text-[11px] uppercase tracking-wider">
                    <Sliders className="w-3.5 h-3.5 text-[#D8B47A]" />
                    <span>Tactile Drape Controls</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdjustments(DEFAULT_ADJUSTMENTS)}
                    className="text-[10px] text-[#D8B47A] hover:underline font-semibold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset to AI Fit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Scale */}
                  <div>
                    <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                      <span>Necklace Scale</span>
                      <span className="font-bold text-[#D8B47A]">{Math.round(adjustments.scaleMultiplier * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.75"
                      max="1.35"
                      step="0.02"
                      value={adjustments.scaleMultiplier}
                      onChange={(e) => setAdjustments({ ...adjustments, scaleMultiplier: parseFloat(e.target.value) })}
                      className="w-full accent-[#D8B47A] bg-[#2C2720] rounded h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Vertical Position */}
                  <div>
                    <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                      <span>Vertical Placement</span>
                      <span className="font-bold text-[#D8B47A]">{adjustments.offsetY > 0 ? `+${adjustments.offsetY}px` : `${adjustments.offsetY}px`}</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      step="2"
                      value={adjustments.offsetY}
                      onChange={(e) => setAdjustments({ ...adjustments, offsetY: parseInt(e.target.value) })}
                      className="w-full accent-[#D8B47A] bg-[#2C2720] rounded h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Rotation Tilt */}
                  <div>
                    <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                      <span>Collar Angle</span>
                      <span className="font-bold text-[#D8B47A]">{adjustments.rotationDeg}°</span>
                    </div>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      step="1"
                      value={adjustments.rotationDeg}
                      onChange={(e) => setAdjustments({ ...adjustments, rotationDeg: parseInt(e.target.value) })}
                      className="w-full accent-[#D8B47A] bg-[#2C2720] rounded h-1.5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Status & Download Strip */}
            <div className="p-3 sm:p-4 bg-[#090806]/90 border-t border-[#241F18] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <span>
                  {anatomy?.detectorUsed === 'mediapipe_3d' 
                    ? 'Google MediaPipe 3D Landmark Tracking Active (468 points)'
                    : 'Adaptive Anatomical Vision Active'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#18140F] hover:bg-[#251E17] text-white border border-[#2B2319] hover:border-[#D8B47A]/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Download and save your try-on preview"
                >
                  <Download className="w-3.5 h-3.5 text-[#D8B47A]" />
                  <span>Save Photo</span>
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT 5/12 COLS: CUSTOMER UPLOADER & NECKLACE VAULT */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#241F18] overflow-y-auto max-h-[820px]">
            
            <div className="space-y-6">
              
              {/* 1. CUSTOMER PHOTO UPLOAD & DEMO SWITCHER */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#D8B47A] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    <span>1. Customer Photo</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowGuidelinesModal(true)}
                    className="text-[11px] text-gray-400 hover:text-[#D8B47A] underline"
                  >
                    View Guidelines
                  </button>
                </div>

                {/* Upload Error Alert */}
                {uploadError && (
                  <div className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Upload Button Dropzone */}
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="customer-tryon-file-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 rounded-xl bg-[#18140F] hover:bg-[#201A13] border-2 border-dashed border-[#D8B47A]/40 hover:border-[#D8B47A] text-left transition-all group cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-[#D8B47A] mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs text-white block">Upload Your Photo</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">JPG, PNG, WebP &bull; Max 10MB</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 rounded-xl bg-[#18140F] hover:bg-[#201A13] border border-[#2B2319] hover:border-[#D8B47A]/50 text-left transition-all group cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-gray-300 mb-1.5 group-hover:text-[#D8B47A] transition-colors" />
                    <span className="font-semibold text-xs text-white block">Take Selfie / Camera</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Clear face &amp; neck portrait</span>
                  </button>
                </div>

                {/* Demo Portrait Selector (to test immediately) */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                    Or select demo portrait to test:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {DEMO_PORTRAITS.map((p) => {
                      const isActive = customerImageUrl === p.url && !isCustomUpload;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setCustomerImageUrl(p.url);
                            setIsCustomUpload(false);
                            setAdjustments(DEFAULT_ADJUSTMENTS);
                          }}
                          className={`p-2 rounded-xl border text-left transition-all ${
                            isActive
                              ? 'bg-[#D8B47A]/15 border-[#D8B47A] text-white shadow-md'
                              : 'bg-[#18140F] border-[#221B13] text-gray-400 hover:text-white'
                          }`}
                        >
                          <span className="text-[11px] font-semibold block truncate">{p.name}</span>
                          <span className="text-[9px] text-gray-500 block truncate">{p.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. NECKLACE COLLECTION SELECTOR */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-[#D8B47A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>2. Select Aurelle Necklace ({necklaces.length} Pieces)</span>
                  </label>
                  <span className="text-[10px] text-gray-400">Actual Product Image</span>
                </div>

                {/* Style Filter Chips */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
                  {[
                    { id: 'all', label: 'All Styles' },
                    { id: 'choker', label: 'Chokers' },
                    { id: 'bridal', label: 'Bridal Suites' },
                    { id: 'long', label: 'Kasu & Rani Haar' },
                    { id: 'pendant', label: 'Pendants' },
                    { id: 'short', label: 'Gold Chains' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                        selectedCategoryFilter === cat.id
                          ? 'bg-[#D8B47A] text-[#090806]'
                          : 'bg-[#18140F] text-gray-400 hover:text-white border border-[#241F18]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Necklaces Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {filteredNecklaces.map((n) => {
                    const isSelected = selectedNecklace.id === n.id;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          setSelectedNecklace(n);
                          setAdjustments({
                            ...DEFAULT_ADJUSTMENTS,
                            // Retain existing scale/offset adjustments if customized
                            scaleMultiplier: adjustments.scaleMultiplier,
                            offsetY: adjustments.offsetY,
                          });
                        }}
                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-1.5 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#18140F] border-[#D8B47A] ring-2 ring-[#D8B47A]/30 scale-102 shadow-lg'
                            : 'bg-[#14100C] border-[#221B13] opacity-75 hover:opacity-100 hover:border-[#D8B47A]/40'
                        }`}
                        title={`${n.name} - ${formatINR(n.price)}`}
                      >
                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                          <img
                            src={n.cutout || n.image}
                            alt={n.name}
                            className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
                          />
                        </div>

                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D8B47A] text-[#090806] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <span className="text-[9px] font-bold text-white truncate w-full text-center block mt-1">
                          {formatINR(n.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. ACTIVE SELECTED NECKLACE DETAILS */}
              <div className="bg-[#18140F] border border-[#2B2319] rounded-2xl p-4 text-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#D8B47A] block">
                      {selectedNecklace.purity} &bull; {selectedNecklace.styleLabel}
                    </span>
                    <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white leading-snug mt-0.5">
                      {selectedNecklace.name}
                    </h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-extrabold text-[#F7F1E7] block">
                      {formatINR(selectedNecklace.price)}
                    </span>
                    <span className="text-[10px] text-gray-400 block">{selectedNecklace.weightGrams}g Net</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {selectedNecklace.description}
                </p>

                <div className="p-2.5 rounded-xl bg-[#0E0C09] border border-[#221B13] text-[10px] text-gray-400 flex items-center justify-between">
                  <span>Drape Profile: <strong>{selectedNecklace.drapeDescription}</strong></span>
                  <Link
                    to={`/product/${selectedNecklace.id}`}
                    className="text-[#D8B47A] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Full Specs</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

            {/* 4. PURCHASE & CART ACTIONS */}
            <div className="pt-6 border-t border-[#241F18] space-y-3 mt-4">
              
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
                  addedToCart
                    ? 'bg-[#10B981] text-white shadow-[#10B981]/20'
                    : 'bg-[#D8B47A] hover:bg-[#EBD5A8] text-[#090806] shadow-[#D8B47A]/20'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added {selectedNecklace.name} to Shopping Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag ({formatINR(selectedNecklace.price)})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                <span>Free Insured Delivery Across India</span>
                <Link to="/cart" className="text-[#D8B47A] hover:underline font-semibold">
                  View Bag →
                </Link>
              </div>

              {/* Mandated Accuracy Disclaimer */}
              <div className="p-3 rounded-xl bg-[#0E0C09] border border-[#221B13] text-[10px] text-gray-400 text-center leading-relaxed">
                <em>&ldquo;Virtual Try-On is an approximate visual preview. Actual jewellery appearance, dimensions and physical fit may vary.&rdquo;</em>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* PHOTO GUIDELINES MODAL */}
      {/* ========================================================= */}
      {showGuidelinesModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setShowGuidelinesModal(false)}
        >
          <div 
            className="bg-[#120F0B] border border-[#D8B47A]/40 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#241F18] mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#D8B47A]" />
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  Photo Upload Guidelines
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuidelinesModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D8B47A]/20 text-[#D8B47A] flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-white block">Face the Camera Straight</strong>
                  <span>Keep your head upright and look directly forward for symmetrical neck draping.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D8B47A]/20 text-[#D8B47A] flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-white block">Keep Neck &amp; Upper Chest Visible</strong>
                  <span>Avoid high turtlenecks, heavy scarves, or high collars covering the collarbones.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D8B47A]/20 text-[#D8B47A] flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white block">Good, Even Lighting</strong>
                  <span>Ensure your face and neckline are well-lit without harsh shadows.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#D8B47A]/20 text-[#D8B47A] flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="text-white block">Supported Formats</strong>
                  <span>Accepts JPG, JPEG, PNG, and WebP photos up to 10 MB.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#241F18] mt-5">
              <button
                type="button"
                onClick={() => {
                  setShowGuidelinesModal(false);
                  fileInputRef.current?.click();
                }}
                className="w-full py-2.5 rounded-xl bg-[#D8B47A] text-[#090806] font-bold text-xs uppercase tracking-wider hover:bg-[#EBD5A8]"
              >
                Upload Photo Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PRIVACY & SECURITY MODAL */}
      {/* ========================================================= */}
      {showPrivacyModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div 
            className="bg-[#120F0B] border border-[#D8B47A]/40 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#241F18] mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  Privacy &amp; Photo Security
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <p>
                At <strong>Aurelle Jewellery</strong>, patron confidentiality and privacy are paramount.
              </p>
              <div className="p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#A7F3D0] space-y-1.5">
                <strong className="block font-semibold">Client-Side AI Execution</strong>
                <p className="text-[11px]">
                  Your uploaded photos are processed strictly inside your own browser using WebAssembly. Your photos are never stored on public servers or used for model training.
                </p>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-gray-400">
                <li>No image exposure to third-party databases.</li>
                <li>Photos are held only in local memory during your active session.</li>
                <li>You can delete or replace your uploaded photo anytime using the Remove Photo button.</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-[#241F18] mt-4">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-2.5 rounded-xl bg-[#18140F] border border-[#2B2319] hover:bg-[#251E17] text-white font-semibold text-xs"
              >
                Understood &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
