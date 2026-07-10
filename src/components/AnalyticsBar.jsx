import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function AnalyticsBar({ tenant }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [tenant.id])

  async function fetchStats() {
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0]

    const { data, error } = await supabase
      .from('bookings')
      .select('status, booking_time')
      .eq('tenant_id', tenant.id)
      .gte('booking_date', firstOfMonth)

    if (error || !data) return setLoading(false)

    const total = data.length
    const confirmed = data.filter(b => b.status === 'confirmed').length
    const cancelled = data.filter(b => b.status === 'cancelled').length
    const completed = data.filter(b => b.status === 'completed').length

    // find most popular hour
    const hourCounts = {}
    data.forEach(b => {
      const hour = b.booking_time?.slice(0, 2)
      if (hour) hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })
    const popularHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]
    const formatHour = (h) => {
      const num = parseInt(h)
      return num === 12 ? '12 PM' : num > 12 ? `${num - 12} PM` : `${num} AM`
    }

    setStats({
      total,
      confirmed,
      cancelled,
      completed,
      popularTime: popularHour ? formatHour(popularHour[0]) : 'N/A'
    })
    setLoading(false)
  }

  if (loading) return null

  const cards = [
    { label: 'Total Bookings', value: stats.total },
    { label: 'Confirmed', value: stats.confirmed },
    { label: 'Completed', value: stats.completed },
    { label: 'Cancelled', value: stats.cancelled },
    { label: 'Busiest Time', value: stats.popularTime },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm"
        >
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
            {card.label}
          </p>
          <p className="text-2xl font-semibold text-zinc-900 mt-1">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  )
}