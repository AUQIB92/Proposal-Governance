// SPDX-License-Identifier: No Licence 
pragma solidity >=0.7.0 <0.9.0;
contract Proposal
{
address owner;
uint32  public proposalID;
enum  status{
PROPOSED,
ACCEPTED,
REJECTED

}
   

   // Events  




   event newProposalEvent( address indexed ,string indexed , uint indexed,uint);
event Voted(address indexed, uint indexed);

struct proposal

{

    // Creator of campaign
        address proposer;

        // Proposal ?

        string prop; 
        // No. of Votes Required
    
        uint16 votesReq;
        // Timestamp of start of campaign
     uint16 votesRecInFavour;
        // Timestamp of end of campaign
       uint16 votesRecAgainst;
        // True if goal was reached and creator has claimed the tokens.
 
 uint256 startTime;
 uint256 endTime;
status   s;
 bool valid;
 mapping(address=>bool) voted;
}
 mapping(uint=>proposal)  public proposals;

function newProposal(address _proposer, string memory _proposalName,
       uint _deadline, uint16 _votesRequired
       
    ) external {

        require(msg.sender==owner,"Not Owner, U can create new proposal only via  Governer Contract");
 proposalID += 1;
proposal storage  str = proposals[proposalID];
        str.proposer= _proposer;
        str.startTime= block.timestamp;
        str.votesReq=_votesRequired;
        str.prop=_proposalName;
        str.endTime=_deadline;
        str.s=status.PROPOSED;
        str.votesRecInFavour=0;
        str.votesRecAgainst=0;
        str.valid=true;

        emit newProposalEvent(_proposer,_proposalName, _deadline, _votesRequired);
        
    }
constructor(address _owner)
{

    owner=_owner;
}

 function _vote(uint _id, bool val, address voter) external{
proposal storage  str = proposals[_id];

require(!str.voted[voter]," Already Voted on Proposal");
require(msg.sender==owner,"Not Owner, U can vote only via  Governer Contract");
require(block.timestamp<=str.endTime,"Can't Vote, Voting is Over ");

str.voted[msg.sender]=true;
if (val)
{
str.votesRecInFavour++;
}
else 
{
str.votesRecAgainst++;
}


emit Voted(voter, _id);
}

function _setStatus(uint _id) external 
   {
 
proposal storage  str = proposals[_id];  
require(msg.sender==owner,"Not Owner, Only Governer Can Set Status");
require(block.timestamp>=str.endTime,"Can't Set Voting still going");
if(str.votesRecInFavour>= str.votesReq)
{
str.valid=false;
str.s=status.ACCEPTED;


}
else  
{
str.valid=false;
str.s=status.REJECTED;

}



   }

function getProposalStatus(uint _ID) public view   returns (string memory name, address proposer, status  s, uint votesInFav,uint votesAgain, uint votesReq) {

proposal storage str= proposals[_ID];
name=str.prop;
proposer=str.proposer;
s=str.s;
votesAgain=str.votesRecAgainst;
votesInFav=str.votesRecInFavour;
votesReq=str.votesReq;



   }

    
}