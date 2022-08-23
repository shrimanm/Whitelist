const { ethers } = require('hardhat');

async function main() {
  // whitelist contract is a factory for instance of our whitelist contract
  const whitelistContract = await ethers.getContractFactory('Whitelist');

  //here we deploy our contract
  const deployedWhitelistContract = await whitelistContract.deploy(10);

  //wait for the contract to be deployed
  await deployedWhitelistContract.deployed();

  ///once deployed then print the addresss of the contract
  console.log(
    'Whitelist Contract Address : ',
    deployedWhitelistContract.address
  );
}

//call the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
