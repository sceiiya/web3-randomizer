// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GoalRandomizer {
    uint256 public goalNumber;
    address public owner;
    
    uint256 private constant MIN_VALUE = 1;
    uint256 private constant MAX_VALUE = 59;

    event GoalNumberUpdated(uint256 newGoalNumber);

    // Modifier kept in contract but not used (for reference or future use)
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        goalNumber = 1;
    }

    function generateRandomNumber() private view returns (uint256) {
        uint256 random = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender
                )
            )
        );
        return (random % (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE;
    }

    // Removed onlyOwner modifier to allow anyone to call this function
    function randomizeGoalNumber() external {
        uint256 newGoalNumber = generateRandomNumber();
        goalNumber = newGoalNumber;
        emit GoalNumberUpdated(newGoalNumber);
    }

    function getGoalNumber() external view returns (uint256) {
        return goalNumber;
    }
}