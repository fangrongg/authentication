'use client';

import { createClient } from '@/lib/client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

type Product = {
  id: string;
  product_name: string;
  image?: string;
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedIds] = useState<string[]>(['1', '2', '3', '4', '5']);

  const [emblaRef] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    align: 'center',
    containScroll: 'trimSnaps'
  }, [
    Autoplay({ delay: 3000, stopOnInteraction: false })
  ]);

  useEffect(() => {
    async function checkAuthStatus() {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser(); 
      if (error || !data?.user) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    }

    async function fetchFeaturedProducts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('id, product_name, image')
        .in('id', selectedIds);

      if (!error && data) {
        setFeaturedProducts(data);
      }
    }

    checkAuthStatus();
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <div className="absolute top-20 left-8 text-rose-200 text-xl opacity-80">✿</div>
      <div className="absolute bottom-1/3 right-10 text-rose-300 text-lg">✿</div>
      <div className="absolute top-1/4 right-20 text-rose-100 text-2xl">✿</div>



      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center z-10">
        <div className="mb-8">
          <h1 className="text-4xl text-gray-800 mb-1 font-bold">@yaocrochets</h1>
          <p className="text-rose-300 text-xs tracking-widest">made with love</p>
        </div>
        
      {featuredProducts.length > 0 && (
        <div className="w-full py-8">
          <div className="container mx-auto px-4">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {featuredProducts.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_40%] lg:flex-[0_0_30%] xl:flex-[0_0_22%] min-w-0 px-2 relative group"
                  >
                    <a href={`/products/${product.id}`} className="block">
                      <div className="relative h-64 w-full rounded-lg overflow-hidden border-2 border-rose-100 shadow-sm mx-auto max-w-xs">
                        <Image
                          src={product.image || '/default-product.jpg'}
                          alt={product.product_name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, (max-width: 1024px) 40vw, 22vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <h2 className="text-white text-lg font-medium group-hover:underline transition-all">
                            {product.product_name}
                          </h2>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a href="/products">
            <button className="w-full hover:cursor-pointer bg-gradient-to-r from-rose-700 to-pink-600 text-white font-light py-3 px-6 rounded-full text-sm tracking-wider hover:shadow-sm transition-all">
              View All Products
            </button>
          </a>

          <a href={isLoggedIn ? "/protected" : "/auth/login"}>
            <button className="w-full bg-white text-rose-400 font-light py-3 px-6 rounded-full border border-rose-200 text-sm tracking-wider hover:bg-rose-50 transition-all">
              {isLoggedIn ? "My Profile" : "Log In"}
            </button>
          </a>
        </div>

        <div className="mt-12 w-20 border-t border-red-100"></div>
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