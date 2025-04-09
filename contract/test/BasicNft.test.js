const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BasicNft", function () {
    let basicNft;
    let deployer;
    let user1;
    const TOKEN_URI = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

    beforeEach(async function () {
        [deployer, user1] = await ethers.getSigners();

        const BasicNft = await ethers.getContractFactory("BasicNft");
        basicNft = await BasicNft.deploy();
    });

    describe("Constructor", function () {
        it("should initialize with correct name and symbol", async function () {
            expect(await basicNft.name()).to.equal("Dogie");
            expect(await basicNft.symbol()).to.equal("DOG");
        });

        it("should initialize token counter to zero", async function () {
            expect(await basicNft.getTokenCounter()).to.equal(0);
        });
    });

    describe("mintNft", function () {
        it("should mint an NFT to the caller", async function () {
            await expect(basicNft.connect(user1).mintNft())
                .to.emit(basicNft, "DogMinted")
                .withArgs(0);

            expect(await basicNft.ownerOf(0)).to.equal(user1.address);
            expect(await basicNft.getTokenCounter()).to.equal(1);
        });

        it("should increment token counter after minting", async function () {
            await basicNft.mintNft();
            expect(await basicNft.getTokenCounter()).to.equal(1);
            
            await basicNft.mintNft();
            expect(await basicNft.getTokenCounter()).to.equal(2);
        });

        it("should emit Transfer event", async function () {
            await expect(basicNft.mintNft())
                .to.emit(basicNft, "Transfer")
                .withArgs(ethers.ZeroAddress, deployer.address, 0);
        });

        it("should allow multiple users to mint", async function () {
            await basicNft.connect(deployer).mintNft();
            await basicNft.connect(user1).mintNft();

            expect(await basicNft.ownerOf(0)).to.equal(deployer.address);
            expect(await basicNft.ownerOf(1)).to.equal(user1.address);
            expect(await basicNft.getTokenCounter()).to.equal(2);
        });
    });

    describe("tokenURI", function () {
        it("should return correct token URI for minted token", async function () {
            await basicNft.mintNft();
            expect(await basicNft.tokenURI(0)).to.equal(TOKEN_URI);
        });

        it("should revert for non-existent token", async function () {
            await expect(
                basicNft.tokenURI(0)
            ).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
        });
    });

    describe("ERC721 Standard Functionality", function () {
        beforeEach(async function () {
            await basicNft.connect(deployer).mintNft();
        });

        it("should support ERC721 interface", async function () {
            const ERC721InterfaceId = "0x80ac58cd";
            expect(await basicNft.supportsInterface(ERC721InterfaceId)).to.be.true;
        });

        it("should allow token transfers", async function () {
            await expect(
                basicNft.transferFrom(deployer.address, user1.address, 0)
            )
                .to.emit(basicNft, "Transfer")
                .withArgs(deployer.address, user1.address, 0);

            expect(await basicNft.ownerOf(0)).to.equal(user1.address);
        });

        it("should allow token approval", async function () {
            await expect(
                basicNft.approve(user1.address, 0)
            )
                .to.emit(basicNft, "Approval")
                .withArgs(deployer.address, user1.address, 0);

            expect(await basicNft.getApproved(0)).to.equal(user1.address);
        });

        it("should allow setting approval for all", async function () {
            await expect(
                basicNft.setApprovalForAll(user1.address, true)
            )
                .to.emit(basicNft, "ApprovalForAll")
                .withArgs(deployer.address, user1.address, true);

            expect(await basicNft.isApprovedForAll(deployer.address, user1.address)).to.be.true;
        });
    });

    describe("getTokenCounter", function () {
        it("should return correct token counter value", async function () {
            expect(await basicNft.getTokenCounter()).to.equal(0);
            
            await basicNft.mintNft();
            expect(await basicNft.getTokenCounter()).to.equal(1);
            
            await basicNft.mintNft();
            expect(await basicNft.getTokenCounter()).to.equal(2);
        });
    });

    describe("Edge Cases", function () {
        it("should handle multiple mints in the same transaction", async function () {
            await Promise.all([
                basicNft.mintNft(),
                basicNft.mintNft(),
                basicNft.mintNft()
            ]);

            expect(await basicNft.getTokenCounter()).to.equal(3);
        });

        it("should maintain correct ownership after multiple transfers", async function () {
            await basicNft.mintNft();
            await basicNft.transferFrom(deployer.address, user1.address, 0);
            
            const user2 = (await ethers.getSigners())[2];
            await basicNft.connect(user1).transferFrom(user1.address, user2.address, 0);
            
            expect(await basicNft.ownerOf(0)).to.equal(user2.address);
        });
    });
});