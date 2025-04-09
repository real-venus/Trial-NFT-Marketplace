const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftMarketplace", function () {
    let nftMarketplace;
    let basicNft;
    let deployer;
    let user1;
    let user2;
    const PRICE = ethers.parseEther("0.1");
    const TOKEN_ID = 0;

    beforeEach(async function () {
        [deployer, user1, user2] = await ethers.getSigners();
        const BasicNft = await ethers.getContractFactory("BasicNft");
        basicNft = await BasicNft.deploy();
        const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
        nftMarketplace = await NftMarketplace.deploy();
        await basicNft.connect(deployer).mintNft();
    });

    describe("listItem", function () {
        beforeEach(async function () {
            await basicNft.approve(nftMarketplace.target, TOKEN_ID);
        });

        it("should list an NFT successfully", async function () {
            await expect(
                nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
            )
                .to.emit(nftMarketplace, "ItemListed")
                .withArgs(deployer.address, basicNft.target, TOKEN_ID, PRICE);

            const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID);
            expect(listing.price).to.equal(PRICE);
            expect(listing.seller).to.equal(deployer.address);
        });

        it("should revert if price is zero", async function () {
            await expect(
                nftMarketplace.listItem(basicNft.target, TOKEN_ID, 0)
            ).to.be.revertedWithCustomError(
                nftMarketplace,
                "NftMarketplace__PriceMustBeAboveZero"
            );
        });

        it("should revert if NFT is not approved", async function () {
            await basicNft.approve(ethers.ZeroAddress, TOKEN_ID);
            
            await expect(
                nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE)
            ).to.be.revertedWithCustomError(
                nftMarketplace,
                "NftMarketplace__NotApprovedForMarketplace"
            );
        });
    });

    describe("buyItem", function () {
        beforeEach(async function () {
            await basicNft.approve(nftMarketplace.target, TOKEN_ID);
            await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE);
        });

        it("should allow buying a listed NFT", async function () {
            await expect(
                nftMarketplace.connect(user1).buyListing(basicNft.target, TOKEN_ID, {
                    value: PRICE,
                })
            )
                .to.emit(nftMarketplace, "ItemBought")
                .withArgs(user1.address, basicNft.target, TOKEN_ID, PRICE);

            const newOwner = await basicNft.ownerOf(TOKEN_ID);
            expect(newOwner).to.equal(user1.address);
        });

        it("should revert if price is not met", async function () {
            const lowPrice = ethers.parseEther("0.05");
            await expect(
                nftMarketplace.connect(user1).buyListing(basicNft.target, TOKEN_ID, {
                    value: lowPrice,
                })
            ).to.be.revertedWithCustomError(
                nftMarketplace,
                "NftMarketplace__PriceNotMet"
            );
        });
    });

    describe("cancelListing", function () {
        beforeEach(async function () {
            await basicNft.approve(nftMarketplace.target, TOKEN_ID);
            await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE);
        });

        it("should cancel a listing", async function () {
            await expect(
                nftMarketplace.cancelListing(basicNft.target, TOKEN_ID)
            )
                .to.emit(nftMarketplace, "ItemCanceled")
                .withArgs(deployer.address, basicNft.target, TOKEN_ID);

            const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID);
            expect(listing.price).to.equal(0);
        });

        it("should revert if caller is not the owner", async function () {
            await expect(
                nftMarketplace.connect(user1).cancelListing(basicNft.target, TOKEN_ID)
            ).to.be.revertedWithCustomError(nftMarketplace, "NftMarketplace__NotOwner");
        });
    });

    describe("updateListing", function () {
        const NEW_PRICE = ethers.parseEther("0.2");

        beforeEach(async function () {
            await basicNft.approve(nftMarketplace.target, TOKEN_ID);
            await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE);
        });

        it("should update listing price", async function () {
            await expect(
                nftMarketplace.updateListing(basicNft.target, TOKEN_ID, NEW_PRICE)
            )
                .to.emit(nftMarketplace, "ItemListed")
                .withArgs(deployer.address, basicNft.target, TOKEN_ID, NEW_PRICE);

            const listing = await nftMarketplace.getListing(basicNft.target, TOKEN_ID);
            expect(listing.price).to.equal(NEW_PRICE);
        });

        it("should revert if new price is zero", async function () {
            await expect(
                nftMarketplace.updateListing(basicNft.target, TOKEN_ID, 0)
            ).to.be.revertedWithCustomError(
                nftMarketplace,
                "NftMarketplace__PriceMustBeAboveZero"
            );
        });
    });

    describe("withdrawProceeds", function () {
        beforeEach(async function () {
            await basicNft.approve(nftMarketplace.target, TOKEN_ID);
            await nftMarketplace.listItem(basicNft.target, TOKEN_ID, PRICE);
            await nftMarketplace.connect(user1).buyListing(basicNft.target, TOKEN_ID, {
                value: PRICE,
            });
        });

        it("should allow seller to withdraw proceeds", async function () {
            const initialBalance = await ethers.provider.getBalance(deployer.address);
            await nftMarketplace.withdrawProceeds();
            const finalBalance = await ethers.provider.getBalance(deployer.address);
            
            expect(finalBalance).to.be.gt(initialBalance);
        });

        it("should revert if no proceeds available", async function () {
            await nftMarketplace.withdrawProceeds();
            
            await expect(
                nftMarketplace.withdrawProceeds()
            ).to.be.revertedWithCustomError(
                nftMarketplace,
                "NftMarketplace__NoProceeds"
            );
        });
    });
});