
'use client';


import { createClient } from '@/lib/client'
import Image from 'next/image';
import { useState, useEffect } from 'react';


export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userEmail, setUserEmail] = useState<string | null>(null);


   useEffect(() => {
  async function checkAuthStatus() {

    const supabase = createClient()


    const { data, error } = await supabase.auth.getUser(); 
    // const isLoggedIn = !!data?.user;
      if (error || !data?.user) {
        setIsLoggedIn(false);
        // setUserEmail(null);
      } else {
        setIsLoggedIn(true);
        // setUserEmail(data?.user?.email ?? null);
      }
    }

    checkAuthStatus();

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
    
    <div className="mb-10 w-48 h-48 rounded-full overflow-hidden border border-rose-100">
      <Image
        src="/hehe.jpg"
        alt="Yaocrochets Logo"
        className="w-full h-full object-cover"
        width={192}
        height={192}
      />
    </div>

    <div className="flex flex-col gap-3 w-full max-w-xs">
      <a href="/products">
        <button className="w-full hover:cursor-pointer bg-gradient-to-r from-rose-700 to-pink-600 text-white font-light py-3 px-6 rounded-full text-sm tracking-wider hover:shadow-sm transition-all">
          View Collection
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
