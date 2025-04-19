"use client"
import { use, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function page() {
  const [farmSpaces, setFarmSpaces] = useState([]);

  const wallet = useWallet();

  useEffect(() => {
    if (!wallet.connected) {
      // alert("Please connect your wallet to view farm spaces.");
      redirect("/");
    }
  }, [wallet.connected]);

  useEffect(() => {
    const fetchFarmSpaces = async () => {
      const spaces = await getFarmSpaces();
      spaces.sort((a, b) => a.code.localeCompare(b.code));
      setFarmSpaces(spaces);
    };
    fetchFarmSpaces();
  }, []);

  const getFarmSpaces = async () => {
    const response = await fetch('/api/farm/load', { method: 'GET' });
    if (!response.ok) {
      throw new Error('Failed to fetch farm spaces');
    }
    const data = await response.json();
    return data;
  }
  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f8ff' }}>
      <h1 style={{ color: '#228B22', fontFamily: 'Arial, sans-serif' }}>Welcome to the Farm</h1>
      <p style={{ fontSize: '18px', color: '#555' }}>Explore our variety of crops and start your virtual farm.</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center',  }}>
        {farmSpaces.map((space) => (
          <Link href={`/farm/${space._id}`} key={space._id} style={{ margin: '10px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', width: '200px', backgroundColor: '#fff' }}
            className="cursor-pointer hover:scale-105 transition duration-300 ease-in-out transform"
          >
            <h2 style={{ fontSize: '20px', color: '#333' }}>{space.code}</h2>
            {/* <p style={{ fontSize: '16px', color: '#666' }}>Crop: {space.crop.name}</p> */}
            <p style={{ fontSize: '16px', color: '#666' }}>Soil Type: {space.soil}</p>
            <p style={{ fontSize: '16px', color: '#666' }}>Occupied: {space.occupied ? "Yes" : "No"}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
