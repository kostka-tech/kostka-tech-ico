var KTechToken = artifacts.require("./KTechToken.sol");

module.exports = function(deployer) {
    deployer.deploy(KTechToken, 42000000);
};
