const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.parseEther("0.1");
const NftMarketplace_Address = process.env.NFT_MARKETPLACE_ADDRESS;
const BasicNft_Address = process.env.BASIC_NFT_ADDRESS;

async function mint() {
  const basicNft = await ethers.getContractAt("BasicNft", BasicNft_Address);

  // minting a nft
  console.log("Minting NFT...");
  const mintTx = await basicNft.mintNft();
  console.log("mintTx", mintTx);
  const mintTxReceipt = await mintTx.wait();

  const tokenId = mintTxReceipt.logs[0].args.tokenId;

  console.log("contractAddress", basicNft.target);
  console.log("tokenId", tokenId);
  console.log("----------------------------------------------------");
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
