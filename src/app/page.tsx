'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from './lib/supabase_client'
import type { Session } from '@supabase/supabase-js'


interface Slot {
  _id: string
  title: string
  startTime: Date
  endTime: Date
  email: string
  reminderSent: boolean
}



export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [crons, setCrons] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setSession(session)

      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/getslot/${session.user.email}`)
          const data = await res.json()
          setCrons(data.slots);
          console.log("Slots:", data.slots)
        } catch (err) {
          console.error("Fetch error:", err)
        }
        finally {
          setLoading(false);
        }
      }
    }

    getSession()
  }, [])

  const handleAddSlot = async () => {
    if (!title || !date || !startTime || !endTime) {
      alert('Please fill in all fields.')
      return
    }

    const start = new Date(`${date}T${startTime}`)
    const end = new Date(`${date}T${endTime}`)

    if (start < new Date()) {
      alert('You cannot create a slot in the past.')
      return
    }
    if (start >= end) {
      alert('End time must be after start time.')
      return
    }

    const res = await fetch('/api/addslot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        startTime: start,
        endTime: end,
        email: session?.user?.email
      })
    })
    const data = await res.json()
    console.log(data)

    setCrons((prev) => [...prev, data.slot])
    setAdding(false)
    setTitle('')
    setDate('')
    setStartTime('')
    setEndTime('')
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/deleteslot/${id}`,{
        method: 'DELETE'
      })
      const data = await res.json()
      console.log("Slot Deleted :", data.slots)
    } catch (err) {
      console.error("Fetch error:", err)
    }
  }
  return loading ? (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <p className="text-indigo-700 text-xl font-medium animate-pulse">
        Loading your dashboard...
      </p>
    </div>
  ) : !session ? (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="p-10 bg-white shadow-2xl rounded-2xl text-center max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Access Restricted
        </h1>
        <p className="text-gray-600 mb-6">
          Please log in to view your dashboard.
        </p>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition">
          Go to Login
        </button>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Welcome,{' '}
            <span className="text-indigo-600">
              {session.user.user_metadata?.name || session.user.email}
            </span>
          </h1>
          <button
            onClick={() => setAdding(!adding)}
            className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl shadow hover:bg-indigo-700 transition"
          >
            {adding ? 'Cancel' : '+ Add Study Slot'}
          </button>
        </div>

        {/* Add Slot Form */}
        {adding && (
          <div className="mb-10 p-6 border border-indigo-200 rounded-2xl bg-indigo-50 shadow-inner">
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">
              Add New Study Slot
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Slot Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleAddSlot}
              className="mt-6 w-full py-3 bg-green-600 text-white font-semibold rounded-xl shadow hover:bg-green-700 transition"
            >
              Save Slot
            </button>
          </div>
        )}

        {/* Slots List */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📚 Your Study Slots
        </h2>

        {crons.length === 0 ? (
          <div className="p-8 bg-gray-50 border border-dashed border-gray-300 rounded-2xl text-center">
            <p className="text-gray-500 text-lg">
              No slots scheduled yet. Add your first one above!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {crons.map((cron, i) => (
              <div
                key={i}
                className="relative p-6 bg-gradient-to-br from-indigo-50 via-white to-blue-100 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Title */}
                <p className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  {cron.title}
                </p>

                {/* Date */}
                <p className="text-gray-700 flex items-center mb-2">
                  <span className="mr-2">📅</span>
                  <span className="font-medium">{cron.startTime.toLocaleDateString().split('T')[0]}</span>
                </p>

                {/* Time */}
                <p className="text-gray-700 flex items-center mb-4">
                  <span className="mr-2">⏰</span>
                  {cron.startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  –{" "}
                  {cron.endTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Status */}
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${cron.reminderSent
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                >
                  {cron.reminderSent ? "Notified" : " Not Notified"}
                </span>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(cron._id)}
                  className="absolute top-4 right-4 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}