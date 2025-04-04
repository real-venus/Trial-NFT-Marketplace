const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.parseEther("0.1");
const NftMarketplace_Address = process.env.NFT_MARKETPLACE_ADDRESS;
const BasicNft_Address = process.env.BASIC_NFT_ADDRESS;

async function mintAndList() {
  const nftMarketplace = await ethers.getContractAt(
    "NftMarketplace",
    NftMarketplace_Address,
  );
  const basicNft = await ethers.getContractAt("BasicNft", BasicNft_Address);

  console.log("nftMarketplace", nftMarketplace.target);

  // minting a nft
  console.log("Minting NFT...");
  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait();
  const tokenId = mintTxReceipt.logs[0].args.tokenId;
  console.log("tokenId", mintTxReceipt.logs[0].args.tokenId);
  console.log("----------------------------------------------------");

  console.log("Approving NFT...");
  const approvalTx = await basicNft.approve(nftMarketplace.target, tokenId);
  await approvalTx.wait(1);

  console.log("----------------------------------------------------");
  console.log("Listing NFT...");

  const tx = await nftMarketplace.listItem(basicNft.target, tokenId, PRICE);
  await tx.wait(1);
  console.log("Successfully NFT Listed!");
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
