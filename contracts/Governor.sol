// SPDX-License-Identifier: No Licence
pragma solidity >=0.7.0 <0.9.0;
import "./Proposal.sol";
import "hardhat/console.sol";

contract Governor {
    Proposal prop;
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function setProposalAddress(address _proposlaAddr) public {
        require(msg.sender == owner, "Only Owner");

        prop = Proposal(_proposlaAddr);
    }

    // Governor Functions
    function setStatus(uint256 _ID) public {
        require(msg.sender == owner, "Only Owner");
        require(_ID != 0, "Proposal ID Can't be 0");

        prop._setStatus(_ID);
    }

    function vote(uint256 _ID, bool _favorOrAgainst) public {
        require(_ID != 0, "Proposal ID Can't be 0");
        console.log("Voting Started");
        prop._vote(_ID, _favorOrAgainst, msg.sender);
    }

    function createProposal(
        string memory _proposalName,
        uint256 _deadline,
        uint16 _votesRequired
    ) public {
      
        console.log("New Proposal is being Pushed");
        prop.newProposal(owner, _proposalName, _deadline, _votesRequired);
    }
}
