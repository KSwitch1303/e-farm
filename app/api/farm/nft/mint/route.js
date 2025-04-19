

import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createGenericFile, createSignerFromKeypair, generateSigner, keypairIdentity, percentAmount, sol } from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
const secret = process.env.NEXT_PUBLIC_WALLET;
const JSON_SECRET = JSON.parse(secret);
console.log("secret", JSON_SECRET);

const QUICKNODE_RPC = 'https://small-alpha-emerald.solana-devnet.quiknode.pro/91006ef33d501485b71c0703fd858dfa58c591d3/';
const umi = createUmi(QUICKNODE_RPC);

const dateNow = new Date();
const creatorWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(JSON_SECRET));
const creator = createSignerFromKeypair(umi, creatorWallet);
umi.use(keypairIdentity(creator));
umi.use(mplTokenMetadata());

umi.use(
  irysUploader({
    // mainnet address: "https://node1.irys.xyz"
    // devnet address: "https://devnet.irys.xyz"
    address: 'https://devnet.irys.xyz',
  })
)

const cropObject = [
    { trait_type: 'name', value: 'Plantain' },
    { trait_type: 'type', value: 'FRUIT' }, // e.g. 'vegetable', 'fruit', 'grain'
    { trait_type: 'plantingDate', value: dateNow.toISOString().split('T')[0] }, // e.g. '2023-03-15'
    { trait_type: 'growthDuration', value: '2025-09-15' }, // e.g. '2023-08-15'
]

const nftDetail = {
    name: "",
    symbol: "",
    uri: "www.example.com",
    royalties: 0,
    description: "E-Farm Crop NFT",
    imgType: "jpeg",
    attributes: cropObject
};


async function uploadMetadata(imageUri) {
    try {
        const metadata = {
            name: nftDetail.name,
            description: nftDetail.description,
            image: imageUri,
            attributes: nftDetail.attributes,
            properties: {
                files: [
                    {
                        type: nftDetail.imgType,
                        uri: imageUri,
                    },
                ]
            }
        };
        const metadataUri = await umi.uploader.uploadJson(metadata);
        console.log('Uploaded metadata:', metadataUri);
        return metadataUri;
    } catch (e) {
        throw e;
    }
}


async function main(img) {
    const metadataUri = await uploadMetadata(img);
    return metadataUri;
}

// main();

export const POST = async (req) => {
    const { publicKey, metadata } = await req.json();
    console.log("publicKey", publicKey);
    console.log("metadata", metadata);
    nftDetail.name = metadata.name;
    nftDetail.symbol = metadata.symbol;
    cropObject[0].value = metadata.name;
    cropObject[1].value = metadata.type;
    cropObject[3].value = metadata.growthDuration;
    // nftDetail.description = metadata.description;
    nftDetail.imgType = metadata.imgType;

    console.log("cropObject", cropObject);
    console.log("nftDetail", nftDetail);




    const img = metadata.image;

    const metaDataUri = await main(img);

    console.log("Metadata URI:", metaDataUri);

    return new Response(JSON.stringify({ metaDataUri }), { status: 200 });
}