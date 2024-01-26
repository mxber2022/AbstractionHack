"use client"

import { NearWalletConnector } from "./NearWalletSelector";
import Link from "next/link";
import Model from "./Model";

export default function Nav() {
    return (
        <>
        <nav className="bg-chilizNav rounded-md mx-1 my-1">
            <div className="flex justify-between px-2">
              
              {/* Left Nav */}
              <div className="flex space-x-4 items-center py-5">
                <div>
                    <h1 className="text-3xl font-mono font-bold"><Link href="/">MetaGamerHub</Link></h1>
                </div>
              </div>
              
              {/* Right Nav */}

              <div className="flex items-center">
                <div className="bg-gray-300 w-[6rem] flex justify-center rounded-sm text-black mr-10 hover:bg-slate-400">
                  {/* <Link href="/about">About Us</Link> */}
                </div>

                <div className="py-5">
                    <NearWalletConnector />
                </div>

              </div>
            </div>
        </nav>
        <Model/>    
        </>
    )
}