var KTechToken = artifacts.require("./KTechToken.sol");
var KTechTokenSale = artifacts.require("./KTechTokenSale.sol");

contract('KTechTokenSale', function(accounts) {

    var tokenInstance;
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // wei (0.001 ether)
    var tokensAvailable = 31500000;
    var admin = accounts[0];
    var buyer = accounts[1];
    var numberOfTokens;

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

    it('allows users to purchase tokens', function() {
        return KTechToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return KTechTokenSale.deployed();
        }).then(function(instance) {
            tokenSaleInstance = instance;
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
        }).then(function(receipt) {
            numberOfTokens = 10;
            var value = numberOfTokens * tokenPrice;
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: value});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1);
            assert.equal(receipt.logs[0].event, 'Sell');
            assert.equal(receipt.logs[0].args._buyer, buyer);
            assert.equal(receipt.logs[0].args._amount, numberOfTokens);
            return tokenSaleInstance.tokensSold();
        }).then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0);
            var value = numberOfTokens * tokenPrice;
            return tokenSaleInstance.buyTokens(35000000, { from: buyer, value: value});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0);
        });
    });

});
