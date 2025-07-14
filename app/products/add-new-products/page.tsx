"use client"

import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'


const supabase = createClient();

type CrochetFormData = {
  productName: string;
  price: number;
  description: string;
  availability: string;
  image?: string; // ? -> mean optional
};



export default function AddNewProducts() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CrochetFormData>()

  // const onSubmit = (data: CrochetFormData) => console.log(data);

  const onSubmit = async (data: CrochetFormData) => {

  try {
    const { data: insertedData, error } = await supabase
      .from('products')
      .insert([
        {
          product_name: data.productName,
          price: data.price,
          description: data.description,
          availability: data.availability,
          image: data.image || null,
        },
      ])
      .select();

  } catch (error) {
    console.error('Error inserting data:', error);
    alert('Failed to add product. Please try again.');
   }

   redirect('/products');


  }


  return (
      <div className="min-h-screen flex flex-col bg-gray-100 text-gray-700">

      <nav className="bg-purple-900 text-white p-4 flex flex-wrap justify-between items-center shadow-lg rounded-b-lg">
        <Link href="/" className="text-2xl font-bold text-gray-200 no-underline mr-6 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300">
          Add New Products
        </Link>

        <ul className="list-none m-0 p-0 flex flex-wrap gap-4 items-center md:flex-row flex-col w-full md:w-auto">
          <li>
            <Link href="/" className="bg-green-600 hover:bg-green-700 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out inline-flex items-center justify-center w-full md:w-auto">
              Home
            </Link>
          </li>
          <li>
            <Link href="/auth/update-password" className="bg-blue-600 hover:bg-blue-700 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out inline-flex items-center justify-center w-full md:w-auto">
              Reset Password
            </Link>
          </li>
          <li>

            <LogoutButton />
          </li>
        </ul>
      </nav>

      <main className="flex-grow flex flex-col justify-center items-center max-w-4xl w-full mx-auto my-8 p-8 bg-white rounded-2xl shadow-xl text-center">

        <div className="mb-6">
          <Image
            src="/thumbs-up-icon.jpg"
            alt="Thumbs up icon"
            width={250}
            height={250}
            className="rounded-lg shadow-md"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto">

          <input 
          {...register("productName", { required: true })}
          placeholder="Product Name" 
          className='border p-2 rounded-md'
           />

          <input 
          {...register("price", { required: true })}
          placeholder="Price"
          type="number"
          className='border p-2 rounded-md'
          />

          <textarea 
          {...register("description", { required: true })}
          placeholder="Description"
          className='border p-2 rounded-md'
          />

          <input 
          {...register("availability", { required: true })}
          placeholder="Availability"
          className='border p-2 rounded-md'
          />

          <input 
          {...register("image")}
          placeholder="Image URL"
          className='border p-2 rounded-md'
          />

          <button 
          type="submit" 
          className='bg-blue-500 hover:bg-blue-800 text-white p-2 rounded-full shadow-md transition-all duration-300 ease-in-out'>
          Add Product
          </button>


        </form>

        <div className='pt-2'>
          <Link href='/products' passHref>

            <Button className="bg-purple-500 hover:bg-purple-600 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out">
              back to products
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
  }