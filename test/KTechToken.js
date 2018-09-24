var KTechToken = artifacts.require("./KTechToken.sol");

contract('KTechToken', function(accounts) {

    it('sets the total supply', function() {
        return KTechToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000);
        });
    });

});
