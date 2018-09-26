var KTechTokenSale = artifacts.require("./KTechTokenSale.sol");

contract('KTechTokenSale', function(accounts) {

    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // wei (0.001 ether)

    it('init the contract with the correct values', function() {
        return KTechTokenSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address) {
            assert.notEqual(address, 0x0);
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address, 0x0);
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price.toNumber(), tokenPrice);
        });
    });

});
