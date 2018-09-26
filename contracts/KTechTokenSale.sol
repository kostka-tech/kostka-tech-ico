pragma solidity ^ 0.4.17;

import './KTechToken.sol';

contract KTechTokenSale {

    address admin;
    KTechToken public tokenContract;
    uint256 public tokenPrice;

    constructor(KTechToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

}
