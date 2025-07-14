

import { createClient } from '@/lib/server'
import { LogoutButton } from '@/components/logout-button';


export default async function EditProduct({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const productId = params.id;

  const { data: products } = await supabase.from('products').select('*').eq('id', productId);

  if (!products) {
    return <p>No products found.</p>
  }


  const updateProductAction = async (formData: FormData) => {
    'use server';

    const supabase = await createClient();

    const updatedProductName = formData.get('product_name') as string;
    const updatedPrice = parseFloat(formData.get('price') as string); 
    const updatedDescription = formData.get('description') as string;
    const updatedAvailability = formData.get('availability') as string;
    const updatedImage = formData.get('image') as string;
  
  
    const updates = {
    product_name: updatedProductName,
    price: updatedPrice,
    description: updatedDescription ,
    availability: updatedAvailability ,
    image: updatedImage, 
    };



      const { error: updateError } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId);

      if (updateError) {
      console.error('Error updating product:', updateError);

    }



  }


  return (
    <div key={productId} className='flex flex-col items-center justify-center gap-4 p-4'>
      <h1 className='text-2xl font-bold'>Edit Product</h1>
      <form action={updateProductAction}>
        <div className='flex flex-col gap-4 w-full max-w-md mx-auto'>
          <input type="text" name="product_name" defaultValue={products[0]?.product_name} className='border p-2 pr-50 rounded-md' />
          <input type="number" name="price" defaultValue={products[0]?.price} className='border p-2 rounded-md' />
          <textarea name="description" defaultValue={products[0]?.description} className='border p-2 rounded-md' />
          <input type="text" name="availability" defaultValue={products[0]?.availability} className='border p-2 rounded-md' />
          <input type="text" name="image" defaultValue={products[0]?.image} className='border p-2 rounded-md' />
          <button type="submit" className='bg-blue-500 hover:bg-blue-800 text-white p-2 rounded-full shadow-md transition-all duration-300 ease-in-out'>Update Product</button>

        </div>
 </form>

  <LogoutButton />
      
    </div>
  )
}

