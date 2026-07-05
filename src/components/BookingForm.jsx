import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function BookingForm({ tenant }) {
  // each field in the form gets its own state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [partySize, setPartySize] = useState(1)

  // separate states for feedback
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from('bookings')
      .insert({
        tenant_id: tenant.id,   // ties this booking to this restaurant
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        booking_date: date,
        booking_time: time,
        party_size: parseInt(partySize),
        status: 'confirmed'     // default status on creation
      })

    if (error) {
      setError('Something went wrong. Please try again.')
    } else {
      setSuccess(true)  // show success message instead of form
    }

    setLoading(false)
  }

  // swap the form out for a thank-you message on success
  if (success) {
    return (
      <div>
        <h2>Booking Confirmed!</h2>
        <p>Thanks {name}, we'll see you on {date} at {time}.</p>
        <button onClick={() => setSuccess(false)}>Make another booking</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Party Size</label>
        <input
          type="number"
          min="1"
          max="20"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
          required
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Table'}
      </button>
    </form>
  )
}