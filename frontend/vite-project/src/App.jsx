import { useState, useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";
import { abi, contractAddress } from "./contracts/Voting.json";
import "./App.css";

function App() {
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState("");
  const [voted, setVoted] = useState(false);

  const provider = new BrowserProvider(window.ethereum);

  const connectMetamask = async () => {
    const signer = await provider.getSigner();
    alert(`Connected to Metamask with address: ${await signer.getAddress()}`);
  };

  const fetchCandidates = async () => {
    const activeCandidate = new Contract(contractAddress, abi, await provider.getSigner());
    const count = await activeCandidate.candidatesCount();

    const tempCandidates = [];
    for (let i = 0; i < count; i++) {
      const candidate = await activeCandidate.candidates(i);
      tempCandidates.push({ id: i, name: candidate[0], points: candidate[1] });
    }
    setCandidates(tempCandidates);
  };

  const vote = async (candidateId, voteRank) => {
    try {
      const activeCandidate = new Contract(contractAddress, abi, await provider.getSigner());
      await activeCandidate.vote(candidateId, voteRank);
      alert(`Voted successfully for ${candidates[candidateId].name}!`);
      setVoted(true);
      fetchCandidates(); 
    } catch (error) {
      alert("Voting failed: " + error.message);
    }
  };

  const displayWinner = async () => {
    const activeCandidate = new Contract(contractAddress, abi, await provider.getSigner());
    const winnerName = await activeCandidate.getWinner();
    setWinner(winnerName);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div className="app">
      <h1 className="header">Decentralized Voting System - IIT Kanpur</h1>
      <button className="connect-button" onClick={connectMetamask}>
        Connect to Metamask
      </button>
      <div className="candidates-container">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="candidate-card">
            <h3>{candidate.name}</h3>
            <p>Points: {candidate.points}</p>
            <div className="vote-buttons">
              <button onClick={() => vote(candidate.id, 1)}>Vote Rank 1 (5 Points)</button>
              <button onClick={() => vote(candidate.id, 2)}>Vote Rank 2 (3 Points)</button>
              <button onClick={() => vote(candidate.id, 3)}>Vote Rank 3 (1 Point)</button>
            </div>
          </div>
        ))}
      </div>
      <button className="winner-button" onClick={displayWinner}>
        Display Winner
      </button>
      {winner && <p className="winner-announcement">The winner is: {winner}</p>}
    </div>
  );
}

export default App;
