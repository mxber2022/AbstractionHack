"use client";

import React, { useState } from "react";
//import { constants } from "@/constants";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Model from "../components/Model";

const ImageThumb = ({ token, index }: any) => {
  const imageUrl = token?.media;

  console.log("imageUrl: ", token);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };


  if (error)
    return (
  <>
      
      <div className=" aspect-square flex flex-wrap	 p-10 w-72 h-72 xl:w-80 xl:h-80 relative justify-center items-center text-center bg-gray-200 w-full">
        <div>
          <h1 className="w-full"> No Image Metadata</h1>
          <p className="text-xs text-gray-600 w-full">
            There was an Error with the image.
          </p>
        </div>
      </div>
      </>
    );
  if (imageUrl) {
    return (
<>
      

      <div className=" aspect-square  sm:w-full md:w-72 h-72 xl:w-80 xl:h-80 relative">
        <Link
          key={`${token?.metadata_id}-${index}`}
          href={`meta/${token?.metadata_id}`}
          rel="noopener noreferrer"
          passHref
        >
  
          {/* <audio src={imageUrl} controls  /> */}

          {
    (imageUrl === "https://arweave.net/blob:http://localhost:3000/0cb08f4e-2f97-4e43-9956-6ea12254eb5d" ||
    imageUrl === "https://sapphire-following-turkey-778.mypinata.clo…14TE*MTY5OTQ3MzE0NC4zLjEuMTY5OTQ3MzI1Ni4yNi4wLjA." ||
    imageUrl === "https://ipfs.io/ipfs/bafybeifc3tbrp6qnivpvhvs5ooopqidjup7246cbiwrola3vkmetsd354u" ||
    imageUrl === "https://ipfs.io/ipfs/bafybeig7nbkkaqrxlvh2hvmyvfz5cgt2dgv52urdirumcrzbzp4tx4wwau" ||
    imageUrl === "https://ipfs.io/ipfs/bafybeic5gbdr6qdi3qktyzm65wumc6uekj7ypi2ywgybssawpat7pb5klq" ||
    imageUrl === "https://ipfs.io/ipfs/bafybeiawaqmwsmkrasy6aerxtv25rnelcpg3gr6lhyjrvxowytdjjwwaiu" ||
    imageUrl === "https://sapphire-following-turkey-778.mypinata.cloud/ipfs/QmZ6Fmi4sm283swk91T2vz4tro6x6RGFBGvP6B5yG3fgYz?_gl=1*1cbn3eo*_ga*MTE1ODc1ODI2Ni4xNjk2NzI0ODMz*_ga_5RMPXG14TE*MTY5OTQ3MzE0NC4zLjEuMTY5OTQ3MzI1Ni4yNi4wLjA." ||
    imageUrl === "https://sapphire-following-turkey-778.mypinata.cloud/ipfs/QmZ6Fmi4sm283swk91T2vz4tro6x6RGFBGvP6B5yG3fgYz?_gl=1*1cbn3eo*_ga*MTE1ODc1ODI2Ni4xNjk2NzI0ODMz*_ga_5RMPXG14TE*MTY5OTQ3MzE0NC4zLjEuMTY5OTQ3MzI1Ni4yNi4wLjA.:") ? 
    <></> : <Model gltfUrl={imageUrl}/> 
}

          {/* <Model gltfUrl={imageUrl}/>  */}

        </Link>
      </div>
      </>
    );
  } else {
    return null;
  }
  
};

export const MemoizedImageThumb = React.memo(ImageThumb);
