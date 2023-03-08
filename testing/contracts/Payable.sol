// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract Payable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    address payable public owner;
    IERC20Upgradeable GOHM;

    constructor() payable {
        owner = payable(msg.sender);
    }


    function depositWithParams(uint256 amount, uint256 someRandomVar) public payable {
        GOHM.safeTransferFrom(msg.sender, owner, amount);
    }

    function pay(uint256 amount) public payable {
        GOHM.safeTransferFrom(msg.sender, owner, amount);
    }

    function deposit(uint256 amount) public payable {
        GOHM.safeTransferFrom(msg.sender, owner, amount);
    }

    function depositWithArgs(uint256 amount, uint256 someRandomArg, address someOtherRandomArgs) public payable {
        GOHM.safeTransferFrom(msg.sender, owner, amount);
    }

    function setGohmAddress(address _gohmAddress) public {
        GOHM = IERC20Upgradeable(_gohmAddress);
    }
}