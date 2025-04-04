const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NftMarketplace", (m) => {
  const apollo = m.contract("NftMarketplace", []);

  //   m.call(apollo, "launch", []);

  return { apollo };
});

module.exports.tags = ["all", "nftmarketplace"];
