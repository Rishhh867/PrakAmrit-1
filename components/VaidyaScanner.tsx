
import React, { useState, useRef, useEffect } from 'react';
import { Scan, X, Camera, RefreshCw, ShoppingBag, Leaf, Zap, Activity } from 'lucide-react';
import { analyzeHealthScan } from '../services/geminiService';
import { CartItem, ProductForm } from '../types';
import { BLEND_RECIPES, PRODUCTS } from '../constants';

interface VaidyaScannerProps {
  onAddBundleToCart: (items: CartItem[]) => void;
}

type ScanStep = 'idle' | 'permission' | 'scan-tongue' | 'scan-skin' | 'analyzing' | 'result';

const VaidyaScanner: React.FC<VaidyaScannerProps> = ({ onAddBundleToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ScanStep>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [tongueImg, setTongueImg] = useState<string | null>(null);
  const [skinImg, setSkinImg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [result, setResult] = useState<{ dosha: string, analysis: string, recommendation: string } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Formatting helper
  const renderText = (text: string) => {
    return text.split('*').map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="font-bold text-prak-gold">{part}</strong> : <span key={index}>{part}</span>
    );
  };

  const startCamera = async () => {
    try {
      setStep('permission');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      setStep('scan-tongue');
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Camera permission denied. Please enable camera access to use the Vaidya Scanner.");
      setStep('idle');
      setIsOpen(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, step]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    }
    return null;
  };

  const startScanningSequence = (target: 'tongue' | 'skin') => {
    let count = 5; // 5 seconds for UX
    setCountdown(count);
    
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        const img = captureImage();
        setCountdown(null);
        
        if (target === 'tongue') {
          setTongueImg(img);
          setStep('scan-skin');
        } else {
          setSkinImg(img);
          setStep('analyzing');
          processResults(tongueImg!, img!); // Trigger analysis
        }
      }
    }, 1000);
  };

  const processResults = async (tImg: string, sImg: string) => {
    stopCamera(); // Stop camera during API call
    
    const analysis = await analyzeHealthScan(tImg, sImg);
    
    setResult(analysis);
    setStep('result');
  };

  const handleClose = () => {
    stopCamera();
    setIsOpen(false);
    setStep('idle');
    setTongueImg(null);
    setSkinImg(null);
    setResult(null);
  };

  const handleAddToCart = () => {
    if (!result) return;
    
    // Map Dosha to a Recipe
    let recipeKey = 'stress'; // Default
    if (result.dosha === 'Vata') recipeKey = 'stress'; // Vata needs calming
    if (result.dosha === 'Pitta') recipeKey = 'digestion'; // Pitta needs cooling/digestion
    if (result.dosha === 'Kapha') recipeKey = 'immunity'; // Kapha needs stimulation/immunity

    const recipe = BLEND_RECIPES[recipeKey];
    if (recipe) {
       // Convert recipe to Cart Items (1kg blend)
       const bundleItems: CartItem[] = [];
       Object.entries(recipe.ratios).forEach(([pid, ratio]) => {
          const product = PRODUCTS.find(p => p.id === pid);
          if (product) {
              bundleItems.push({
                  productId: product.id,
                  productName: product.name,
                  form: 'raw',
                  quantity: '250g', // Sample size for blend
                  price: Math.round(product.basePrice * 0.25),
                  isSubscribed: false
              });
          }
       });
       onAddBundleToCart(bundleItems);
       handleClose();
       alert("Suggested blend added to your cart!");
    }
  };

  // --- Render Components ---

  if (!isOpen) {
    return (
      <button 
        onClick={() => { setIsOpen(true); startCamera(); }}
        className="fixed bottom-32 right-8 z-40 group animate-fade-in-up"
        title="Start Vaidya AI Scan"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-prak-green to-prak-dark shadow-2xl flex items-center justify-center relative overflow-hidden ring-4 ring-white/20 hover:scale-105 transition-transform duration-300">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20"></div>
           <div className="relative z-10 flex flex-col items-center">
             <Scan size={24} className="text-prak-gold mb-0.5" />
             <span className="text-[9px] font-bold text-white uppercase tracking-wider">Vaidya</span>
           </div>
           {/* Pulsing Ring */}
           <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-ping"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-prak-dark/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden">
      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-prak-green rounded-full flex items-center justify-center">
                <Leaf className="text-prak-gold" size={20} />
            </div>
            <div>
                <h2 className="text-xl font-serif font-bold text-white tracking-wide">Digital Vaidya</h2>
                <p className="text-xs text-white/50 uppercase tracking-widest">AI Diagnostic *Test*</p>
            </div>
         </div>
         <button onClick={handleClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
            <X size={24} />
         </button>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-2xl px-4 flex flex-col items-center">
        
        {/* State: Camera View (Tongue or Skin) */}
        {(step === 'scan-tongue' || step === 'scan-skin') && (
            <div className="relative w-full aspect-[3/4] md:aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Scanning Frame */}
                    <div className="w-64 h-64 md:w-80 md:h-80 border-2 border-white/50 rounded-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                        <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                    </div>
                    
                    <div className="absolute bottom-8 text-center bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                        <p className="text-white font-bold text-lg">
                           {step === 'scan-tongue' ? 'Align Your Tongue' : 'Show Forearm Skin'}
                        </p>
                    </div>

                    {/* Countdown Overlay */}
                    {countdown !== null && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                            <span className="text-9xl font-bold text-white animate-bounce">{countdown}</span>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* State: Controls */}
        {(step === 'scan-tongue' || step === 'scan-skin') && !countdown && (
            <button 
                onClick={() => startScanningSequence(step === 'scan-tongue' ? 'tongue' : 'skin')}
                className="mt-8 bg-white text-prak-dark px-10 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform flex items-center gap-3"
            >
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                {step === 'scan-tongue' ? 'Start Tongue Scan' : 'Start Skin Scan'}
            </button>
        )}

        {/* State: Analyzing */}
        {step === 'analyzing' && (
            <div className="text-center">
                <div className="w-32 h-32 relative mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-prak-green/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-prak-gold rounded-full animate-spin"></div>
                    <Leaf className="absolute inset-0 m-auto text-prak-green animate-pulse" size={40} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">Analyzing Biomarkers...</h3>
                <p className="text-white/60">Comparing with Ayurvedic texts...</p>
            </div>
        )}

        {/* State: Result */}
        {step === 'result' && result && (
            <div className="bg-prak-cream w-full rounded-3xl p-8 shadow-2xl animate-fade-in-up max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Dominant Dosha</p>
                        <h2 className="text-4xl font-serif font-bold text-prak-dark">{renderText(`*${result.dosha}*`)}</h2>
                    </div>
                    <div className="w-16 h-16 bg-prak-green/10 rounded-full flex items-center justify-center text-prak-green">
                        <Activity size={32} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-700 flex items-center gap-2 mb-2">
                            <Zap size={18} className="text-prak-gold" />
                            Diagnostic Report
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {renderText(result.analysis)}
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-prak-dark to-prak-green p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                         
                         <h4 className="font-serif font-bold text-xl mb-1">Vaidya's Recommendation</h4>
                         <p className="text-white/80 text-sm mb-4">{renderText(result.recommendation)}</p>
                         
                         <button 
                            onClick={handleAddToCart}
                            className="w-full bg-white text-prak-green font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-md"
                         >
                            <ShoppingBag size={18} />
                            Add Suggested Blend to Cart
                         </button>
                    </div>
                </div>

                <button onClick={handleClose} className="mt-8 w-full text-center text-gray-500 hover:text-prak-dark font-medium text-sm flex items-center justify-center gap-2">
                    <RefreshCw size={14} /> Retake *Test*
                </button>
            </div>
        )}

      </div>
      
      {/* CSS for Scan Animation */}
      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VaidyaScanner;
