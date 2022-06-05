// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const [owner] = await hre.ethers.getSigners();
  const Governor = await hre.ethers.getContractFactory("Governor");
  const govern = await Governor.deploy();
  await govern.deployed();

  console.log("Governor Contract deployed to:", govern.address);
  console.log(" Deployer address:", owner.address);

  
  const Proposal = await hre.ethers.getContractFactory("Proposal");
  const proposal = await Proposal.deploy(govern.address);
  await proposal.deployed();

  console.log("Proposal Contract  deployed to:", proposal.address);

const res= await govern.setProposalAddress(proposal.address)
console.log(res)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
