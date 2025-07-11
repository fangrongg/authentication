import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'


export default async function ProtectedPage() {
  const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
          redirect('/auth/login')
            }

  return (
      <div className="min-h-screen flex flex-col bg-gray-100 text-gray-700">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex flex-wrap justify-between items-center shadow-lg rounded-b-lg">
        {/* Brand/Home link */}
        <Link href="/" className="text-2xl font-bold text-gray-200 no-underline mr-6 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300">
          navbar
        </Link>

        <ul className="list-none m-0 p-0 flex flex-wrap gap-4 items-center md:flex-row flex-col w-full md:w-auto">
          <li>
            {/* Home Button */}
            <Link href="/" className="bg-green-600 hover:bg-green-700 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out inline-flex items-center justify-center w-full md:w-auto">
              Home
            </Link>
          </li>
          <li>
            {/* Reset Password Button */}
            <Link href="/auth/update-password" className="bg-blue-600 hover:bg-blue-700 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out inline-flex items-center justify-center w-full md:w-auto">
              Reset Password
            </Link>
          </li>
          <li>
            {/* Sign Out Button (assuming LogoutButton handles the actual logout logic) */}
            <LogoutButton />
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center items-center max-w-4xl w-full mx-auto my-8 p-8 bg-white rounded-2xl shadow-xl text-center">
        {/* Thumbs-up icon */}
        <div className="mb-6">
          <Image
            src="/thumbs-up-icon.jpg" // Ensure this path is correct relative to your public folder
            alt="Thumbs up icon"
            width={250}
            height={250}
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Welcome message */}
        <p className="text-xl font-medium text-gray-800 mb-6">
          Successfully logged in as <span className='text-purple-600 font-bold'>{data.user.email}</span>
        </p>

        {/* Update/Reset Password Button (kept in main content as a profile action) */}
        {/* Note: The "Reset Password" in the navbar is for general access, this one is specific to "Update" */}
        <div className='pt-2'>
          <Link href='/auth/update-password' passHref>
            {/* Assuming Button component accepts className for styling */}
            <Button className="bg-purple-500 hover:bg-purple-600 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out">
              Update/Reset Password
            </Button>
          </Link>
        </div>
      </main>
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
