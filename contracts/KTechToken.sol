pragma solidity ^ 0.4.17;

contract KTechToken {

    string public name = "KTech Token";
    string public symbol = "KTT";
    string public standard = "KTech Token v1.0";
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    function KTechToken(uint256 _initialSupply)  public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
}
