import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function BookingsManager({ tenant }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [tenant.id])

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
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (!error) fetchBookings()
  }

  if (loading) return <p>Loading bookings...</p>

  return (
    <div>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Party</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.customer_name}</td>
                <td>{booking.booking_date}</td>
                <td>{booking.booking_time}</td>
                <td>{booking.party_size}</td>
                <td>{booking.status}</td>
                <td>
                  {booking.status === 'confirmed' && (
                    <>
                      <button onClick={() => updateStatus(booking.id, 'completed')}>
                        Complete
                      </button>
                      <button onClick={() => updateStatus(booking.id, 'cancelled')}>
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}