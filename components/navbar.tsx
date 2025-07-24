
'use client';

import { useEffect, useState } from "react";
import { LogoutButton } from "./logout-button";
import { createClient } from "@/lib/client";
import { BaggageClaim, ShoppingBag, Sparkles, User, UserRound } from "lucide-react";





export default function Navbar() {

      const [isLoggedIn, setIsLoggedIn] = useState(false);

    
    
       useEffect(() => {
      async function checkAuthStatus() {
    
        const supabase = createClient()
    
    
        const { data, error } = await supabase.auth.getUser(); 
          if (error || !data?.user) {
            setIsLoggedIn(false);
          } else {
            setIsLoggedIn(true);
          }
        }
    
        checkAuthStatus();
    
        }, []);
    

    return (
        <header 
        className="bg-gradient-to-b from-rose-100 to-white py-5 px-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold text-rose-800">
              <a href="/">yaocrochets.</a>
            </div>
            <nav className="flex justify-between items-center space-x-4">
              <p></p>
              <div title='View Products' className='p-1.5 rounded-md hover:bg-rose-200 text-rose-700 cursor-pointer'>
                <a href='/products'><ShoppingBag className="w-6 h-6 hover:text-rose-500 transition-colors duration-200" /></a>
              </div>
              <div title='View Wishlist' className='p-1.5 rounded-md hover:bg-rose-200 text-rose-700 cursor-pointer'>
                <a href='/wishlist'><Sparkles className="w-6 h-6 hover:text-rose-500 transition-colors duration-200" /></a>
              </div>
              <div title='View Profile' className='p-1.5 rounded-md hover:bg-rose-200 text-rose-700 cursor-pointer'>
                <a href='/protected'><UserRound className="w-6 h-6 font-bold hover:text-rose-500 transition-colors duration-200" /></a>
              </div>
              
            </nav>
          </div>
        </header>
    )

}