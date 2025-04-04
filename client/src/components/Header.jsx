"use client"
import React, { useEffect } from "react"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

const Header = () => {
    const { isConnected } = useAccount()

    // useEffect(() => {}, [isConnected])
    return (
        <nav className="px-20 p-5 border-b-2 flex flex-row justify-between items">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <div className="mr-4 p-6">Home</div>
                </Link>
                <Link href="/sell-nft">
                    <div className="mr-4 p-6">Sell NFT</div>
                </Link>
                <ConnectButton label="Connect" />
            </div>
        </nav>
    )
}

export default Header
