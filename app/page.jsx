"use client"
import { redirect } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link";
import { useEffect, useState } from "react";
import { set } from "mongoose";

const Home = () => {
  const wallet = useWallet();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const checkUserExist = async () => {
      if (wallet.publicKey) {
        setConnected(true)
        // alert("Wallet connected")
      } else {
        setConnected(false)
        // alert("Wallet not connected")
      }
    }
    checkUserExist()
  }, [wallet.publicKey])

  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-4xl font-extrabold text-green-800 mb-6">E-FARM</h1>

      {/* <button
        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-bold py-2 px-6 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        onClick={handleClick}
      >
        Visit the Farm
      </button> */}
      <Link href="/farm"
        className={!connected ? 'pointer-events-none' : '' + " bg-blue-500 hover:bg-blue-600 cursor-pointer text-white font-bold py-2 px-6 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105"}>
        Visit the Farm
      </Link>
    </div>
  )
}

export default Home