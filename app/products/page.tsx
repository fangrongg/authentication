
'use client';


import Image from "next/image";
import { createClient } from '@/lib/client'
import { useState, useEffect } from 'react';
import { LogoutButton } from "@/components/logout-button";
import { Plus, PlusIcon } from "lucide-react";

const supabase = createClient(); 

type Product = {
  id: string; 
  product_name: string;
  price: number;
  description: string;
  availability: string;
  image?: string; 
};

export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);



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

    

    useEffect(() => {
      const fetchProducts = async () => {
      
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          console.error('Error fetching products:', error);
        } else {
          setProducts(data);
        }
      }

      fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
      } else {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      }
    };


    // see if have duplicate , no dupe then inserrt to wishflsit 
    const addToWishlist = async (product: Product) => {
      const { data:userData, error:userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }

      try {
        const {data: existingWishlist, error} = await supabase
        .from('wishlist')
        .select('*')
        .eq('product_id', product.id)
        .eq('user_id', userData.user.id);

        if (error) {
          console.error('Error checking wishlist:', error);
          return;
        }

        if (existingWishlist.length > 0) {
          console.log('Product is already in wishlist');
          return;
        } else {
          const { error } = await supabase
            .from('wishlist')
            .insert({
              product_id: product.id,
              user_id: userData.user.id,
            });

          if (error) {
            console.error('Error adding product to wishlist:', error);
          } else {
            console.log('Product added to wishlist successfully');
          }
        }

      } catch (error) {
        console.error('Error adding product to wishlist:', error);
      }}

  return (
<div className="min-h-screen flex flex-col">
  <header className="bg-purple-950 text-white p-4 flex justify-between items-center">
    <div className="text-xl font-bold">Products</div>


        {isLoggedIn  ? (
      <nav>
        <a href="/wishlist" className='pb-3 mr-2'>
          <button 
            className="bg-purple-600 hover:bg-purple-950 text-white py-2 px-2 rounded-lg shadow-lg transition duration-300 ease-in-out">
            view wishlist
          </button>
        </a>
        <a href="/products/add-new-products" className='pb-3 mr-2'>
          <button 
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-2 rounded-lg shadow-lg transition duration-300 ease-in-out">
            add new products
          </button>
        </a>
        <LogoutButton />
      </nav>
                ) : (
      <nav>
      </nav>
    )}

  </header>


    {isLoggedIn  ? (
        <main className="flex-grow flex flex-col items-center p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 justify-center">Products</h1>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {products.map((product) => (
        <div key={product.id}>
          <div key={product.id} className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-md w-full">



            <Image
              src={product.image || '/hehe.jpg'}
              alt={product.product_name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{product.product_name}</h2>
            <p className="text-gray-700 mb-2">Price: ${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-sm text-gray-500">Availability: {product.availability}</p>


            <div onClick={() => addToWishlist(product)} className='flex items-center justify-center p-4 text-sm text-purple-500 hover:underline cursor-pointer'><p className='pr-1'>Add to wishlist</p>
              <PlusIcon
                className="h-4 w-4 text-purple-500 top-6 right-6" />
            </div>

            <div className='flex items-center justify-between mt-4'>
              <p className="text-sm text-blue-600 hover:underline">
                <a href={`/products/edit/${product.id}`}>edit</a>
              </p>
              <p className="text-sm text-red-400 hover:underline">
                <span className="cursor-pointer" onClick={() => handleDelete(product.id)}>delete</span>
              </p>
            </div>

          </div>
        </div>
      ))}
            
          </div>


        </main>
      ) : (

         <main className="flex-grow flex flex-col items-center p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 justify-center">Products</h1>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            
      {products.map((product) => (
        <div key={product.id}>
          <div key={product.id} className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-md w-full relative">
            <a href='/auth/login'>
              <p>Add to wishlist</p> <PlusIcon className="h-4 w-4 text-gray-500 absolute top-6 right-6" />
            </a>
            
            <Image
              src={'/hehe.jpg'}
              alt={product.product_name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{product.product_name}</h2>
            <p className="text-gray-700 mb-2">Price: ${product.price.toFixed(2)}</p>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-sm text-gray-500">Availability: {product.availability}</p>
          </div>
        </div>
      ))}
            
          </div>


        </main>

    )}

  <footer className="bg-gray-200 text-gray-600 p-4 text-center text-sm">
  yay
  </footer>
</div>
  );
}
