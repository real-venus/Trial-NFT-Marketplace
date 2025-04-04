"use client"
import { nftMarketplaceAbi } from "@/constants"
import { Input, Modal, useNotification } from "@web3uikit/core"
import { ethers } from "ethers"
import React, { useState } from "react"
import { useWriteContract } from "wagmi"

const UpdateListingModal = ({ nftAddress, tokenId, isVisible, marketplaceAddress, onClose }) => {
    const dispatch = useNotification()
    const { writeContractAsync: updateContract } = useWriteContract()
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const handleUpdateListingSuccess = () => {
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - please refresh (and move blocks)",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    const updateListingFunction = async () => {
        if (priceToUpdateListingWith <= 0) {
            alert("Kindly input no greater than 0!")
            return
        }
        try {
            const updateRequest = await updateContract({
                address: marketplaceAddress,
                abi: nftMarketplaceAbi,
                functionName: "updateListing",
                args: [nftAddress, tokenId, ethers.parseEther(priceToUpdateListingWith || "0")],
            })

            handleUpdateListingSuccess()
        } catch (error) {
            console.log("Update Listing Error:", error)
            close()
        }
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListingFunction()
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New Listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    )
}

export default UpdateListingModal
