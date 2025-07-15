import { useEffect, useState } from "react";
import { LogoutButton } from "./logout-button";
import { createClient } from "@/lib/client";





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
          <header className="bg-purple-950 text-white p-4 flex justify-between items-center">
            <div className="text-xl font-bold"><a href="/">yaocrochets</a></div>
            {isLoggedIn  ? (
            <nav className="flex justify-between items-center space-x-4">
              <p></p>
              <LogoutButton />
              </nav>
               ) : (
            <nav className="flex justify-between items-center space-x-4">
              <a href="/auth/login" className="text-white hover:underline">Login</a>
              </nav>
                )}
          </header>
    )

}