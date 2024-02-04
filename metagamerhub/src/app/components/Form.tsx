// @ts-nocheck
import React, { useState } from 'react';
import { useMbWallet } from '@mintbase-js/react';
import { execute, mint } from '@mintbase-js/sdk';
import { constants } from '../constants';
import { uploadReference } from "@mintbase-js/storage";
import { generateRandomId } from "../utils/generateRandomId";
import { useReplicate } from "../utils/replicate";

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
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
          const photoFile = "https://ipfs.io/ipfs/bafybeic5gbdr6qdi3qktyzm65wumc6uekj7ypi2ywgybssawpat7pb5klq";
          const titleAndDescription = await getTitleAndDescription(photoFile);
          const refObject = {
            title: "titleAndDescription.title",
            description: "titleAndDescription.description",
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
        <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />

        <label htmlFor="image">Image:</label>
        <input type="file" id="image" name="image" accept=".glb, model/gltf-binary" onChange={handleImageChange} required />

        <button type="submit">Mint</button>
        </form>
    );
};

export default Form;
