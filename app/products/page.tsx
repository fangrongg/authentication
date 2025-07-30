'use client';

import Image from "next/image";
import { createClient } from '@/lib/client'
import { useState, useEffect } from 'react';
import { Sparkles, Filter, X } from "lucide-react";
import { toast } from 'sonner';
import Link from "next/link";

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

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    async function checkAuthStatus() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    }
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*'); 

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
        const tags = new Set<string>();
        data?.forEach(product => {
          if (product.tags) {
            product.tags.split(',').forEach((tag: string) => {
              if (tag.trim()) tags.add(tag.trim());
            });
          }
        });
        setAllTags(Array.from(tags).sort());
      }
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      // First delete from wishlist
      const { error: wishlistError } = await supabase
        .from('wishlist')
        .delete()
        .eq('product_id', id);

      if (wishlistError) {
        console.error('Error deleting from wishlist:', wishlistError);
        toast.error('Failed to remove product from wishlists');
        return;
      }

      // Then delete the product
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (productError) {
        console.error('Error deleting product:', productError);
        toast.error('Failed to delete product');
        return;
      }

      // Update local state and show success
      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error in deletion process:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const addToWishlist = async (product: Product) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error('Error fetching user or user not logged in:', userError);
      toast.info('Please login to add items to your wishlist.', { position: 'top-center' });
      return;
    }

    try {
      const { data: existingWishlist, error } = await supabase
        .from('wishlist')
        .select('*')
        .eq('product_id', product.id)
        .eq('user_id', userData.user.id);

      if (error) {
        console.error('Error checking wishlist:', error);
        toast.error('Failed to check wishlist status.', { position: 'top-center' });
        return;
      }

      if (existingWishlist.length > 0) {
        console.log('Product is already in wishlist');
        toast.info('This product is already in your wishlist!', { position: 'top-center' });
      } else {
        const { error: insertError } = await supabase
          .from('wishlist')
          .insert({
            product_id: product.id,
            user_id: userData.user.id,
          });

        if (insertError) {
          console.error('Error adding product to wishlist:', insertError);
          toast.error('Failed to add product to wishlist.', { position: 'top-center' });
        } else {
          console.log('Product added to wishlist successfully');
          toast.success(`${product.product_name} has been added to wishlist!`, {
            position: 'top-center',
            duration: 2000,
          });
        }
      }
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      toast.error('An unexpected error occurred.', { position: 'top-center' });
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const filteredProducts = selectedTags.length > 0
    ? products.filter(product => 
        product.tags && 
        selectedTags.some(tag => product.tags?.includes(tag))
      )
    : products;

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <div className="absolute top-20 left-8 text-rose-200 text-xl opacity-80 z-0">✿</div>
      <div className="absolute bottom-1/3 right-10 text-rose-300 text-lg z-0">✿</div>
      <div className="absolute top-1/4 right-20 text-rose-100 text-2xl z-0">✿</div>

      {isLoggedIn ? (
        <main className="flex-grow flex flex-col items-center p-8 z-10"> 
          <div className="w-full max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl text-gray-800 font-bold relative">
                Products
                <span className="absolute bottom-0 left-0 w-20 border-t border-rose-100"></span>
              </h1>
              
              <div className="flex items-center space-x-2">
                <Link href="/products/add-new-products">
                  <button className="bg-gradient-to-r border border-rose-600 text-rose-600 hover:bg-rose-100 font-light py-2 px-4 rounded-full text-sm tracking-wider hover:shadow-sm transition-all">
                    Add New Product
                  </button>
                </Link>
                <Link href="/products/add-category">
                  <button className="bg-gradient-to-r border border-rose-600 text-rose-600 hover:bg-rose-100 font-light py-2 px-4 rounded-full text-sm tracking-wider hover:shadow-sm transition-all">
                    Add Category
                  </button>
                </Link>
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center bg-gradient-to-r border border-rose-600 text-rose-600 hover:bg-rose-100 font-light py-2 px-4 rounded-full text-sm tracking-wider hover:shadow-sm transition-all"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  {selectedTags.length > 0 && (
                    <span className="ml-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {selectedTags.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {showFilter && (
              <div className="bg-white p-4 rounded-lg shadow-md border border-rose-100 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-800">Filter by Tags</h3>
                  <button 
                    onClick={() => setShowFilter(false)}
                    className="text-rose-400 hover:text-rose-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                {selectedTags.length > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-rose-400 hover:text-rose-600 text-xs flex items-center"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {selectedTags.length > 0 && (
              <div className="mb-6 flex items-center flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedTags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-medium flex items-center"
                  >
                    {tag}
                    <button 
                      onClick={() => toggleTag(tag)}
                      className="ml-1 text-rose-400 hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button 
                  onClick={clearFilters}
                  className="text-rose-400 hover:text-rose-600 text-xs flex items-center ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden border border-rose-50 hover:shadow-md transition-all flex flex-col">
                  <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.product_name}`} />
                  
                  <div className="relative aspect-square">
                    <Image
                      src={product.image || '/hehe.jpg'}
                      alt={product.product_name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToWishlist(product);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:cursor-pointer text-rose-400 hover:text-rose-600 transition-colors z-20"
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-grow relative z-20">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-sm font-semibold text-gray-800 break-words pr-2">{product.product_name}</h2> 
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                  product.availability === 'In Stock' || product.availability === 'Made To Order'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                        {product.availability}
                      </span>
                    </div>

                    <p className="text-gray-600 font-medium text-sm mb-1">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600 text-xs mb-2 h-10 overflow-hidden text-ellipsis line-clamp-3">
                      {product.description}
                    </p>
                      <div className="flex justify-between pt-2 border-t border-rose-50 mt-auto z-20">

                      </div>
                    {product.tags && product.tags.split(',').filter(tag => tag.trim() !== '').length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-auto mb-2">
                        {product.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                        {/* <a
                          href={`/products/edit/${product.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-rose-400 hover:text-rose-600 text-xs transition-colors relative z-30"
                        >
                          Edit
                        </a>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                          className="text-rose-300 hover:text-rose-500 text-xs transition-colors relative z-30"
                        >
                          Delete
                        </button> */}
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products match your filters</p>
                <button 
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-rose-400 to-rose-500 text-white font-light py-2 px-4 rounded-full text-sm tracking-wider hover:shadow-sm transition-all"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </main>
      ) : (
        <main className="flex-grow flex flex-col items-center p-8 z-10">
          <div className="w-full max-w-7xl">
            <h1 className="text-4xl text-gray-800 font-bold mb-8 relative text-center">
              Products
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 border-t border-rose-100"></span>
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {products.map((product) => (
                <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden border border-rose-50 hover:shadow-md transition-all flex flex-col">
                  <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.product_name}`} />
                  
                  <div className="relative aspect-square">
                    <Image
                      src={product.image || '/hehe.jpg'} 
                      alt={product.product_name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />

                    <a
                      href="/auth/login"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toast.info('Please login to add items to your wishlist', {
                          position: 'top-center',
                          duration: 2000,
                        });
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-rose-400 hover:text-rose-600 transition-colors z-20"
                    >
                      <Sparkles className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="p-4 flex flex-col flex-grow relative z-20">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-sm font-semibold text-gray-800 break-words pr-2">{product.product_name}</h2>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${
                  product.availability === 'In Stock' || product.availability === 'Made To Order'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                        {product.availability}
                      </span>
                    </div>

                    <p className="text-rose-500 font-medium text-sm mb-1">${product.price.toFixed(2)}</p>

                    <p className="text-gray-600 text-xs mb-2 h-10 overflow-hidden text-ellipsis line-clamp-3">
                      {product.description}
                    </p>

                    {product.tags && product.tags.split(',').filter(tag => tag.trim() !== '').length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {product.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

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