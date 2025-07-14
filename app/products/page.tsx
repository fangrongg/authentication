
'use client';


import Image from "next/image";
import { createClient } from '@/lib/client'
import { useState, useEffect } from 'react';
import { LogoutButton } from "@/components/logout-button";

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
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
      } else {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      }
    };

  return (
<div className="min-h-screen flex flex-col">
  <header className="bg-purple-950 text-white p-4 flex justify-between items-center">
    <div className="text-xl font-bold">Products</div>


        {isLoggedIn  ? (
      <nav>
        <a href="/protected" className='pb-3 mr-2'>
          <button 
            className="bg-purple-600 hover:bg-purple-950 text-white py-2 px-2 rounded-lg shadow-lg transition duration-300 ease-in-out">
            view protected page
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
            <p className="text-sm text-red-400">
              <a href={`/products/edit/${product.id}`}>edit</a>
            </p>
            <p className="text-sm text-red-400">
              <span className="cursor-pointer" onClick={() => handleDelete(product.id)}>delete</span>
            </p>
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
          <div key={product.id} className="bg-white shadow-md rounded-lg p-6 mb-6 max-w-md w-full">
            <Image
              src={ '/hehe.jpg'}
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
