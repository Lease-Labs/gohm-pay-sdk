# gohm-payment-sdk

A utility SDK with useful functions to make payments with gOHM easy. You won't have to worry about finding all the addresses
and finding which networks gOHM is available.

>> Only works with the EVM compatible chains

## Quickstart

Install the library with 

`npm install --save gohm-payment-sdk` or 

`yarn add gohm-payment-sdk`

#### ES6

```javascript
import GohmPayment from 'gohm-payment-sdk';
```

## GohmPayment Usage

### API

| Method                                                | Description                                                                                                                                                                                                                    |
|-------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **constructor(config)**                               | Given the ABI, the contract address, the payable method name as well as the network and a signer, initiates a new gohmPayment instance.                                                                                        |
| **pay(amount: number/string, setAllowance: boolean)** | Given the amount of gOHM to pay in the contract method, checks if everything is valid and initiates the payment. <br/><br/> `setAllowance = true` will check if the contract has allowance to spend and if not it will set it. |
| **setAllowance(amount: number)**                      | Allow the contract to spend `amount` of gOHM.                                                                                                                                                                                  |
| **hasAllowanceToSpend(amount: number)**               | Checks if the current signer has approved `amount` of gOHM.                                                                                                                                                                    |
| **formatToGwei(amount: number or string)**            | Static Utility method that accepts a gOHM amount and formats it to gwei                                                                                                                                                        |
| **formatToNumber(gwei: numberlike)**                  | Static Utility method that accepts gOHM in gwei and formats it to a number                                                                                                                                                     |
| **validateMethod**                                    | Utility method to validate if the contract method is included in the given abi and in the contract and it is payable                                                                                                           |

### Constants and Types
| Name                     | Type     | Description                                                                                |
|--------------------------|----------|--------------------------------------------------------------------------------------------|
| **NETWORK**              | Constant | An object which you can use to get the available networks and their ID                     |
| **GOHM_NETWORK_ADDRESS** | Constant | An object which contains the gOHM contract addresses for any network (EVM compatible ones) |
| **AVAILABLE_NETWORKS**   | Type     | TS type that defines the available networks this library and gOHM can work with.           |


## Contributing

```
git clone git@github.com:Lease-Labs/gohm-pay-sdk.git
cd gohm-pay-sdk
npm install 
```

### Guidelines
The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the contributing guidelines for the appropriate sections.

### Create a branch
```
git checkout master
git pull origin main to ensure you have the latest main code
git checkout -b the-name-of-my-branch (replacing the-name-of-my-branch with a suitable name) to create a branch
```
### Make the change
Few simple steps
* Write the code
* Adapt tests or write new (feel free to use TDD if you will :) )
* Create a Pull Request

### Testing
To run them simply do
```sh
$ npm test
```

To write a new test you need to set a `.env` file that is read by hardhat. Check `.env.template` for the parameters needed

## License (MIT)

```
Copyright (c) 2023 LeaseLabs <petros@tripstrade.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
