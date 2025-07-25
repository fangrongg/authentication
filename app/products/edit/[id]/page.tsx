'use client'

import { createClient } from '@/lib/client'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Category = {
  id: string;
  name: string;
  icon: string;
};

type ProductFormData = {
  productName: string;
  price: number;
  description: string;
  availability: string;
  tags: string;
  imageFile: FileList;
  categories: string[];
  currentImage?: string;
};

export default function EditProduct({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const productId = params.id;
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>()

  useEffect(() => {
    const fetchData = async () => {
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name, icon');
      setCategories(categoriesData || []);

      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productData) {
        setProduct(productData);
        setCurrentImageUrl(productData.image);
        
        setValue('productName', productData.product_name);
        setValue('price', productData.price);
        setValue('description', productData.description);
        setValue('availability', productData.availability);
        setValue('tags', productData.tags || '');
        
        if (productData.tags) {
          const tagList = productData.tags.split(',').map((tag: string) => tag.trim());
          const selectedCategories = categoriesData
            ?.filter(cat => tagList.includes(cat.name))
            .map(cat => cat.name) || [];
          setValue('categories', selectedCategories);
        }
      }
    };

    fetchData();
  }, [productId, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setUploading(true);
    let imageUrl = currentImageUrl;

    try {
      if (data.imageFile && data.imageFile.length > 0) {
        if (currentImageUrl) {
          const pathSegments = currentImageUrl.split('/');
          const fileName = pathSegments[pathSegments.length - 1];
          await supabase.storage.from('product-image').remove([fileName]);
        }

        const file = data.imageFile[0];
        const fileExtension = file.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from('product-image')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('product-image')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
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

      const { error: updateError } = await supabase
        .from('products')
        .update({
          product_name: data.productName,
          price: data.price,
          description: data.description,
          availability: data.availability,
          tags: finalTags,
          image: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      toast.success('Product updated successfully!');
      router.push('/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(`Failed to update product: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-700">
      <main className="flex-grow flex flex-col justify-center items-center max-w-4xl w-full mx-auto p-8 bg-white rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

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
                <p className="text-sm text-gray-500 col-span-full">No categories found.</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Product Image
            </label>
            {currentImageUrl && (
              <div className="mb-2">
                <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                <img 
                  src={currentImageUrl} 
                  alt="Current product" 
                  className="w-32 h-32 object-cover rounded-md mx-auto"
                />
              </div>
            )}
            <input
              type="file"
              id="imageUpload"
              {...register("imageFile")}
              className='w-full p-2 border border-rose-200 rounded-lg file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0 file:text-sm file:font-semibold
                         file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100'
              accept="image/*"
            />
          </div>

          <button
            type="submit"
            className='bg-white-700 border border-rose-300 hover:bg-rose-600 text-rose-300 p-2 rounded-full shadow-md transition-all duration-300 ease-in-out'
            disabled={uploading}
          >
            {uploading ? 'Updating...' : 'Update Product'}
          </button>
        </form>

        <div className='pt-4'>
          <Link href='/products' passHref>
            <Button className="bg-rose-700 hover:bg-rose-800 active:translate-y-px text-white font-semibold py-3 px-6 rounded-full shadow-md transition-all duration-300 ease-in-out">
              Back to Products
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