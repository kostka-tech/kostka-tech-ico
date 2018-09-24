var KTechToken = artifacts.require("./KTechToken.sol");

contract('KTechToken', function(accounts) {

    var tokenInstance;

    it('init the contract with the correct values', function() {
        return KTechToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, 'KTech Token');
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, 'KTT');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'KTech Token v1.0');
        });
    });

    it('allocates the initial supply', function() {
        return KTechToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 42000000);
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 42000000);
        });
    });

});
