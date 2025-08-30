import React from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import ForgottenNFTAbi from "../abi/ForgottenNFT.json";

const CONTRACT_ADDRESS = "0xDA757C864bCca263fB7C64e8b76cAbEafb0647D4";

export default function Evolution() {
  const { address, isConnected } = useAccount();

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ForgottenNFTAbi,
    functionName: "evolve",
    args: [0, 2], // пример: tokenId = 0, newLevel = 2 (замени под логику)
  });

  const { write, isLoading, isSuccess, error } = useContractWrite(config);

  if (!isConnected) return <div>Please connect your wallet first.</div>;

  return (
    <div className="container">
      <h2>Evolution</h2>
      <button disabled={!write || isLoading} onClick={() => write?.()}>
        {isLoading ? "Evolving..." : "Evolve NFT"}
      </button>
      {isSuccess && <p>Evolution successful!</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </div>
  );
}