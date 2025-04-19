import { connectDB } from "@utils/connectDB";


import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createGenericFile, createSignerFromKeypair, generateSigner, keypairIdentity, percentAmount, sol } from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'


const QUICKNODE_RPC = 'https://small-alpha-emerald.solana-devnet.quiknode.pro/91006ef33d501485b71c0703fd858dfa58c591d3/';
const umi = createUmi(QUICKNODE_RPC);

const dateNow = new Date();

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


// async function uploadImage(img) {
//     try {
//         console.log("img", img);
//         const imageUrl = img; 
//         const imgName = 'plantain.jpeg'; // Name for the file, can be customized

//         // Fetch the image with headers to mimic a browser request
//         const response = await fetch(imageUrl, {
//             method: 'GET',
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//                 'Accept': 'image/jpeg'
//             }
//         });

//         // Check if the response is successful
//         if (!response.ok) {
//             throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
//         }

//         // Verify the content type
//         const contentType = response.headers.get('content-type');
//         if (!contentType || !contentType.includes('image')) {
//             throw new Error(`Invalid content type: ${contentType}, expected an image`);
//         }

//         // Convert the response to a buffer
//         const arrayBuffer = await response.arrayBuffer();
//         const fileBuffer = Buffer.from(arrayBuffer);

//         // Create a generic file for upload
//         const image = createGenericFile(
//             fileBuffer,
//             imgName,
//             {
//                 uniqueName: nftDetail.name,
//                 contentType: nftDetail.imgType
//             }
//         );

//         // Upload the image to Irys
//         const [imgUri] = await umi.uploader.upload([image]);
//         console.log('Uploaded image:', imgUri);
//         return imgUri;
//     } catch (e) {
//         console.error('Error in uploadImage:', e.message);
//         throw e;
//     }
// }

async function uploadImage(img) {
    try {
        // const imgDirectory = './uploads';
        const imgURL = img;
        // const filePath = `${imgDirectory}/${imgName}`;
        const image = createGenericFile(
            imgURL,
            nftDetail.name,
            {
                uniqueName: nftDetail.name,
                contentType: nftDetail.imgType
            }
        );
        const [imgUri] = await umi.uploader.upload([image]);
        console.log('Uploaded image:', imgUri);
        return imgUri;
    } catch (e) {
        throw e;
    }
}

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

async function mintNft(metadataUri, publicKey) {
    try {
        const mint = generateSigner(umi);
        await createNft(umi, {
            mint,
            name: nftDetail.name,
            symbol: nftDetail.symbol,
            uri: metadataUri,
            sellerFeeBasisPoints: percentAmount(nftDetail.royalties),
            creators: [{ address: publicKey, verified: true, share: 100 }],
        }).sendAndConfirm(umi);
        console.log(`Created NFT: ${mint.publicKey.toString()}`);
    } catch (e) {
        throw e;
    }
}

async function main(publicKey, img) {
    // const imageUri = await uploadImage(img);
    const metadataUri = await uploadMetadata(img);
    // await mintNft(metadataUri, publicKey);
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

    const metaDataUri = await main(publicKey, img);

    console.log("Metadata URI:", metaDataUri);

    return new Response(JSON.stringify({ metaDataUri }), { status: 200 });
}