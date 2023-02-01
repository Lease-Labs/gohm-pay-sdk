# gohm-sdk

A library which makes payments with gOhm easy.

## gOhm payments

**This library gets a method from a contract and calls that method with X amount of gOhm as payment.**

## Installation and Usage

Install the library with `npm install gohm-sdk`

#### ES6

```javascript
import gohm from 'gohm-sdk';
```

## GohmPayment class Usage

Here is a list of the functions currently available.

Function                               | Description
--------------------------------------- | --------------------------------------
**constructor(config)**    | Given the abi, the contract address, the payable method name as well as the network and a signer, creates a new gohmPayment object.
**pay(amount: number or string, setAllowance: boolean)**             | Given the amount of gohm to pay in the contract method, checks if everything is valid and initiates the payment. <br/><br/> `setAllowance` is a boolean that defaults to true.
**setAllowance(amount: number)**               | Sets the currency amount allowance.
**hasAllowanceToSpend(amount: number)** | Checks if the current signer has enough gohm to pay.
**validateMethod** | Validates if the given contract method is included in the given abi and in the contract and it is payable



## Tests

Tests are using jest, to run the tests use:

```sh
$ npm test --coverage
```

## License (MIT)

```
Copyright (c) 2023 Petros Sideris <petros@tripstrade.com>

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
