import { TenantProvider, useTenant } from './context/TenantContext'
import BookingForm from './components/BookingForm'

function TenantApp() {
  const { tenant, loading, error } = useTenant()

  if (loading) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <p className="text-zinc-400 text-sm">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <p className="text-zinc-400 text-sm">Restaurant not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <h1 className="text-lg font-semibold text-zinc-900">{tenant.name}</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Reserve your table</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-8">
          <BookingForm tenant={tenant} />
        </div>
      </div>
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