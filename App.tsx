
import React, { useState, useEffect } from 'react';
import { ShoppingBasket, Lock, Menu, X, Leaf, Info, ArrowRight, Sparkles, Heart, Wind, Flame, Droplets, Search } from 'lucide-react';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import QuoteRequestModal from './components/QuoteRequestModal';
import AdminDashboard from './components/AdminDashboard';
import AIConsultant from './components/AIConsultant';
import WishlistView from './components/WishlistView';
import BlendingTool from './components/BlendingTool';
import VaidyaScanner from './components/VaidyaScanner'; 
import { PRODUCTS } from './constants';
import { CartItem, Dosha } from './types';
import { getWishlist, saveWishlist } from './services/storageService';

function App() {
  const [view, setView] = useState<'shop' | 'admin-login' | 'admin-dashboard' | 'wishlist'>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteItem, setQuoteItem] = useState<CartItem | null>(null);
  
  // Filter State
  const [selectedDosha, setSelectedDosha] = useState<Dosha | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin Login State
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Load wishlist on mount
  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
    setIsCartOpen(true);
  };

  // *Upsell Logic*: Batch add multiple items from blending tool or Vaidya Scanner
  const handleAddBundleToCart = (items: CartItem[]) => {
    setCart(prevCart => [...prevCart, ...items]);
    setIsCartOpen(true);
  };

  const handleRequestQuote = (item: CartItem) => {
    setQuoteItem(item);
    setIsQuoteModalOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleToggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    
    setWishlist(newWishlist);
    saveWishlist(newWishlist);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === 'admin123') { // Hardcoded for demo
      setView('admin-dashboard');
      setAdminPass('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate email sending
    alert(`Password reset link has been sent to ${resetEmail}`);
    setShowForgotPassword(false);
    setResetEmail('');
  };

  // Filter Logic
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesDosha = selectedDosha === 'All' || p.doshas.includes(selectedDosha);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.botanicalName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDosha && matchesSearch;
  });

  if (view === 'admin-dashboard') {
    return <AdminDashboard onLogout={() => setView('shop')} />;
  }

  if (view === 'admin-login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1615485925763-867862f80f18?auto=format&fit=crop&q=80')] bg-cover bg-center p-4">
        <div className="absolute inset-0 bg-prak-green/40 backdrop-blur-sm"></div>
        
        {/* Login Panel */}
        <div className="glass-panel p-8 rounded-3xl shadow-2xl max-w-md w-full relative z-10 animate-fade-in-up">
          <button 
             onClick={() => setView('shop')}
             className="absolute top-4 right-4 text-gray-500 hover:text-prak-green transition-colors"
           >
             <X size={20} />
           </button>
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 bg-gradient-to-br from-prak-green to-prak-lightGreen rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg rotate-3 hover:rotate-6 transition-transform">
              <Lock size={24} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-prak-dark">Admin Portal</h2>
            <p className="text-gray-600 text-sm mt-2">Secure access for management</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <input
                type="password"
                placeholder="Enter Passkey"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-white/50 border border-white/60 focus:ring-2 focus:ring-prak-green/50 focus:bg-white transition-all outline-none placeholder-gray-500"
              />
              {loginError && <p className="text-red-600 font-medium text-xs mt-2 ml-1">Access Denied. Incorrect credentials.</p>}
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-prak-dark hover:text-prak-green transition-colors hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full bg-prak-green hover:bg-prak-lightGreen text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-prak-green/20 hover:shadow-prak-green/40 active:scale-95">
              Unlock Dashboard
            </button>
          </form>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up">
            <div className="glass-panel p-8 rounded-3xl shadow-2xl max-w-sm w-full relative bg-white/90 border border-white/50">
               <button 
                onClick={() => setShowForgotPassword(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-prak-green transition-colors"
               >
                 <X size={20} />
               </button>
               <div className="text-center mb-6">
                 <h3 className="text-xl font-serif font-bold text-prak-dark">Reset Password</h3>
                 <p className="text-gray-600 text-sm mt-2">Enter your email to receive a recovery link.</p>
               </div>
               <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                 <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@milana.com"
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-prak-green/50 focus:bg-white transition-all outline-none text-gray-800 placeholder-gray-400"
                 />
                 <button type="submit" className="w-full bg-prak-dark text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:bg-prak-green">
                    Send Reset Link
                 </button>
               </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* Floating Navbar */}
      <header className="fixed top-0 w-full z-40 glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={() => { setView('shop'); window.scrollTo(0, 0); }}>
              <div className="relative">
                <Leaf className="text-prak-green transition-transform group-hover:rotate-12" size={32} />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-prak-gold rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-serif font-bold text-prak-dark tracking-tight">Milanà</h1>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#shop" onClick={() => setView('shop')} className={`text-prak-dark font-medium hover:text-prak-green transition-colors relative group ${view === 'shop' ? 'text-prak-green' : ''}`}>
                Raw Materials
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-prak-green transition-all ${view === 'shop' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
              <a href="#" className="text-gray-500 hover:text-prak-green transition-colors">Philosophy</a>
              <a href="#" className="text-gray-500 hover:text-prak-green transition-colors">Contact</a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('admin-login')}
                className="text-gray-400 hover:text-prak-green transition-colors hidden sm:block hover:bg-prak-green/10 p-2 rounded-full"
                title="Admin Login"
              >
                <Lock size={20} />
              </button>

              <button 
                onClick={() => setView('wishlist')}
                className={`relative p-3 rounded-2xl transition-all duration-300 group ${view === 'wishlist' ? 'bg-prak-green text-white' : 'hover:bg-prak-green/5 text-gray-500 hover:text-red-500'}`}
                title="Wishlist"
              >
                 <Heart size={22} className={`transition-transform group-hover:scale-110 ${view === 'wishlist' ? 'fill-white' : ''}`} />
                 {wishlist.length > 0 && view !== 'wishlist' && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white"></span>
                )}
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 bg-prak-dark/5 hover:bg-prak-green text-prak-green hover:text-white rounded-2xl transition-all duration-300 group"
              >
                <ShoppingBasket size={22} className="group-hover:scale-110 transition-transform" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white transform bg-prak-gold rounded-full shadow-sm border border-white">
                    {cart.length}
                  </span>
                )}
              </button>

              <button className="md:hidden text-prak-dark p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-gray-200 p-4 space-y-3 absolute w-full animate-fade-in-up">
            <a href="#" onClick={() => {setView('shop'); setIsMobileMenuOpen(false);}} className="block px-4 py-3 text-prak-green font-bold bg-prak-green/10 rounded-xl">Raw Materials</a>
            <a href="#" onClick={() => {setView('wishlist'); setIsMobileMenuOpen(false);}} className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">Wishlist ({wishlist.length})</a>
            <a href="#" className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">Our Philosophy</a>
            <a href="#" className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">Contact</a>
            <div className="pt-3 border-t border-gray-200">
               <button onClick={() => {setView('admin-login'); setIsMobileMenuOpen(false);}} className="flex items-center gap-2 px-4 py-3 text-gray-500 w-full text-left hover:text-prak-green">
                 <Lock size={16} /> Admin Access
               </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      {view === 'wishlist' ? (
        <WishlistView 
          products={PRODUCTS}
          wishlistIds={wishlist}
          onAddToCart={addToCart}
          onRequestQuote={handleRequestQuote}
          onToggleWishlist={handleToggleWishlist}
          onBackToShop={() => setView('shop')}
        />
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-prak-green/10 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-prak-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-prak-accent/20 text-prak-green text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
                    <Sparkles size={12} />
                    Certified Organic
                  </div>
                  <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-prak-dark animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    Ancient Wisdom, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-prak-green to-prak-lightGreen">Modern Purity.</span>
                  </h2>
                  <p className="text-gray-600 text-lg md:text-xl max-w-lg mx-auto md:mx-0 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Experience the raw power of Ayurveda with our ethically sourced herbs and powders.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <a href="#shop" className="px-8 py-4 bg-prak-green text-white rounded-full font-bold shadow-xl shadow-prak-green/30 hover:shadow-prak-green/50 hover:bg-prak-lightGreen transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                      Shop Essentials <ArrowRight size={18} />
                    </a>
                    <button className="px-8 py-4 glass-card text-prak-dark rounded-full font-bold hover:bg-white/80 transition-all hover:-translate-y-1">
                      Learn More
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 relative animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="relative w-full max-w-lg mx-auto aspect-square">
                      <div className="absolute inset-4 bg-gradient-to-tr from-prak-green to-transparent rounded-[2rem] opacity-20 transform rotate-6"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1606913084603-3e7702b01627?auto=format&fit=crop&q=80&w=800" 
                        alt="Ayurvedic Ingredients" 
                        className="relative w-full h-full object-cover rounded-[2rem] shadow-2xl z-10 mask-image-gradient"
                      />
                      {/* Floating badge */}
                      <div className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-2xl shadow-lg z-20 flex items-center gap-3 animate-pulse-slow">
                        <div className="bg-green-100 p-2 rounded-full text-green-700">
                          <Leaf size={24} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Source</p>
                          <p className="text-prak-dark font-serif font-bold">100% Natural</p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NEW: Formulation Calculator Widget */}
          <section className="relative z-20 -mt-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <BlendingTool 
              onAddBundleToCart={handleAddBundleToCart} 
              onRequestQuote={handleRequestQuote}
            />
          </section>

          {/* Filter Bar */}
          <div id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
             <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-4 px-4 w-full md:w-auto">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest hidden md:inline">Filter by:</span>
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 md:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search herbs..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/50 border border-white/60 text-sm focus:ring-2 focus:ring-prak-green/30 outline-none"
                    />
                  </div>
               </div>

               {/* Dosha Filter */}
               <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2 md:px-0">
                  <button 
                    onClick={() => setSelectedDosha('All')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      selectedDosha === 'All' ? 'bg-prak-dark text-white shadow-lg' : 'hover:bg-white text-gray-600'
                    }`}
                  >
                    All Essentials
                  </button>
                  <button 
                    onClick={() => setSelectedDosha('Vata')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                      selectedDosha === 'Vata' ? 'bg-blue-100 text-blue-800 shadow-md ring-2 ring-blue-200' : 'hover:bg-blue-50 text-gray-600'
                    }`}
                  >
                    <Wind size={14} /> Vata (Air)
                  </button>
                  <button 
                    onClick={() => setSelectedDosha('Pitta')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                      selectedDosha === 'Pitta' ? 'bg-orange-100 text-orange-800 shadow-md ring-2 ring-orange-200' : 'hover:bg-orange-50 text-gray-600'
                    }`}
                  >
                    <Flame size={14} /> Pitta (Fire)
                  </button>
                  <button 
                    onClick={() => setSelectedDosha('Kapha')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                      selectedDosha === 'Kapha' ? 'bg-green-100 text-green-800 shadow-md ring-2 ring-green-200' : 'hover:bg-green-50 text-gray-600'
                    }`}
                  >
                    <Droplets size={14} /> Kapha (Earth)
                  </button>
               </div>
             </div>
          </div>

          {/* Products Grid */}
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
            <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
              <div>
                <h3 className="text-3xl font-serif font-bold text-prak-dark mb-1">
                  {selectedDosha === 'All' ? 'Curated Essentials' : `${selectedDosha} Balancing Herbs`}
                </h3>
                <p className="text-gray-500 text-sm">Handpicked for your holistic well-being</p>
              </div>
              <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-600 font-medium border border-white/60">
                Showing {filteredProducts.length} Premium Herbs
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                   <Leaf size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-600">No products found</h3>
                <p className="text-gray-400">Try adjusting your search or filter.</p>
                <button onClick={() => {setSelectedDosha('All'); setSearchQuery('');}} className="mt-4 text-prak-green font-bold hover:underline">View All</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart} 
                    onRequestQuote={handleRequestQuote}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* Footer */}
      <footer className="bg-prak-dark text-white/70 py-16 mt-12 relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6 text-white">
                <Leaf size={24} className="text-prak-accent" />
                <span className="font-serif font-bold text-2xl tracking-wide">Milanà</span>
              </div>
              <p className="leading-relaxed mb-6">Bridging the gap between ancient Ayurvedic wisdom and modern lifestyle needs.</p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-prak-green cursor-pointer transition-colors flex items-center justify-center">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-prak-green cursor-pointer transition-colors flex items-center justify-center">
                   <span className="sr-only">Instagram</span>
                   <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-6">Explore</h4>
              <ul className="space-y-3">
                <li className="hover:text-prak-gold cursor-pointer transition-colors">Our Story</li>
                <li className="hover:text-prak-gold cursor-pointer transition-colors">Raw Herbs</li>
                <li className="hover:text-prak-gold cursor-pointer transition-colors">Powders</li>
                <li className="hover:text-prak-gold cursor-pointer transition-colors">Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-6">Support</h4>
              <ul className="space-y-3">
                <li className="hover:text-prak-gold cursor-pointer transition-colors">Wholesale</li>
                <li className="hover:text-prak-gold cursor-pointer transition-colors">Quality Assurance</li>
                <li className="hover:text-prak-gold cursor-pointer transition-colors">Shipping & Returns</li>
                <li className="hover:text-prak-gold cursor-pointer transition-colors">FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-6">Newsletter</h4>
              <p className="mb-4 text-xs">Join our community for wellness tips.</p>
              <div className="flex gap-2">
                 <input type="email" placeholder="Your Email" className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-prak-gold w-full" />
                 <button className="bg-prak-gold text-prak-dark font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors">Go</button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>&copy; {new Date().getFullYear()} Milanà Ayurveda. All rights reserved.</p>
            <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onRemoveItem={removeFromCart}
        onClearCart={() => setCart([])}
      />

      {quoteItem && (
        <QuoteRequestModal 
          isOpen={isQuoteModalOpen}
          onClose={() => {setIsQuoteModalOpen(false); setQuoteItem(null);}}
          item={quoteItem}
        />
      )}
      
      {/* AI Consultant Widget */}
      <AIConsultant />

      {/* NEW: Vaidya AI Scanner */}
      <VaidyaScanner onAddBundleToCart={handleAddBundleToCart} />
    </div>
  );
}

export default App;
