"use client";
import { createClient } from "@/lib/client";
import { Send, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const supabase = createClient();

type Product = {
    id: string;
    product_name: string;
    price: number;
    availability: string;
    image?: string;
};

type WishlistItem = {
    product_id: string;
    user_id: string;
};

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [product, setProduct] = useState<Product[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
            setLoading(false);
        };
        checkAuth();
    }, []);

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
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchWishlist = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            
            const { data: userWishlist, error } = await supabase
                .from('wishlist')
                .select('*')
                .eq('user_id', user?.id);

            if (error) {
                console.error('Error fetching wishlist:', error);
            } else {
                setWishlist(userWishlist);
            }
        };
        fetchWishlist();
    }, [isLoggedIn]);

    const removeFromWishlist = async (productId: string) => {
        if (!isLoggedIn) return;

        const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('product_id', productId);

        if (error) {
            console.error('Error removing from wishlist:', error);
        } else {
            setWishlist(prev => prev.filter(item => item.product_id !== productId));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-pulse text-rose-300">Loading...</div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex flex-col bg-white relative">
                <div className="absolute top-20 left-8 text-rose-200 text-xl opacity-80">✿</div>
                <div className="absolute bottom-1/3 right-10 text-rose-300 text-lg">✿</div>
                <div className="absolute top-1/4 right-20 text-rose-100 text-2xl">✿</div>

                <main className="flex-grow flex flex-col items-center justify-center p-8 z-10">
                    <div className="max-w-md w-full text-center">
                        <h1 className="text-4xl text-gray-800 mb-4 font-bold">Your Wishlist</h1>
                        <p className="text-gray-600 mb-6">Login to view and manage your wishlist</p>
                        <div className="space-y-3">
                            <a 
                                href="/auth/login"
                                className="block bg-gradient-to-r from-rose-400 to-rose-500 text-white font-light py-3 px-6 rounded-full text-sm tracking-wider hover:shadow-sm transition-all"
                            >
                                Sign In
                            </a>
                            <a 
                                href="/products"
                                className="block bg-white text-rose-400 font-light py-3 px-6 rounded-full border border-rose-200 text-sm tracking-wider hover:bg-rose-50 transition-all"
                            >
                                Browse Products
                            </a>
                        </div>
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
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white relative">
            <div className="absolute top-20 left-8 text-rose-200 text-xl opacity-80">✿</div>
            <div className="absolute bottom-1/3 right-10 text-rose-300 text-lg">✿</div>
            <div className="absolute top-1/4 right-20 text-rose-100 text-2xl">✿</div>

            <main className="flex-grow flex flex-col p-8 z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl text-gray-800 mb-1 font-bold">Your Wishlist</h1>
                    <p className="text-rose-300 text-xs tracking-widest">handmade with love</p>
                </div>

                <div className="max-w-3xl mx-auto w-full">
                    {wishlist.length > 0 ? (
                        <div className="space-y-4">
                            {product.filter(item => 
                                wishlist.some(wish => wish.product_id === item.id)
                            ).map((item) => (
                                <div key={item.id} className="flex items-center bg-white border border-rose-100 rounded-lg p-4 hover:shadow-sm transition-all">
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <Image 
                                            src={item.image || '/hehe.jpg'} 
                                            alt={item.product_name} 
                                            width={96} 
                                            height={96} 
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>

                                    <div className="flex-grow px-6 flex flex-col">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-1">{item.product_name}</h2>
                                        <p className="text-gray-700 font-medium mb-2">${item.price.toFixed(2)}</p>
                                        <div className="mt-auto">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                item.availability === 'In Stock'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                {item.availability}
                                            </span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="p-2 text-rose-300 hover:text-rose-500 transition-colors"
                                        aria-label="Remove from wishlist"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 border border-rose-100 rounded-lg bg-rose-50">
                            <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                            <a 
                                href="/products"
                                className="bg-gradient-to-r from-rose-400 to-rose-500 text-white font-light py-2 px-4 rounded-full text-sm tracking-wider hover:shadow-sm transition-all"
                            >
                                Browse Products
                            </a>
                        </div>
                    )}

                    <div className="flex justify-center space-x-4 mt-8">
                        <a href="/products">
                            <button className="bg-gradient-to-r from-rose-400 to-rose-500 text-white font-light py-3 px-6 rounded-full text-sm tracking-wider hover:shadow-sm transition-all">
                                Back to Products
                            </button>
                        </a>
                        <a href="https://t.me/yaocrochets">
                            <button className="bg-white text-blue-400 font-light py-3 px-6 rounded-full border border-blue-200 text-sm tracking-wider hover:bg-blue-50 transition-all flex items-center">
                                Order Now <Send className="ml-1 w-4 h-4" />
                            </button>
                        </a>
                    </div>
                </div>
            </main>

            <footer className="bg-gradient-to-b from-white to-rose-200 py-6 mt-auto">
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
    );
}