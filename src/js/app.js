App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 42000000,

    init: function() {
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
                App.listenForEvents();
                
                return App.render();
            });
        })
    },

    render: function() {
        if (App.loading) {
            return;
        }
        App.loading = true;

        var loader = $('#loader');
        var content = $('#content');

        loader.show();
        content.hide();

        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                App.account = account;
                $('#accountAddress').html("Your Account: " + account);
            }
        });

        App.contracts.KTechTokenSale.deployed().then(function(instance) {
            ktechTokenSaleInstance = instance;
            return ktechTokenSaleInstance.tokenPrice();
        }).then(function(tokenPrice) {
            App.tokenPrice = tokenPrice.toNumber();
            $('.token-price').html(web3.fromWei(App.tokenPrice, 'ether'));
            return ktechTokenSaleInstance.tokensSold();
        }).then(function(tokensSold) {
            App.tokensSold = tokensSold.toNumber();
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
            $('#progress').css('width', progressPercent + '%');

            App.contracts.KTechToken.deployed().then(function(instance) {
                ktechTokenInstance = instance;
                return ktechTokenInstance.balanceOf(App.account);
            }).then(function(balance) {
                $('.ktt-balance').html(balance.toNumber());
                App.loading = false;
                loader.hide();
                content.show();
            })
        });

        App.loading = false;
        loader.hide();
        content.show();
    },

    listenForEvents: function() {
        App.contracts.KTechTokenSale.deployed().then(function(instance) {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'latest',
            }).watch(function(error, event) {
                console.log("Sell event triggered", event);
                App.render();
            })
        })
    },

    buyTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        App.contracts.KTechTokenSale.deployed().then(function(instance) {
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 500000
            });
        }).then(function(result) {
            console.log("Tokens bought...");
            $('form').trigger('reset');
        });
    }
};

$(function() {
    $(window).load(function() {
        App.init();
    });
});