"use client"
import dynamic from "next/dynamic"
import { useWallet } from "@solana/wallet-adapter-react"
import { useEffect } from "react"
import { redirect } from 'next/navigation'
import Link from "next/link"

const WalletMultiButtonDynamic = dynamic(
  async () => 
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton
  , { ssr: false }
)


export default function Navbar() {
  // const router = useRouter()
  const wallet = useWallet()

  const { publicKey } = wallet

  useEffect(() => {
    const checkUserExist = async () => {
      if (publicKey) {
        const res = await fetch(`/api/user/exist?publicKey=${publicKey.toBase58()}`)
        const data = await res.json()
        if (!data.exists) {
          alert("User does not exist, please create a new account")
          redirect("/register")
          // const name = prompt("Enter your name")
          // const email = prompt("Enter your email")
          // const password = prompt("Enter your password")
          // await fetch("/api/user/new", {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json"
          //   },
          //   body: JSON.stringify({
          //     name,
          //     publicKey: publicKey.toBase58(),
          //     email,
          //     password
          //   })
          // })
        }
      }
    }
    checkUserExist()
  }, [publicKey])

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem', 
      backgroundColor: '#1a202c', 
      color: '#fff' 
    }}>
      {/* <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>E-Farm</h1> */}
      <Link href="/" style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#fff', 
        textDecoration: 'none' 
      }}>
        E-Farm
      </Link>
      <WalletMultiButtonDynamic style={{ 
        backgroundColor: '#4A5568', 
        color: '#fff', 
        padding: '0.5rem 1rem', 
        borderRadius: '5px', 
        fontSize: '1rem', 
        cursor: 'pointer' 
      }}>
        {wallet.publicKey
          ? `${wallet.publicKey.toBase58().substring(0,7)}...`
          : 'Connect Wallet'
        }
      </WalletMultiButtonDynamic>
    </nav>
  )
}
