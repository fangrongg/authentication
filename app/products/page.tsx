'use client';

import Image from "next/image";
import { createClient } from '@/lib/client'
import { useState, useEffect } from 'react';
import { LogoutButton } from "@/components/logout-button"; // Assuming this path is correct
import { PlusIcon, Sparkle, Sparkles, UserRound } from "lucide-react";
import Footer from "@/components/footer"; // Assuming this path is correct
import Navbar from "@/components/navbar"; // Assuming this path is correct
import { toast } from 'sonner';

const supabase = createClient();

// Updated Product type to include tags
type Product = {
  id: string;
  product_name: string;
  price: number;
  description: string;
  availability: string;
  image?: string;
  tags?: string; // Add tags property
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

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
        .select('*'); // Ensure 'tags' column is selected

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []); // Ensure data is an array
      }
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    // This handleDelete is currently for 'wishlist', but the request was to delete a 'product'
    // Ensure you are targeting the correct table ('products' if you want to delete a product)
    const { error } = await supabase
      .from('products') // Changed from 'wishlist' to 'products' to match user's likely intent for a "Delete" button on a product card
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product.', { position: 'top-center' });
    } else {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      toast.success('Product deleted successfully!', { position: 'top-center' });
    }
  };


  const addToWishlist = async (product: Product) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) { // Check if user is logged in
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

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <div className="absolute top-20 left-8 text-rose-200 text-xl opacity-80 z-0">✿</div>
      <div className="absolute bottom-1/3 right-10 text-rose-300 text-lg z-0">✿</div>
      <div className="absolute top-1/4 right-20 text-rose-100 text-2xl z-0">✿</div>

      {isLoggedIn ? (
        <main className="flex-grow flex flex-col items-center p-8 z-10"> 
          <div className="w-full max-w-7xl">
            <h1 className="text-4xl text-gray-800 font-bold mb-8 relative">
              Products
              <span className="absolute bottom-0 left-0 w-20 border-t border-rose-100"></span>
            </h1>

            <a href="/products/add-new-products">
              <button className="bg-gradient-to-r border border-rose-600 text-rose-600 mr-2 mb-4 hover:bg-rose-100 font-light py-2 px-4 rounded-full text-sm tracking-wider hover:shadow-sm transition-all">
                Add New Product
              </button>
            </a>
            <a href="/products/add-category">
              <button className="bg-gradient-to-r border border-rose-600 text-rose-600 mr-2 mb-4 hover:bg-rose-100 font-light py-2 px-4 rounded-full text-sm tracking-wider hover:shadow-sm transition-all">
                Add Category
              </button>
            </a>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden border border-rose-50 hover:shadow-md transition-all">
                  <div className="relative">
                    <Image
                      src={product.image || '/hehe.jpg'}
                      alt={product.product_name}
                      width={400}
                      height={300}
                      className="w-full h-40 object-cover"
                    />

                    <button
                      onClick={() => addToWishlist(product)}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:cursor-pointer text-rose-400 hover:text-rose-600 transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.product_name}</h2>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                        product.availability === 'In Stock'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.availability}
                      </span>
                    </div>

                    <p className="text-gray-600 font-medium text-sm mb-1">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600 text-xs line-clamp-2 mb-2">{product.description}</p>

                    {product.tags && product.tags.split(',').filter(tag => tag.trim() !== '').length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 mb-2">
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

                    {isLoggedIn && (
                      <div className="flex justify-between pt-2 border-t border-rose-50">
                        <a
                          href={`/products/edit/${product.id}`}
                          className="text-rose-400 hover:text-rose-600 text-xs transition-colors"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-rose-300 hover:text-rose-500 text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      ) : (
        <main className="flex-grow flex flex-col items-center p-8 z-10">
          <div className="w-full max-w-7xl">
            <h1 className="text-4xl text-gray-800 font-bold mb-8 relative text-center">
              Products
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 border-t border-rose-100"></span>
            </h1>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden border border-rose-50 hover:shadow-md transition-all">
                  <div className="relative">
                    <Image
                      src={product.image || '/hehe.jpg'} 
                      alt={product.product_name}
                      width={400}
                      height={300}
                      className="w-full h-40 object-cover"
                    />

                    <a
                      href="/auth/login"
                      className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-rose-400 hover:text-rose-600 transition-colors"
                      onClick={() => {
                        toast.info('Please login to add items to your wishlist', {
                          position: 'top-center',
                          duration: 2000,
                        });
                      }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-sm font-semibold text-gray-800 line-clamp-1">{product.product_name}</h2>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                        product.availability === 'In Stock'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.availability}
                      </span>
                    </div>

                    <p className="text-rose-500 font-medium text-sm mb-1">${product.price.toFixed(2)}</p>
                    <p className="text-gray-600 text-xs line-clamp-2 mb-2">{product.description}</p>

                    {product.tags && product.tags.split(',').filter(tag => tag.trim() !== '').length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
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