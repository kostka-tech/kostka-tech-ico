var KTechToken = artifacts.require("./KTechToken.sol");
var KTechTokenSale = artifacts.require("./KTechTokenSale.sol");

module.exports = function(deployer) {
    deployer.deploy(KTechToken, 42000000).then(function() {
        var tokenPrice = 1000000000000000; // wei (0.001 ether)
        return deployer.deploy(KTechTokenSale, KTechToken.address, tokenPrice);
    });
};
