const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BasicNft", (m) => {
  const apollo = m.contract("BasicNft", []);

  //   m.call(apollo, "launch", []);

  return { apollo };
});

module.exports.tags = ["all", "basicnft"];
