"use client";

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MintbaseWalletContextProvider } from "@mintbase-js/react";
import "@near-wallet-selector/modal-ui/styles.css";
import { ReplicateProvider } from './utils/replicate';
const inter = Inter({ subsets: ['latin'] })

const MintbaseWalletSetup = {
  contractAddress: "gamerhub.mintspace2.testnet",
  network: "testnet" as any,
  callbackUrl: "http://localhost:3000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MintbaseWalletContextProvider {...MintbaseWalletSetup}>
      <ReplicateProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
      </ReplicateProvider>
    </MintbaseWalletContextProvider>
  )
}
