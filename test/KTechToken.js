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

    it('transfers tokens', function() {
        return KTechToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 999999999999999);
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0);
            return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0]});
        }).then(function(success) {
            assert.equal(success, true);
            return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0]});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1);
            assert.equal(receipt.logs[0].event, 'Transfer');
            assert.equal(receipt.logs[0].args._from, accounts[0]);
            assert.equal(receipt.logs[0].args._to, accounts[1]);
            assert.equal(receipt.logs[0].args._value, 250000);
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 250000);
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 41750000);
        });
    });

    it('approves tokens for delegated transfer', function() {
        return KTechToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success) {
            assert.equal(success, true);
            return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1);
            assert.equal(receipt.logs[0].event, 'Approval');
            assert.equal(receipt.logs[0].args._owner, accounts[0]);
            assert.equal(receipt.logs[0].args._spender, accounts[1]);
            assert.equal(receipt.logs[0].args._value, 100);
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 100);
        });
    });

});
