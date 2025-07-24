"use client"

import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useEffect, useState, SVGProps } from 'react'
import { toast } from 'sonner'

const supabase = createClient();

type CategoryData = {
  name: string;
  icon: string;
};

interface DynamicLucideIconProps extends SVGProps<SVGSVGElement> {
  iconName: string;
}

const DynamicLucideIcon: React.FC<DynamicLucideIconProps> = ({ iconName, ...props }) => {
  const [IconComponent, setIconComponent] = useState<React.ElementType | null>(null);

  useEffect(() => {
    if (iconName) {
      import(`lucide-react`)
        .then((module) => {
          const PascalCaseIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
          // @ts-ignore
          if (module[PascalCaseIconName]) {
            // @ts-ignore
            setIconComponent(() => module[PascalCaseIconName]);
          } else {
            console.warn(`Lucide icon "${iconName}" not found.`);
            setIconComponent(null);
          }
        })
        .catch((error) => {
          console.error(`Error loading icon "${iconName}":`, error);
          setIconComponent(null);
        });
    }
  }, [iconName]);

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
};

export default function AddCategory() {
  const [categories, setCategories] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryData>()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching categories:', error);
      } else {
        setCategories(data);
      }
    }

    fetchCategories();
  }, []);

  const onSubmit = async (data: CategoryData) => {
    try {
      const { data: insertedData, error } = await supabase
        .from('categories')
        .insert([{ name: data.name, icon: data.icon }])
        .select();

      if (error) throw error;

      toast.success(`"${data.name}" category added successfully!`);
      setCategories(prev => [insertedData[0], ...prev]);
      reset();
    } catch (error: any) {
      console.error('Error inserting data:', error);
      toast.error(`Failed to add category: ${error.message}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <div className="absolute top-20 left-8 text-rose-200 text-xl opacity-80">✿</div>
      <div className="absolute bottom-1/3 right-10 text-rose-300 text-lg">✿</div>
      <div className="absolute top-1/4 right-20 text-rose-100 text-2xl">✿</div>

      <main className="flex-grow flex flex-col items-center p-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white p-8 rounded-lg border border-rose-50 mb-8">
            <h1 className="text-3xl text-gray-800 font-bold mb-6 relative pb-2">
              Add New Category
              <span className="absolute bottom-0 left-0 w-20 border-t border-rose-100"></span>
            </h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="e.g. Summer Collection"
                  className='w-full p-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300'
                />
                {errors.name && <p className="mt-1 text-sm text-rose-500">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lucide Icon Name</label>
                <input
                  {...register("icon", { required: "Icon name is required" })}
                  placeholder="e.g. sparkles, heart, sun"
                  className='w-full p-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300'
                />
                {errors.icon && <p className="mt-1 text-sm text-rose-500">{errors.icon.message}</p>}
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-400 to-rose-500 text-white font-light py-3 px-6 rounded-full text-sm tracking-wider hover:shadow-sm transition-all"
              >
                Add Category
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-lg border border-rose-50">
            <h2 className="text-2xl text-gray-800 font-bold mb-6 relative pb-2">
              Existing Categories
              <span className="absolute bottom-0 left-0 w-20 border-t border-rose-100"></span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="flex items-center p-4 border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  {category.icon && (
                    <DynamicLucideIcon 
                      iconName={category.icon} 
                      className="h-5 w-5 text-rose-400 mr-2" 
                    />
                  )}
                  <span className="text-gray-800 font-medium truncate">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link href='/products'>
              <button className="bg-white text-rose-400 font-light py-3 px-6 rounded-full border border-rose-200 text-sm tracking-wider hover:bg-rose-50 transition-all">
                Back to Products
              </button>
            </Link>
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
  )
}