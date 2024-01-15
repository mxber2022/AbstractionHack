"use client"
import { useMbWallet } from "@mintbase-js/react";

export const NearWalletConnector = () => {
  const { isConnected, selector, connect , activeAccountId } = useMbWallet();

  const handleSignout = async () => {
    const wallet = await selector.wallet();
    return wallet.signOut();
  };

  const handleSignIn = async () => {
    return connect();
  };

  if (!isConnected) {
    return <button  className="bg-white text-black rounded p-3 hover:bg-[#e1e1e1]" onClick={handleSignIn}>Connect Near Wallet</button>;
  }

  return (
    <div>
      <div className="">
        <button className="bg-white text-black rounded p-3 hover:bg-[#e1e1e1]" onClick={handleSignout}> Disconnect </button>
      </div>
      <p>{activeAccountId}</p>
    </div>
  );
};
