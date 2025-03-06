// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/GoalRandomizer.sol";

contract DeployGoalRandomizer is Script {
    function run() external {
        // Start broadcasting transactions
        vm.startBroadcast();

        // Deploy the contract
        GoalRandomizer goalRandomizer = new GoalRandomizer();
        console.log("GoalRandomizer deployed at:", address(goalRandomizer));

        // Stop broadcasting
        vm.stopBroadcast();
    }
}