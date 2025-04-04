Trial NFT-Marketplace

## Deployed NFT and Marketplace Address

- **NFT**: `0xa75151b042D5cd4D1D5DeA6D866a6b5118FeDA41`

- **Marketplace**: `0xC49EE2b9800fdf983380C29F2687eB32401d4afe`


## Test History on Sepolia Network

- `https://sepolia.etherscan.io/address/0xC49EE2b9800fdf983380C29F2687eB32401d4afe`

- `https://sepolia.etherscan.io/address/0xa75151b042D5cd4D1D5DeA6D866a6b5118FeDA41`


## Owner Address

- `0x263Bc0EbF4647274F0a687E4633CE63D4A22f084`


## Built With

- **Frontend**: Next.js, TailwindCSS

- **Indexing**: The Graph Indexer

- **Blockchain** Interaction: Ethers.js, Wagmi, RainbowKit

- **Smart Contracts**: Solidity

- **Deployment**: Hardhat, Alchemy

- **Network**: Sepolia Testnet


# Features 

- **Listing NFTs:** Users can easily list their NFTs for sale, ensuring a seamless process from creation to listing.

- **Buying and Selling:** The platform supports the buying and selling of NFTs, providing a smooth and reliable transaction experience.

- **Frontend Development:** Leveraging Next.js for server-side rendering and optimized performance, combined with Tailwind CSS for a modern and responsive design.

- **Blockchain Interactions:** Utilizing Ethers.js and Wagmi for efficient and robust interactions with smart contracts on the Sepolia testnet.

- **Smart Contract Management:** Developed and deployed smart contracts using Hardhat, ensuring reliable and secure contract interactions and also include protection against reentrancy attacks.

- **Wallet Connectivity:** Enabled seamless wallet connections with RainbowKit, facilitating smooth user onboarding and interactions.

- **Data Indexing(Bonus):** Integrated `TheGraph` to efficiently index and query blockchain data, enhancing the performance and scalability of the platform.

## Video

- ![Demo](https://github.com/real-venus/Trial-NFT-Marketplace/blob/main/public/video1.mp4)
 ### Implement transaction logging using The Graph (for Ethereum)
- ![Demo](https://github.com/real-venus/Trial-NFT-Marketplace/blob/main/public/video2.mp4)


### Requirements

To run the application you'll need:
* Clone the repository:
  * ```$ git clone https://github.com/real-venus/Trial-NFT-Marketplace.git ```


Now go to project folder and run:


```bash
$ cd Trial-NFT-Marketplace

# install the dependencies
$ cd contract
$ npm install 

# deploy de contracts on the blockchain
$ npx hardhat ignition deploy ./ignition/modules/02-deploy-basic-nft.js --network sepolia
$ npx hardhat ignition deploy ./ignition/modules/02-deploy-nft-marketplace.js --network sepolia

# run the client
$ cd client
$ npm install
$ npm run dev

# run the graph
$ cd graph
$ yarn 
$ yarn codegen
$ yarn build
$ yarn deploy
```

