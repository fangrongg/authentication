import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/server'
import { Button } from '@/components/ui/button'
import Image from 'next/image'


export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-svh w-full items-center justify-center gap-2 p-6">

      <div>
        <Image
          src="/thumbs-up-icon.jpg"
          alt="Logo"
          width={250}
          height={250}
        />
      </div>

      <p>
        successfully logged in as <span className='text-purple-600'>{data.user.email}</span>
      </p>

      <div className='gap-2 items-center justify-center'>
      <LogoutButton /> 
      
      <div className='pt-2'>
      <a href='/auth/update-password'>
        <Button className="bg-purple-500 text-white px-4 py-2 rounded-md">Update/reset password</Button> 
      </a>
      </div>
      </div>

  </div>
  )
}
