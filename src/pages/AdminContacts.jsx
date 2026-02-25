import React, { useEffect, useState } from 'react'
import './Contact.css'
import { api } from '../services/api'

export default function AdminContacts() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = (() => { try { return JSON.parse(localStorage.getItem('auth')).token } catch(e){return null} })()
    api.getContacts(token)
      .then(data => {
        setMessages(data.messages || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = (id) => {
    const token = (() => { try { return JSON.parse(localStorage.getItem('auth')).token } catch(e){return null} })()
    if (!confirm('Delete this message?')) return
    api.deleteContact(id, token).then(() => {
      setMessages(prev => prev.filter(m => m.id !== id))
    }).catch(err => alert('Delete failed: ' + err.message))
  }

  return (
    <div className="admin-contacts">
      <h1>Contact Messages</h1>
      {loading && <p>Loading…</p>}
      {error && <p className="field-error">{error}</p>}
      {!loading && !messages.length && <p>No messages</p>}
      {!loading && messages.length > 0 && (
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id}>
                <td>{msg.fullName}</td>
                <td>{msg.email}</td>
                <td>{msg.phone}</td>
                <td style={{maxWidth: '40ch', whiteSpace: 'normal'}}>{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
                <td><button onClick={() => handleDelete(msg.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
