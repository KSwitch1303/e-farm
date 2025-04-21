"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as web3 from "@solana/web3.js";
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createGenericFile, createSignerFromKeypair, generateSigner, keypairIdentity, percentAmount, sol } from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

export default function Page() {
  const params = useParams();
  const space = params.space || 'Loading...';
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();
  const [selectedCrop, setSelectedCrop] = useState('');

  const crops = [
    { name: 'Plantain', symbol: "PLT", type: 'fruit', growthDuration: '8-12 months', image: 'https://i.imgur.com/g6H8u7U_d.jpeg?maxwidth=520&shape=thumb&fidelity=high', imgType: 'jpeg' },
    { name: 'Banana', type: 'fruit', growthDuration: '9-15 months', image: 'https://i.imgur.com/OJy4J14_d.jpeg?maxwidth=520&shape=thumb&fidelity=high', imgType: 'jpeg' },
    { name: 'Cucumber', type: 'fruit', growthDuration: '50-70 days', image: 'https://i.imgur.com/qezB4zh_d.jpeg?maxwidth=520&shape=thumb&fidelity=high', imgType: 'jpeg' },
    { name: 'Pepper', type: 'fruit', growthDuration: '2-5 months', image: 'https://i.imgur.com/WYbBmRH_d.jpeg?maxwidth=520&shape=thumb&fidelity=high', imgType: 'jpeg' },
    { name: 'Pumpkin Leaf (Ugu)', type: 'vegetable', growthDuration: '2-3 months', image: 'https://i.imgur.com/Thv6x3S_d.jpeg?maxwidth=520&shape=thumb&fidelity=high', imgType: 'jpeg' },
  ];

  useEffect(() => {
    const fetchSpace = async () => {
      setLoading(true);
      const response = await fetch(`/api/farm/loadspace/${space}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch space');
      }
      const fetchedData = await response.json();
      setData(fetchedData);
      setLoading(false);
      console.log(fetchedData);
    };
    fetchSpace();
  }, []);

  const handlePurchase = async () => {
    setPending(true);
    if (!publicKey) {
      console.error("Wallet not connected or sendTransaction not available");
      setPending(false);
      return;
    }
    if (!selectedCrop) {
      alert("Please select a crop to plant");
      setPending(false);
      return;
    }

    try {
      const connection = new web3.Connection(
        web3.clusterApiUrl("devnet"),
        "confirmed"
      );
      await sendSol(publicKey, sendTransaction, connection);
      setPending(false);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      setPending(false);
    }
  };

  async function sendSol(publicKey, sendTransaction, connection) {
    const transaction = new web3.Transaction();
    const recipientPubKey = "AF8SQGrTpecCXJp6MwdUGhQeF4pWgvas1F3kXCUoAqzB";
    const sendSolInstruction = web3.SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: recipientPubKey,
      lamports: 0.2 * LAMPORTS_PER_SOL,
    });

    await transaction.add(sendSolInstruction);
    try {
      await sendTransaction(transaction, connection).then((sig) => {
        console.log(sig);
      });

      await mint();
    } catch (error) {
      alert(error);
      return;
    }
  }

  const mint = async () => {
    console.log("Minting NFT...");
    const response = await axios.post('/api/farm/nft/mint', { publicKey, metadata: crops[selectedCrop] });
    if (response.status === 200) {
      const { metaDataUri } = response.data;
      await mintNft(metaDataUri, publicKey);
    } else {
      alert("Error minting NFT");
      console.error('Error minting NFT:', response.data);
    }
  };

  async function mintNft(metadataUri, publicKey) {
    const umi = createUmi('https://api.devnet.solana.com')
      .use(walletAdapterIdentity(wallet))
      .use(mplTokenMetadata());

    try {
      const mint = generateSigner(umi);
      await createNft(umi, {
        mint,
        name: crops[selectedCrop].name,
        symbol: crops[selectedCrop].symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(5.5),
        creators: [{ address: publicKey, verified: true, share: 100 }],
      }).sendAndConfirm(umi);
      alert("NFT minted successfully");
      console.log(`Created NFT: ${mint.publicKey.toString()}`);
      await purchased(mint.publicKey.toString());
    } catch (e) {
      console.error('Error minting NFT:', e);
      throw e;
    }
  }

  const purchased = async (nftURI) => {
    const response = await axios.post('/api/farm/purchased', {
      id: data._id, metadata: crops[selectedCrop], nftURI, publicKey: publicKey.toString()
    });
    
      
    if (response.status === 200) {
      alert("Space purchased successfully!");
    } else {
      alert("Error purchasing space");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Farm Space: {data.code}</h1>
              <p className="mt-2 text-lg text-gray-600">Owner: {data.owner || 'Not claimed'}</p>
              {/* <p className="mt-1 text-lg text-gray-600">Code: {data.code || 'Loading...'}</p> */}
              <p className="mt-1 text-lg text-gray-600">Soil Type: {data.soil || 'Loading...'}</p>
            </div>

            {!data.owner && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="crop" className="block text-sm font-medium text-gray-700">
                    Select a Crop
                  </label>
                  <select
                    disabled={pending}
                    id="crop"
                    className="mt-1 block w-full py-3 px-4 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-300"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a crop
                    </option>
                    {crops.map((crop, index) => (
                      <option key={index} value={index}>
                        {crop.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCrop && (
                  <div className="bg-green-50 p-4 rounded-lg flex items-center space-x-4">
                    {crops[selectedCrop].image && (
                      <img
                        src={crops[selectedCrop].image}
                        alt={crops[selectedCrop].name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{crops[selectedCrop].name}</p>
                      <p className="text-sm text-gray-600">Type: {crops[selectedCrop].type}</p>
                      <p className="text-sm text-gray-600">Growth: {crops[selectedCrop].growthDuration}</p>
                    </div>
                  </div>
                )}
                <p className="text-lg font-semibold text-gray-900">Price: 0.2 SOL</p>
                <button
                  onClick={handlePurchase}
                  disabled={pending}
                  className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
                >
                  Claim Space
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}