import { redirect } from 'next/navigation'

import { createClient } from '@/lib/server'

import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from '@/components/logout-button'


export default async function ProtectedPage() {
  const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
          redirect('/auth/login')
            }

  return (
      <div className="min-h-screen flex flex-col bg-white relative">
  <div className="absolute top-20 left-8 text-rose-200 text-xl opacity-80">✿</div>
  <div className="absolute bottom-1/3 right-10 text-rose-300 text-lg">✿</div>
  <div className="absolute top-1/4 right-20 text-rose-100 text-2xl">✿</div>

  <main className="flex-grow flex flex-col items-center justify-center p-8 text-center z-10">
    <div className="mb-10 w-48 h-48 rounded-full overflow-hidden border border-rose-100">
      <Image
        src="/hehe.jpg"
        alt="Profile"
        className="w-full h-full object-cover"
        width={192}
        height={192}
      />
    </div>

    <div className="mb-8">
      <p className="text-rose-400 text-sm">welcome back {data.user.email}!</p>
    </div>

    <div className="flex flex-col gap-3 w-full max-w-xs">
      <a href="/auth/update-password">
        <button className="w-full bg-gradient-to-r from-pink-600 to-rose-700 text-white font-light py-3 px-6 rounded-full text-sm tracking-wider hover:shadow-sm transition-all">
          Update Password
        </button>
      </a>

      <LogoutButton />
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
  )
}






// 'use client'; // This directive makes it a Client Component

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // For client-side navigation
// import { LogoutButton } from '@/components/logout-button'; // Assuming this is also a client component
// import { Button } from '@/components/ui/button'; // Assuming shadcn/ui Button component
// import Image from 'next/image';
// import Link from 'next/link';
// import { createClient } from '@/lib/client'; // Import a client-side Supabase client

// export default function ProtectedPage() {
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial state: not logged in
//   const [userEmail, setUserEmail] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true); // Loading state while checking auth

//   useEffect(() => {
//     // This effect runs only on the client-side after the component mounts
//     async function checkAuth() {
//       const supabase = createClient(); // Use the client-side Supabase client

//       const { data, error } = await supabase.auth.getUser();

//       if (error || !data?.user) {
//         // User is not logged in, redirect to login page
//         router.push('/auth/login?redirect_to=' + window.location.pathname);
//       } else {
//         // User is logged in
//         setIsLoggedIn(true);
//         setUserEmail(data.user.email);
//       }
//       setLoading(false); // Auth check complete
//     }

//     checkAuth();
//   }, [router]); // Re-run effect if router changes (though not typical for auth check)

//   // --- Conditional Rendering Logic ---

//   if (loading) {
//     // Display a loading state while authentication is being checked
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
//         <p className="text-xl font-medium">Checking authentication status...</p>
//         {/* You could add a spinner here */}
//       </div>
//     );
//   }

//   if (!isLoggedIn) {
//     // This block should ideally be short-lived if the redirect works quickly.
//     // It's a fallback for when the router.push hasn't completed yet.
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700 p-6 text-center">
//         <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
//         <p className="text-lg text-gray-700 mb-6">You must be logged in to view this page.</p>
//         <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300">
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

//   // If isLoggedIn is true, render the protected content
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100 text-gray-700">
//       {/* Navbar (can remain a client component or be a separate server component if lifted higher) */}
//       <nav className="bg-gray-900 text-white p-4 flex flex-wrap justify-between items-center shadow-lg rounded-b-lg">
//         <Link href="/" className="text-2xl font-bold text-gray-200 no-underline mr-6 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300">
//           My Secure App
//         </Link>
//         <ul className="list-none m-0 p-0 flex flex-wrap gap-4 items-center md:flex-row flex-col w-full md:w-auto">
//           <li>
//             <Link href="/" className="bg-green-600 hover:bg-green-700 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out inline-flex items-center justify-center w-full md:w-auto">
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link href="/auth/update-password" className="bg-blue-600 hover:bg-blue-700 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out inline-flex items-center justify-center w-full md:w-auto">
//               Reset Password
//             </Link>
//           </li>
//           <li>
//             <LogoutButton className="bg-red-600 hover:bg-red-700 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out inline-flex items-center justify-center w-full md:w-auto" />
//           </li>
//         </ul>
//       </nav>

//       {/* Main Content Area for Logged-in Users */}
//       <main className="flex-grow flex flex-col justify-center items-center max-w-4xl w-full mx-auto my-8 p-8 bg-white rounded-2xl shadow-xl text-center">
//         <div className="mb-6">
//           <Image
//             src="/thumbs-up-icon.jpg"
//             alt="Thumbs up icon"
//             width={250}
//             height={250}
//             className="rounded-lg shadow-md"
//           />
//         </div>

//         <p className="text-xl font-medium text-gray-800 mb-6">
//           Successfully logged in as <span className='text-purple-600 font-bold'>{userEmail}</span>
//         </p>

//         <div className='pt-2'>
//           <Link href='/auth/update-password' passHref>
//             <Button className="bg-purple-500 hover:bg-purple-600 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out">
//               Update/Reset Password
//             </Button>
//           </Link>
//         </div>
//       </main>
//     </div>
//   );
// }
