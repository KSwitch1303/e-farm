"use client"
import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { redirect } from 'next/navigation'

export default function page() {
  const wallet = useWallet()

  const [name, setName] = useState("")
  const publicKey = useState(wallet.publicKey?.toBase58() || "")
  const [email, setEmail] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch("/api/user/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        publicKey: wallet.publicKey.toBase58(),
        email,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      alert("Account created successfully!")
      redirect("/")
    } else {
      alert("Failed to create account")
      }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h1>
      <form
        onSubmit={handleSubmit}

        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="publicKey">
            Public Key
          </label>
          <input
            disabled
            type="text"
            name="publicKey"
            id="publicKey"
            placeholder="Public Key"
            value={wallet.publicKey?.toBase58()}
            readOnly
            required
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          type="submit"
        >
          Create Account
        </button>
      </form>
    </div>
);
}
