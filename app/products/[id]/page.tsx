'use client';

import { createClient } from '@/lib/client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const supabase = createClient();

type Product = {
  id: string;
  product_name: string;
  price: number;
  description: string;
  availability: string;
  image?: string;
  tags?: string;
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (fetchError) {
        console.error('Error fetching product:', fetchError);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    fetchProduct();
    checkAuth();
  }, [params.id]);

  const addToWishlist = async () => {
    if (!isLoggedIn) {
      toast.info('Please login to add items to your wishlist');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          product_id: params.id,
          user_id: user?.id
        });

      if (error) throw error;

      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error('This item is already in your wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-rose-300">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <div className="absolute top-20 left-8 text-rose-200 text-xl opacity-80">✿</div>
      <div className="absolute bottom-1/3 right-10 text-rose-300 text-lg">✿</div>
      <div className="absolute top-1/4 right-20 text-rose-100 text-2xl">✿</div>

      <main className="flex-grow flex flex-col items-center p-8 z-10">
        <div className="w-full max-w-6xl">
          <Link href="/products" className="inline-block mb-6 text-rose-400 hover:text-rose-600 transition-colors">
            ← Back to products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-rose-100 shadow-lg">
              <Image
                src={product.image || '/hehe.jpg'}
                alt={product.product_name}
                fill
                className="object-cover"
                priority
              />
              <button 
                onClick={addToWishlist}
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full text-rose-400 hover:text-rose-600 transition-colors"
              >
                <Sparkles className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.product_name}</h1>
              
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.availability === 'In Stock' || product.availability === 'Made To Order'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {product.availability}
                </span>
              </div>

              <p className="text-gray-800 text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
              </div>

              {product.tags && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {isLoggedIn && (
                <div className="mt-auto flex gap-4 pt-6 border-t border-rose-100">
                  <Link 
                    href={`/products/edit/${product.id}`}
                    className="bg-white text-rose-400 font-light py-3 px-6 rounded-full border border-rose-200 text-sm tracking-wider hover:bg-rose-50 transition-all"
                  >
                    Edit Product
                  </Link>

                <Link 
                    href={`/products/delete/${product.id}`}
                    className="bg-white text-rose-400 font-light py-3 px-6 rounded-full border border-rose-200 text-sm tracking-wider hover:bg-rose-50 transition-all"
                  >
                    Delete Product
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

     
      <footer className="bg-gradient-to-b from-white to-rose-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-300 text-xxs mb-4 tracking-widest">EACH PIECE HANDMADE</p>
          <div className="flex justify-center space-x-6">
            <a href="https://www.instagram.com/yaocrochets" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-rose-800 hover:text-red-500 text-xxs tracking-widest transition-colors">
              instagram
            </a>
            <a href="https://t.me/yaocrochets" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-rose-800 hover:text-red-500 text-xxs tracking-widest transition-colors">
              telegram
            </a>
            <a href="https://www.carousell.sg/yaocrochets" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-rose-800 hover:text-red-500 text-xxs tracking-widest transition-colors">
              carousell
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}