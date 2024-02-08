// @ts-nocheck
import React, { useState, useRef } from 'react';
import { useMbWallet } from '@mintbase-js/react';
import { execute, mint } from '@mintbase-js/sdk';
import { constants } from '../constants';
import { uploadReference } from "@mintbase-js/storage";
import { generateRandomId } from "../utils/generateRandomId";
import { useReplicate } from "../utils/replicate";
const { NFTStorage, File } = require('nft.storage');

interface FormData {
  name: string;
  description: string;
  image: File | null;
}

interface ReferenceObject {
  title: string;
  description: string;
  media: File;
}

const Form: React.FC = () => {
    
    const { selector, activeAccountId } = useMbWallet();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        image: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
        ...prevState,
        [name]: value
        }));
    };

    const ipfsLinkRef = useRef<string | null>(null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files[0];
      const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVGYzA0NTUyMzI5ODA5NDI4NDkzY0VDYjdmZkY4RkUxNGY5YkQzOTQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4OTk2NjA0NzY5NiwibmFtZSI6IlBhcmlzIn0.9CxIio0ygPmcf8onnQcFrZurTQACHiB8qOgO6tcHEWs"; 
      const storage = new NFTStorage({ token: apiKey });
      const ipfsLink = await storage.storeBlob(selectedFile);
      ipfsLinkRef.current = ipfsLink;
      console.log("ipfsLink: ", ipfsLinkRef);

      console.log("f data: ", formData.name);
    };

    const { addRequest } = useReplicate();

    const getTitleAndDescription = async (photo: string) => {
      try {
        const requestPayload = {
          image: photo,
          prompt: `Describe this image, be direct and include important details. The title should be succinct and 5 words long. The description can be longer than 15 words and more descriptive.
        
        Respond in JSON {"title": "<title>", "description": "<description>"}`,
        };
        const requestHash =
          "2facb4a474a0462c15041b78b1ad70952ea46b5ec6ad29583c0b29dbd4249591";
        const response = await addRequest(requestPayload, requestHash);
  
        return JSON.parse(response.output.join(""));
      } catch (error) {
        console.error("Failed to get title and description:", error);
        return {
          title: generateRandomId(10),
          description: generateRandomId(10),
        };
      }
    };

    const uploadReferenceObject = async (refObject: ReferenceObject) => {
      try {
        return await uploadReference(refObject);
      } catch (error) {
        console.error("Failed to upload reference:", error);
       // setLoading(false);
        throw new Error("Failed to upload reference");
      }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form data:', formData);

        /* Mint Logic */
        try {
         // const photoFile = "https://ipfs.io/ipfs/bafybeic5gbdr6qdi3qktyzm65wumc6uekj7ypi2ywgybssawpat7pb5klq";
          const photoFile = `https://ipfs.io/ipfs/${ipfsLinkRef.current}`;
          console.log(photoFile);
          const titleAndDescription = await getTitleAndDescription(photoFile);
          const refObject = {
            title: formData.name,
            description: formData.description,
            media: photoFile,
          };
          const uploadedData = await uploadReferenceObject(refObject);
          const metadata = { reference: uploadedData?.id };

          const wallet = await selector.wallet();
          await performTransaction(wallet, metadata);
        } 

        catch (error: any) {
          console.log("error minting");
        };
    };

    const performTransaction = async ( wallet: any, metadata: any, ) => {
        if (!wallet) {
          throw new Error("Wallet is not defined.");
        }
    
        try {
          return await wallet.signAndSendTransaction({
            signerId: activeAccountId,
            receiverId: constants.proxyContractAddress,
            actions: [
              {
                type: "FunctionCall",
                params: {
                  methodName: "mint",
                  args: {
                    metadata: JSON.stringify(metadata),
                    nft_contract_id: constants.tokenContractAddress,
                  },
                  gas: "200000000000000",
                  deposit: "10000000000000000000000",
                },
              },
            ],
          });
        } catch (error) {
          console.error("Failed to sign and send transaction:", error);
          throw new Error("Failed to sign and send transaction");
        }
      };

    return (

      <>
  <div class="flex items-center justify-center bg-gray-100 py-8">
    <p class="italic hover:not-italic text-2xl text-gray-800 font-semibold">Mint your 3D Gaming Asset NFT here!</p>
  </div>

  <form class="flex items-center justify-center mt-8" onSubmit={handleSubmit}>
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <div class="mb-4">
        <label for="name" class="text-gray-700 block font-semibold">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required class="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500"/>
      </div>

      <div class="mb-4">
        <label for="description" class="text-gray-700 block font-semibold">Description:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required class="border border-gray-300 p-2 rounded-md w-full h-24 resize-none focus:outline-none focus:border-blue-500"></textarea>
      </div>

      <div class="mb-4">
        <label for="image" class="text-gray-700 block font-semibold">Image:</label>
        <input type="file" id="image" name="image" accept=".glb, model/gltf-binary" onChange={handleImageChange} required class="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:border-blue-500"/>
      </div>

      <div class="text-center">
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Mint</button>
      </div>
    </div>
  </form>
</>

    );
};

export default Form;
