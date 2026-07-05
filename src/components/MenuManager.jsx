import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function MenuManager({ tenant }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [tenant.id])

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

    const { error } = await supabase
      .from('menu_items')
      .insert({
        tenant_id: tenant.id,
        name,
        price: parseFloat(price),
        description,
      })

    if (error) {
      setError(error.message)
    } else {
      setName('')
      setPrice('')
      setDescription('')
      fetchItems() // refresh the list
    }
  }

  async function deleteItem(id) {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (!error) fetchItems()
  }

  if (loading) return <p>Loading menu...</p>

  return (
    <div>
      <form onSubmit={addItem}>
        <input
          type="text"
          placeholder="Dish name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Item</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {items.length === 0 ? (
        <p>No menu items yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> — ₹{item.price}
              {item.description && <span> · {item.description}</span>}
              <button onClick={() => deleteItem(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}