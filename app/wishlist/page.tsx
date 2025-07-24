

"use client";
import Navbar from "@/components/navbar";
import { createClient } from "@/lib/client";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";




const supabase = createClient();


export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<any[]>([]); //need to state <any[]>([]) so when you set wishlist it knows what to expect

    const [product, setProduct] = useState<any[]>([]); 

    // check wishlist for user id and product id
    // get the product id that is same in wishlist and display the item


    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProduct(data);
            }
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchWishlist = async () => {
            const {data:userData, error:userError} = await supabase.auth.getUser();

            if (userError) {
                console.error('Error fetching user:', userError);
                return;
            }

                const { data:userWishlist, error } = await supabase
                .from('wishlist')
                .select('*')
                .eq('user_id', userData?.user?.id)

            if (error) {
                console.error('Error fetching wishlist:', error);
            } else {
                
                setWishlist(userWishlist);
            }

        }
        fetchWishlist();
    }, []);

    const removeFromWishlist = async (productId: string) => {
        const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('product_id', productId);

        if (error) {
            console.error('Error removing from wishlist:', error);
        } else {
            setWishlist((prevWishlist) => prevWishlist.filter((item) => item.product_id !== productId));
        }
    };


    return (
        <div className="w-full ">
            <Navbar />
            <div className='p-10 items-center justify-center'>

            <h1 className="pb-6 p-6 items-center font-bold text-2xl text-purple-600">Your Wishlist</h1>
                        <div className="flex-2 gap-6">
                            {product.map((item) => {
                                const isWished = wishlist.some((wish) => wish.product_id === item.id);
                                return isWished ? (
                                    <div key={item.id} className="flex bg-white shadow-md rounded-lg items-center p-6 mb-6 w-max">

                                    <img src={item.image || '/default-image.jpg'} alt={item.product_name} className="w-24 h-24 object-cover rounded-md mr-4" />    

                                    <div>
                                    <h2 className="text-lg font-semibold text-gray-800 pr-4">{item.product_name}</h2>

                                        <p className="text-gray-700 pr-4">Price: <span className="font-bold">${item.price}</span></p>

                                        <p className="text-gray-600 text-sm pr-4">Availability: <span className="font-medium">{item.availability}</span></p>

                                        <p className="text-red-600 text-sm pr-4 cursor-pointer hover:underline" onClick={() => removeFromWishlist(item.id)}>remove from wishlist</p>
                                    </div>
                                    
 
                                    </div>
                                ) : null;
                                })}


                        </div>
                        <div className="flex space-x-4">

                                <a href="/products">
                                    <p className="text-white bg-blue-500 pb-2 p-2 rounded w-max">Back to Products</p>
                                </a>
                                <a href="https://t.me/yaocrochets">
                                    <p className="text-white bg-blue-500 p-2 rounded w-max">Order Now!<Send className='inline-block ml-1 w-5 h-5' /></p>
                                </a>
                            
                        </div>


            </div>
            
        </div>
    );
}






























