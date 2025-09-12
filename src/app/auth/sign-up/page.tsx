'use client'

import { useState } from 'react'
import { signUp } from '@/app/utils/Auth'
import { useRouter } from 'next/navigation'
export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async () => {
    const { name, email, password, confirmPassword } = form

    if (!name || !email || !password || !confirmPassword) {
      alert('All fields are required!')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password,name) // you can also store `name` in metadata
    setLoading(false)

    if (error) alert(error.message)
    else{
      router.push('/');
      alert('Signup successful! Please check your email for confirmation.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left section with gradient + text */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center text-white p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-lg opacity-90">
            We make Your Success Speak up for You...
          </p>
        </div>
      </div>

      {/* Right section with signup form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Create Account</h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <a href="/auth/sign-in" className="text-indigo-600 hover:underline font-medium">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}