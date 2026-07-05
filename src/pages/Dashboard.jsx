import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { MenuManager } from '../components/MenuManager'
import { BookingsManager } from '../components/BookingsManager'

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

  if (loading) return <div>Loading dashboard...</div>
  if (!tenant) return <div>No restaurant found for this account.</div>

  return (
    <div>
      <h1>{tenant.name} — Dashboard</h1>
      <p>Logged in as: {user.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Log Out</button>

      <section>
        <h2>Menu Items</h2>
        <MenuManager tenant={tenant} />
      </section>

      <section>
        <h2>Bookings</h2>
        <BookingsManager tenant={tenant} />
      </section>
    </div>
  )
}