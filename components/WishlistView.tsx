import React from 'react';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { Product, CartItem } from '../types';
import ProductCard from './ProductCard';

interface WishlistViewProps {
  products: Product[];
  wishlistIds: string[];
  onAddToCart: (item: CartItem) => void;
  onRequestQuote: (item: CartItem) => void;
  onToggleWishlist: (id: string) => void;
  onBackToShop: () => void;
}

const WishlistView: React.FC<WishlistViewProps> = ({
  products,
  wishlistIds,
  onAddToCart,
  onRequestQuote,
  onToggleWishlist,
  onBackToShop
}) => {
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-4">
                <button 
                  onClick={onBackToShop}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-white hover:text-prak-green transition-colors text-gray-500"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-3xl font-serif font-bold text-prak-dark flex items-center gap-3">
                    My Wishlist
                    <Heart className="text-red-500 fill-red-500" size={24} />
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">Your saved Ayurvedic essentials</p>
                </div>
            </div>
            <div className="glass-panel px-4 py-2 rounded-full text-sm text-gray-600 font-medium">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'Item' : 'Items'} Saved
            </div>
        </div>
        
        {/* Grid */}
        {wishlistProducts.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center border-dashed border-2 border-gray-300">
             <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={40} className="text-red-300" />
             </div>
             <h3 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
             <p className="text-gray-500 mb-8 max-w-sm mx-auto">Explore our collection of premium raw herbs and add your favorites here.</p>
             <button 
               onClick={onBackToShop}
               className="bg-prak-green text-white px-8 py-3 rounded-full font-bold hover:bg-prak-lightGreen transition-colors inline-flex items-center gap-2 shadow-lg"
             >
               <ShoppingBag size={18} /> Browse Store
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {wishlistProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onRequestQuote={onRequestQuote}
                isWishlisted={true}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
    </div>
  );
}

export default WishlistView;