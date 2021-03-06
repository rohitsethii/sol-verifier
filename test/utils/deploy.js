'use strict';

const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
const solc = require('./solc');


module.exports.deployContract = async (contractName, network, compiler, contractPath = null, initParams = [], optimize = false) => {// eslint-disable-line max-len
  const net = 'https://' + network +'.infura.io/';
  const web3 = new Web3(new HDWalletProvider(process.env.SEED, net));
  if(!contractPath)
    contractPath = __dirname + '/../contracts/'+ contractName + '.sol';
  try{
    const { bytecode, abi } = await solc.compile(contractPath, contractName, optimize, compiler);
    const myContract = new web3.eth.Contract(abi);
    const result = await myContract.deploy({
      data: '0x' + bytecode,
      arguments: initParams,
    })
      .send({
        from: process.env.ADDRESS,
      });
    return result.options.address;
  }catch(err){
    throw err;
  }

};
