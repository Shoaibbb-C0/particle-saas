import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function MenuManager({ tenant }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => { fetchItems() }, [tenant.id])

  async function fetchItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
    if (!error) setItems(data)
    setLoading(false)
  }

  async function addItem(e) {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.from('menu_items').insert({
      tenant_id: tenant.id,
      name,
      price: parseFloat(price),
      description,
    })
    if (error) { setError(error.message) } 
    else {
      setName(''); setPrice(''); setDescription('')
      fetchItems()
    }
  }

  async function deleteItem(id) {
    await supabase.from('menu_items').delete().eq('id', id)
    fetchItems()
  }

  if (loading) return <p className="text-sm text-zinc-400">Loading menu...</p>

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form onSubmit={addItem} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Dish name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="flex-1 px-3.5 py-2.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            Add
          </button>
        </div>
        {error && <p className="col-span-3 text-sm text-red-500">{error}</p>}
      </form>

      {/* Items list */}
      {items.length === 0 ? (
        <p className="text-sm text-zinc-400">No menu items yet. Add your first dish above.</p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-700">₹{item.price}</span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}