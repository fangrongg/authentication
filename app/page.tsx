
'use client';


import { createClient } from '@/lib/client'
import { useState, useEffect } from 'react';
import { LogoutButton } from "@/components/logout-button";

export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);


   useEffect(() => {
  async function checkAuthStatus() {

    const supabase = createClient()


    const { data, error } = await supabase.auth.getUser(); 
    // const isLoggedIn = !!data?.user;
      if (error || !data?.user) {
        setIsLoggedIn(false);
        setUserEmail(null);
      } else {
        setIsLoggedIn(true);

      }
    }

    checkAuthStatus();

    }, []);


  return (
<div className="min-h-screen flex flex-col">
  <header className="bg-purple-950 text-white p-4 flex justify-between items-center">
    <div className="text-xl font-bold">Yay</div>
    <nav>
      </nav>
  </header>

    {isLoggedIn  ? (
        <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Hello</h1>
        <p className='pb-5'>Hello, {userEmail}! You are logged in.</p>

        <a href="/protected" className='pb-3'>
          <button 
            className="bg-purple-600 hover:bg-purple-950 text-white py-2 px-2 rounded-lg shadow-lg transition duration-300 ease-in-out">
            view protected page
          </button>
        </a>

        <a href="/products" className='pb-3'>
          <button 
            className="bg-purple-600 hover:bg-purple-950 text-white py-2 px-2 rounded-lg shadow-lg transition duration-300 ease-in-out">
            view products
          </button>
        </a>

      <LogoutButton />
        </main>
      ) : (

  <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
    <h1 className="text-4xl font-bold mb-4">Hello</h1>

    <img
      src="/hehe.jpg"
      alt="Welcome illustration"
      className="w-64 h-64 object-contain mb-10"
    />
    <div>
      <p className="text-lg text-gray-700 mb-8 max-w-xl">
        This is the main page. Please login to view protected page
      </p>
    </div>

    <div>
    <a href="/auth/login">
      <button className="bg-purple-600 m-2 hover:bg-purple-950 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg transition duration-300 ease-in-out">
        Log In
      </button>
    </a>
    <a href="/auth/sign-up">
      <button className="bg-purple-900 m-2 hover:bg-purple-950 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg transition duration-300 ease-in-out">
        No account? Sign Up
      </button>
    </a>

    
    <a href="/products" className='pb-3'>
      <button 
        className="bg-purple-600 hover:bg-purple-950 text-white py-2 px-2 rounded-lg shadow-lg transition duration-300 ease-in-out">
        view products
      </button>
    </a>


    </div>
  </main>

    )}

  <footer className="bg-gray-200 text-gray-600 p-4 text-center text-sm">
  yay
  </footer>
</div>
  );
}
