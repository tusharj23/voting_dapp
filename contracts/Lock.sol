// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 points;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;
    mapping(address => uint8) public votesCast; 

    event CandidateAdded(uint256 id, string name);
    event VoteCasted(address voter, uint256 candidateId, uint256 points);
    event WinnerAnnounced(string name, uint256 points);

    constructor(string[] memory _candidates) {
        for (uint256 i = 0; i < _candidates.length; i++) {
            candidates[i] = Candidate(_candidates[i], 0);
            candidatesCount++;
            emit CandidateAdded(i, _candidates[i]);
        }
    }

    function vote(uint256 _candidateId, uint8 _voteRank) external {
        require(votesCast[msg.sender] < 3, "You can cast a maximum of 3 votes.");
        require(_candidateId < candidatesCount, "Invalid candidate ID.");
        require(_voteRank >= 1 && _voteRank <= 3, "Vote rank must be 1, 2, or 3.");
        require(votesCast[msg.sender] + _voteRank <= 6, "Exceeding the total allowed votes.");

        uint256 points = (_voteRank == 1) ? 5 : (_voteRank == 2) ? 3 : 1;
        candidates[_candidateId].points += points;
        votesCast[msg.sender] += _voteRank;

        emit VoteCasted(msg.sender, _candidateId, points);
    }

    function getWinner() external view returns (string memory winnerName) {
        uint256 maxPoints = 0;
        for (uint256 i = 0; i < candidatesCount; i++) {
            if (candidates[i].points > maxPoints) {
                maxPoints = candidates[i].points;
                winnerName = candidates[i].name;
            }
        }
    }
}
