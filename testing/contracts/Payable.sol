// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract Payable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    address payable public owner;

    constructor() payable {
        owner = payable(msg.sender);
    }

    function deposit() public {}

    function depositWithParams(uint256 someRandomVar, IERC20Upgradeable token, uint256 amount) public payable {
        token.safeTransferFrom(msg.sender, address(this), amount);
    }
}