pragma solidity ^ 0.4.17;

import './KTechToken.sol';

contract KTechTokenSale {

    address admin;
    KTechToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(KTechToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    // Taken from dapphub/ds-math
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOftokens) public payable {
        require(msg.value == multiply(_numberOftokens, tokenPrice));
        require(tokenContract.balanceOf(this) >= _numberOftokens);
        require(tokenContract.transfer(msg.sender, _numberOftokens));

        tokensSold += _numberOftokens;
        
        emit Sell(msg.sender, _numberOftokens);
    }

}
