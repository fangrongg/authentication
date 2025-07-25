'use client'

import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    toast.success('Logged out successfully!')
  }

  return <Button onClick={logout} className="w-full bg-white text-rose-400 font-light py-3 px-6 rounded-full border border-rose-200 text-sm tracking-wider hover:bg-rose-50 transition-all">Logout</Button>
}
