import { wagmiConfig } from "@/app/_app"
import { nftAbi, nftMarketplaceAddress } from "@/constants"
import { Card, useNotification } from "@web3uikit/core"
import React, { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import Image from "next/image"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"
import BuyNftModal from "./BuyNftModal"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

const NFTBox = ({ price, nftAddress, tokenId, seller }) => {
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showBuyModal, setShowBuyModel] = useState(false)
    const [loading, setLoading] = useState(true)
    const hideModal = () => setShowModal(false)
    const hideBuyModal = () => setShowBuyModel(false)
    const dispatch = useNotification()
    const { isConnected, address: userAddress } = useAccount({ wagmiConfig })

    // getTokenURI - readContract
    const {
        data: tokenURI,
        error,
        isPending,
    } = useReadContract({
        address: nftAddress,
        abi: nftAbi,
        functionName: "tokenURI",
        args: [tokenId],
    })

    // buyItem - write contract
    const { writeContract: buyItemContractFunction } = useWriteContract()

    // update ui
    async function updateUI() {
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isConnected) {
            updateUI()
        }
    }, [isConnected, isPending])

    const isOwnedByUser = seller === userAddress.toLowerCase() || seller === undefined

    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)

    const handleCardClick = () => {
        isOwnedByUser ? setShowModal(true) : buyItemFunction()
    }

    const buyItemFunction = () => {
        console.log("buyItem function clicked")
        setShowBuyModel(!showBuyModal)
    }

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    if (loading) {
        return <div className="border-2 border-red-500 bg-red-100">Nft loader...</div>
    }
    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        {/* Update Listing Modal */}
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={nftMarketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                        <BuyNftModal
                            isVisible={showBuyModal}
                            tokenId={tokenId}
                            marketplaceAddress={nftMarketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideBuyModal}
                            price={price}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                        alt={"nft-image"}
                                    />
                                    <div>{ethers.formatUnits(price, "ether")} ETH</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading ...</div>
                )}
            </div>
        </div>
    )
}

export default NFTBox
