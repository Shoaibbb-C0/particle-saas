import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function BookingsManager({ tenant }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBookings() }, [tenant.id])

  async function fetchBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('booking_date', { ascending: true })
    if (!error) setBookings(data)
    setLoading(false)
  }

  async function updateStatus(id, status) {
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchBookings()
  }

  const statusColors = {
    confirmed: 'bg-green-50 text-green-700 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
    completed: 'bg-zinc-100 text-zinc-500 border-zinc-200',
  }

  if (loading) return <p className="text-sm text-zinc-400">Loading bookings...</p>

  if (bookings.length === 0) return (
    <p className="text-sm text-zinc-400">No bookings yet. They'll appear here when customers reserve a table.</p>
  )

  return (
    <div className="divide-y divide-zinc-100">
      {bookings.map((booking) => (
        <div key={booking.id} className="py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900">{booking.customer_name}</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {booking.booking_date} at {booking.booking_time} · {booking.party_size} guests
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
            {booking.status === 'confirmed' && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(booking.id, 'completed')}
                  className="text-xs text-zinc-500 hover:text-zinc-800 font-medium transition"
                >
                  Complete
                </button>
                <button
                  onClick={() => updateStatus(booking.id, 'cancelled')}
                  className="text-xs text-red-400 hover:text-red-600 font-medium transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}