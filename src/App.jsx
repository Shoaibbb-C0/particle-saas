import { TenantProvider, useTenant } from './context/TenantContext'
import BookingForm from './components/BookingForm'

function TenantApp() {
  const { tenant, loading, error } = useTenant()

  if (loading) return <div>Loading restaurant...</div>
  if (error) return <div>Restaurant not found</div>

  return (
    <div>
      <h1>Welcome to {tenant.name}</h1>
      <p>Reserve your table below</p>
      <BookingForm tenant={tenant} />
    </div>
  )
}

export default function App() {
  return (
    <TenantProvider>
      <TenantApp />
    </TenantProvider>
  )
}