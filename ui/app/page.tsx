"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import GoalRandomizerABI from "../abis/GoalRandomizer.json";

export default function Home() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [goalNumber, setGoalNumber] = useState<string>("0");
  const [account, setAccount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const CONTRACT_ADDRESS = "0x222CD7612c12762f840cb4E74013ac5F757813D6"; // Replace with the new address

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        GoalRandomizerABI,
        signer
      );

      console.log("Contract:", contract);
      console.log("Network:", await provider.getNetwork());

      setProvider(provider);
      setSigner(signer);
      setContract(contract);

      const accounts = await signer.getAddress();
      setAccount(accounts);

      await fetchGoalNumber(contract);
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      setError("Failed to connect: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoalNumber = async (contractInstance?: ethers.Contract) => {
    try {
      const currentContract = contractInstance || contract;
      if (!currentContract) throw new Error("Contract not initialized");
      const number = await currentContract.getGoalNumber();
      console.log("Raw getGoalNumber result:", number);
      setGoalNumber(number.toString());
    } catch (error: any) {
      console.error("Failed to fetch goal number:", error);
      setError("Failed to fetch goal number: " + error.message);
    }
  };

  const handleRandomize = async () => {
    if (!contract) return;

    try {
      setLoading(true);
      setError("");
      const tx = await contract.randomizeGoalNumber();
      await tx.wait();
      await fetchGoalNumber();
    } catch (error: any) {
      console.error("Failed to randomize:", error);
      setError("Randomization failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchGoalNumber();
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Goal Randomizer
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        {!account ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-lg font-medium text-gray-700">
                  Goal Number
                </p>
                <p className="text-4xl font-bold text-blue-600">{goalNumber}</p>
              </div>
            </div>

            <button
              onClick={handleRandomize}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition disabled:bg-green-400"
            >
              {loading ? "Randomizing..." : "Randomize"}
            </button>

            <button
              onClick={() => fetchGoalNumber()}
              disabled={loading}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition disabled:bg-gray-400"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}