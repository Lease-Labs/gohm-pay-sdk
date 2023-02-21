//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FakeGohm is ERC20, ERC20Burnable, Ownable {
    uint256 tokenAmountMantissa = 1 ether;

    constructor(uint256 initialSupply) ERC20("gOHM", "GOHM") {
        _mint(msg.sender, initialSupply * tokenAmountMantissa);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function burnTokens(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
}
