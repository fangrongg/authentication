"use client"

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/client' 
import { Button } from '@/components/ui/button' 
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { toast } from 'sonner' 
const supabase = createClient();

type Category = {
  id: string; 
  name: string;
  icon: string; 
};


type CrochetFormData = {
  productName: string;
  price: number;
  description: string;
  availability: string;
  tags: string;
  imageFile: FileList; 
  categories: string[];
};

export default function AddNewProducts() {
  const [categories, setCategories] = useState<Category[]>([]); 
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset, 
    formState: { errors },
  } = useForm<CrochetFormData>()


  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, icon');

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(
          (data || []).map((cat) => ({
            id: cat.id,
            name: cat.name,
            icon: cat.icon ?? '', 
          }))
        );
      }
    };

    fetchCategories();
  }, []); 
  const onSubmit = async (data: CrochetFormData) => {
    setUploading(true); 
    let imageUrl: string | null = null; 

    try {

      if (data.imageFile && data.imageFile.length > 0) {
        const file = data.imageFile[0];
        const fileExtension = file.name.split('.').pop();

        const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
        const bucketName = 'product-image'; 

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600', 
            upsert: false, 
          });

        if (uploadError) {
          console.error('Supabase image upload error:', uploadError.message);
          toast.error(`Failed to upload image: ${uploadError.message}`);
          setUploading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
        toast.success('Image uploaded successfully!');
      }

      let finalTags = data.tags;
      if (data.categories && data.categories.length > 0) {
        const selectedCategoryNames = data.categories.join(', '); 
        if (finalTags) {
          finalTags = `${finalTags}, ${selectedCategoryNames}`; 
        } else {
          finalTags = selectedCategoryNames; 
        }
      }

      const { data: insertedData, error: insertError } = await supabase
        .from('products')
        .insert([
          {
            product_name: data.productName,
            price: data.price,
            description: data.description,
            availability: data.availability,
            tags: finalTags, 
            image: imageUrl, 
          },
        ])
        .select();

      if (insertError) {
        console.error('Supabase product insert error:', insertError.message);
        toast.error(`Failed to add product: ${insertError.message}`);


        if (imageUrl) {
    
          const pathSegments = imageUrl.split('/');
          const fileNameInBucket = pathSegments[pathSegments.length - 1]; 
          const bucketName = 'product-image';

          await supabase.storage.from(bucketName).remove([fileNameInBucket]);
          console.log('Uploaded image removed due to product insert error.');
        }

        setUploading(false);
        return;
      }

      console.log('Product inserted successfully:', insertedData);
      toast.success('Product added successfully!');
      reset(); 
      setUploading(false);
      redirect('/products'); 
    } catch (error: any) {
      console.error('Catch block: Error during product submission:', error);
      toast.error('An unexpected error occurred. Please try again.');
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-700">

      <main className="flex-grow flex flex-col justify-center items-center max-w-4xl w-full mx-auto p-8 bg-white rounded-2xl shadow-xl text-center">


        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto">
          <input
            {...register("productName", { required: "Product Name is required" })}
            placeholder="Product Name"
            className='border p-2 rounded-md'
          />
          {errors.productName && <p className="text-red-500 text-sm">{errors.productName.message}</p>}

          <input
            {...register("price", { required: "Price is required", valueAsNumber: true })}
            placeholder="Price"
            type="number"
            step="0.01" 
            className='border p-2 rounded-md'
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Description"
            className='border p-2 rounded-md'
            rows={4} 
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

          <input
            {...register("availability", { required: "Availability is required" })}
            placeholder="Availability (e.g., In Stock, Made to Order)"
            className='border p-2 rounded-md'
          />
          {errors.availability && <p className="text-red-500 text-sm">{errors.availability.message}</p>}

          <div className="text-left w-full mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Categories:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      value={category.name}
                      {...register("categories")}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-900">
                      {category.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 col-span-full">No categories found. Add some in the category management page.</p>
              )}
            </div>
            {errors.categories && <span className="text-red-500 text-sm">{errors.categories.message}</span>}
          </div>

          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1 text-left">Product Image</label>
            <input
              type="file" 
              id="imageUpload"
              {...register("imageFile", { required: false })} 
              className='w-full p-2 border border-rose-200 rounded-lg file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0 file:text-sm file:font-semibold
                         file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100'
              accept="image/*"
            />
            {errors.imageFile && <p className="text-red-500 text-sm">{errors.imageFile.message}</p>}
          </div>

          <button
            type="submit"
            className='bg-white-700 border border-rose-300 hover:bg-rose-600 text-rose-300 p-2 rounded-full shadow-md transition-all duration-300 ease-in-out'
            disabled={uploading} 
          >
            {uploading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>

        <div className='pt-2'>
          <Link href='/products' passHref>
            <Button className="bg-rose-700 hover:bg-rose-8is good
            00 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out">
              back to products
            </Button>
          </Link>
        </div>
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