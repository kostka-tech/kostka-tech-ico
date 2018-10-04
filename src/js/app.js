App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        console.log('App initialized...');
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }

        return App.initContracts();
    },

    initContracts: function() {
        $.getJSON("KTechTokenSale.json", function(ktechTokenSale) {
            App.contracts.KTechTokenSale = TruffleContract(ktechTokenSale);
            App.contracts.KTechTokenSale.setProvider(App.web3Provider);
            App.contracts.KTechTokenSale.deployed().then(function(ktechTokenSale) {
                console.log("KTechToken Sale Address:", ktechTokenSale.address);
            });
        }).done(function() {
            $.getJSON("KTechToken.json", function(ktechToken) {
                App.contracts.KTechToken = TruffleContract(ktechToken);
                App.contracts.KTechToken.setProvider(App.web3Provider);
                App.contracts.KTechToken.deployed().then(function(ktechToken) {
                    console.log("Ktech Token Address:", ktechToken.address);
                });
                return App.render();
            });
        })
    },

    render: function() {
        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                App.account = account;
                $('#accountAddress').html("Your Account: " + account);
            }
        });
    },
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});