import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const TenantContext = createContext(null)

export function TenantProvider({ children }) {
  const { slug } = useParams()
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchTenant() {
      setLoading(true)
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        setError('Restaurant not found')
      } else {
        setTenant(data)
      }
      setLoading(false)
    }

    fetchTenant()
  }, [slug])

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  return useContext(TenantContext)
}