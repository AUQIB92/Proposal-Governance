import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/Governor.json";
import abi1 from "./contracts/Proposal.json";

//require('dotenv').config();
function App() {

  const GovernorAddres = '0xCA298885F44e663539DDe643715B88178FE9E1E7'
  const ProposalAddress = '0x295Db6924B020b358668C0b85D367db1914C3654'
  const OwnerOfGovernor = '0xdb634749715fB7b5B9aD6dF27A2060FE3fF7bd3e'

  //let propID;
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isGovernorOwner, setIsGovernorOwner] = useState(false);
  const [inputValueVote, setInputValueVote] = useState({ yes_no: "" });
  const [inputValue, setInputValue] = useState({ propName: "", votesReq: "", end: "", });
  const [currentProposalID, setCurrentProposalID] = useState("");
  const [currentProposalName, setcurrentProposalName] = useState("")
  const [currentProposalStatus, setCurrentProposalStatus] = useState("")
  const [currentProposalProposer, setcurrentProposalProposer] = useState("")
  const [currentProposalVotesInFav, setcurrentProposalVotesInFav] = useState("")
  const [currentProposalVotesInAgain, setcurrentProposalVotesAgain] = useState("")
  const [currentProposalVotesReq, setcurrentProposalVotesReq] = useState("")

  const [customerAddress, setCustomerAddress] = useState('');
  const [error, setError] = useState(null);

  const contractABI = abi.abi;
  const propContractAbi = abi1.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log("Account Connected: ", account);

      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getGovernorOwnerHandler = async () => {
    try {

      if (window.ethereum) {
        if (OwnerOfGovernor.toLowerCase() === customerAddress.toLowerCase()) {
          setIsGovernorOwner(true)
          console.log(isGovernorOwner)
        }
        else {
          setIsGovernorOwner(false)
        }
      }
      else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    }
    catch (error) {
      console.log(error);
    }

  }

  const setNewProposal = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const goverContract = new ethers.Contract(GovernorAddres, contractABI, signer);

        const txn = await goverContract.createProposal(inputValue.propName, inputValue.end, inputValue.votesReq);
        console.log("Creating New Proposal...");
        await txn.wait();
        console.log("New Proposal Created ", txn.hash);
        //  await getBankName();
        window.location.reload();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet ");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }
  const handleInputChangeVotes = (event) => {
    setInputValueVote(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }


  const getProposal = async (event) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const propContract = new ethers.Contract(ProposalAddress, propContractAbi, signer);
        let propID = await propContract.proposalID();
        setCurrentProposalID(propID);
        ;
        if (propID) {
          const res = await propContract.getProposalStatus(propID);
          console.log(res[0])

          setcurrentProposalName(res[0]);
          setcurrentProposalProposer(res[1]);
          if (res.s === 0) {
            setCurrentProposalStatus("PROPOSED: VOTING GOING ON");
          }
          else if (res.s === 1) {

            setCurrentProposalStatus("ACCEPTED: PROPOSAL PASSED");
          }
          else {

            setCurrentProposalStatus("REJECTED: PROPOSAL REJECTED");

          }


          setcurrentProposalVotesInFav(Number(res[3]));
          setcurrentProposalVotesAgain(Number(res[4]));
          setcurrentProposalVotesReq(Number(res[5]));
        }

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet ");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const voteOnProposal = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum && currentProposalID) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const govContract = new ethers.Contract(GovernorAddres, contractABI, signer);

        const txn = await govContract.vote(currentProposalID, inputValueVote.yes_no);
        console.log("Voting...");
        await txn.wait();
        console.log("Voted ", txn.hash);
        window.location.reload();
      }
      else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet ");
      }
    } catch (error) {
      // setProposalVoteError(error);
      console.log(error);
    }
  };
  const setStatusProp = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum && currentProposalID) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const govContract = new ethers.Contract(GovernorAddres, contractABI, signer);
        console.log(currentProposalID)
        const txn = await govContract.setStatus(currentProposalID);
        console.log("Setting Status ...");
        await txn.wait();
        console.log("Status Set ", txn.hash);
        window.location.reload();
      }
      else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet .");
      }
    } catch (error) {
      // setProposalVoteError(error);
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getGovernorOwnerHandler();
    getProposal();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
    }
    //voteOnProposal()
    //customerBalanceHandler()
  },)

  return (
    <main className="main-container">
      <h2 className="headline"><span className="headline-gradient">Proposal Governance Project</span> 💰</h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
        <div className="mt-5">
            {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{customerAddress}</p>}
            <button className="btn-connect" onClick={checkIfWalletIsConnected}>
              {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
            </button>
          </div>
        </div>
        <div className="mt-7 mb-9">
          <div className="mt-5">
            {isWalletConnected && <p><span className="font-bold">Current  Proposal: </span>{currentProposalName}
              <span className=''>With Proposal ID :</span>{currentProposalID}</p>}
            {isWalletConnected && <p><span className="font-bold"> Proposer: </span>{currentProposalProposer}</p>}
            {isWalletConnected && <p><span className="font-bold"> Proposal  Status: </span>{currentProposalStatus}</p>}
            {isWalletConnected && <p><span className="font-bold"> Votes Received in Favour: </span>{currentProposalVotesInFav}</p>}
            {isWalletConnected && <p><span className="font-bold">Votes Received Against: </span>{currentProposalVotesInAgain}</p>}
            {isWalletConnected && <p><span className="font-bold">Votes Required to Pass </span>{currentProposalVotesReq}</p>}





          </div>
        
        </div>

        <div className="mt-5">
          <input
            type="text"
            className="input-style"
            onChange={handleInputChangeVotes}
            name="yes_no"
            placeholder="true or false"
            value={inputValueVote.yes_no}
          />
          <button
            className="btn-connect"
            onClick={voteOnProposal}>
            Vote for Proposal
          </button>
        </div>





      </section>
      {isGovernorOwner
        && (
          <section className="Governor-section">
            <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Governor Admin Panel</h2>
            <div className="p-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="propName"
                  placeholder="Enter a Name for Your Proposal You Want to Put forth"
                  value={inputValue.propName}
                />
                <input
                  type="number"
                  className="input-style"
                  onChange={handleInputChange}
                  name="votesReq"
                  placeholder="Enter Votes Required to pass the Proposal"
                  value={inputValue.votesReq}
                />

                <input
                  type="number "
                  className="input-style"
                  onChange={handleInputChange}
                  name="end"
                  placeholder="Enter End time in UNix Epoc  Sces "
                  value={inputValue.end}
                />
                <button
                  className="btn-grey"
                  onClick={setNewProposal}>
                  Create New Proposal
                </button>
              </form>
              <button
                className="btn-connect"
                onClick={setStatusProp}>
                Execute Proposal
              </button>
            </div>
          </section>
        )
      }
    </main>
  );
}
export default App;
