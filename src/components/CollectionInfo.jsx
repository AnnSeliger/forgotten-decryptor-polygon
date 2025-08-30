import React from "react";

export default function CollectionInfo({ onNext }) {
  return (
    <div className="container">
      <h2>Forgotten NFT Collection</h2>
      <p>This is a special collection that evolves your NFTs on Sepolia and Mainnet.</p>
      <button onClick={onNext}>Next: Evolution</button>
    </div>
  );
}