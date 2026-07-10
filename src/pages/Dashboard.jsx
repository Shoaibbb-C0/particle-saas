import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { MenuManager } from '../components/MenuManager'
import { BookingsManager } from '../components/BookingsManager'
import { AnalyticsBar } from '../components/AnalyticsBar'


export default function Dashboard() {
  const { user } = useAuth()
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTenant() {
      const { data, error } = await supabase
        .from('tenant_users')
        .select('tenant_id, tenants(id, name, slug)')
        .eq('user_id', user.id)
        .single()

      if (!error) setTenant(data.tenants)
      setLoading(false)
    }
    fetchTenant()
  }, [user])

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <p className="text-zinc-400 text-sm">Loading dashboard...</p>
    </div>
  )

  if (!tenant) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <p className="text-zinc-400 text-sm">No restaurant found for this account.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Top navbar */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-zinc-900">{tenant.name}</h1>
            <p className="text-xs text-zinc-400 mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-zinc-500 hover:text-zinc-800 font-medium transition"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        <AnalyticsBar tenant={tenant} />
        {/* Menu section */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <div className="px-6 py-5 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-900">Menu Items</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Add and manage your dishes</p>
          </div>
          <div className="p-6">
            <MenuManager tenant={tenant} />
          </div>
        </div>

        {/* Bookings section */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <div className="px-6 py-5 border-b border-zinc-100">
            <h2 className="text-sm font-semibold text-zinc-900">Bookings</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Manage incoming reservations</p>
          </div>
          <div className="p-6">
            <BookingsManager tenant={tenant} />
          </div>
        </div>
      </div>
    </div>
  )
}