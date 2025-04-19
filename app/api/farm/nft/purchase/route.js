import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from '@solana/wallet-adapter-react';

async function sendSol(publicKey, connection) {
  const {sendTransaction} = useWallet();

  const transaction = new web3.Transaction();
  const recipientPubKey = "AF8SQGrTpecCXJp6MwdUGhQeF4pWgvas1F3kXCUoAqzB";
  const sendSolInstruction = web3.SystemProgram.transfer({
    fromPubkey: publicKey,
    toPubkey: recipientPubKey,
    lamports: 0.1 * LAMPORTS_PER_SOL,
  });

  await transaction.add(sendSolInstruction);
  try {
    await sendTransaction(transaction, connection).then((sig) => {
      console.log(sig);
    });

    // mint();
  } catch (error) {
    console.error("Error sending SOL:", error);
    return;
  }
}

export const POST = async (req, res) => {
  const { publicKey } = await req.json();
  console.log("publicKey", publicKey);
  // console.log("sendTransaction", sendTransaction);
  

  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  console.log("connection", connection);

  await sendSol(publicKey, connection).then(() => {
    console.log("SOL sent successfully");
  });

  return new Response(JSON.stringify({ message: "Success" }), { status: 200 });
}