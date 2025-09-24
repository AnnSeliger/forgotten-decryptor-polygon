import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import WalletModal from '../components/WalletModal';
import { Link } from 'react-router-dom';
import '../styles.css';

export default function Home() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      setIsModalOpen(true);
    }
  };

  const LEVEL_2_FORMS = {
    A1: [
      { name: "A1_01_Pale_Bloom", rarity: "Common", chance: "35%" },
      { name: "A1_02_Ember_Gaze", rarity: "Uncommon", chance: "30%" },
      { name: "A1_03_Whispering_Ash", rarity: "Rare", chance: "20%" },
      { name: "A1_04_Blazing_Caller", rarity: "Epic", chance: "10%" },
      { name: "A1_05_Crimson_Sleep", rarity: "Legendary", chance: "5%" },
    ],
    A2: [
      { name: "A2_01_Aurora_Whisper", rarity: "Common", chance: "35%" },
      { name: "A2_02_Frozen_Shell", rarity: "Uncommon", chance: "30%" },
      { name: "A2_03_Halo_of_Stillness", rarity: "Rare", chance: "20%" },
      { name: "A2_04_Crown_of_Snow", rarity: "Epic", chance: "10%" },
      { name: "A2_05_Mirror_Veil", rarity: "Legendary", chance: "5%" },
    ],
    B1: [
      { name: "B1_01_Hollow_Gaze", rarity: "Common", chance: "35%" },
      { name: "B1_02_Obsidian_Bloom", rarity: "Uncommon", chance: "30%" },
      { name: "B1_03_Silent_Maw", rarity: "Rare", chance: "20%" },
      { name: "B1_04_Phantom_Core", rarity: "Epic", chance: "10%" },
      { name: "B1_05_Echo_Blind", rarity: "Legendary", chance: "5%" },
    ],
    B2: [
      { name: "B2_01_Wings_of_Silence", rarity: "Common", chance: "35%" },
      { name: "B2_02_Luminous_Shade", rarity: "Uncommon", chance: "30%" },
      { name: "B2_03_Solar_Feather", rarity: "Rare", chance: "20%" },
      { name: "B2_04_Radiant_Tail", rarity: "Epic", chance: "10%" },
      { name: "B2_05_Dawnfire", rarity: "Legendary", chance: "5%" },
    ],
    C1: [
      { name: "C1_01_Echo_Crown", rarity: "Common", chance: "35%" },
      { name: "C1_02_Barked_Memory", rarity: "Uncommon", chance: "30%" },
      { name: "C1_03_Spinal_Grove", rarity: "Rare", chance: "20%" },
      { name: "C1_04_Thorned_Whisper", rarity: "Epic", chance: "10%" },
      { name: "C1_05_Verdigris_Skull", rarity: "Legendary", chance: "5%" },
    ],
    C2: [
      { name: "C2_01_Bloom_of_Silence", rarity: "Common", chance: "35%" },
      { name: "C2_02_Verdant_Echo", rarity: "Uncommon", chance: "30%" },
      { name: "C2_03_Soul_Spore", rarity: "Rare", chance: "20%" },
      { name: "C2_04_Glimmer_Root", rarity: "Epic", chance: "10%" },
      { name: "C2_05_Golden_Vein", rarity: "Legendary", chance: "5%" },
    ],
  };

  return (
    <div className="page-bg-home min-h-screen">
      <div className="container">
        <div className="wallet-section">
          <button
            className="connect-wallet-btn"
            onClick={handleConnect}
            onTouchStart={(e) => e.preventDefault()}
          >
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>
        </div>

        <div className="page-content">
          <div className="text-overlay">
            <h1 className="page-title">Welcome to Forgotten NFT Portal</h1>
            <p className="text-light-purple">
              Discover a mystical world of evolving pixel beings. Connect your wallet to explore the ForgottenNFT (FGT) collection.
              <br /><br />
              Each NFT starts at Level 1. Evolve them to Level 2 on the{" "}
              <Link to="/evolve" className="text-link">Evolve</Link> page.  
              There are six evolution branches, each with five unique forms.  
              Collect five Level 2 NFTs from the same branch to unlock a rare Level 3 resident with exclusive powers and artwork.
              <br /><br />
              Trade or gift Level 2 NFTs on OpenSea to complete your branch collection  
              and shape your destiny in the Garden of Forgotten Dreams.
            <br /><br />
              <a href="https://opensea.io/collection/forgottennft-458784060" target="_blank" rel="noopener noreferrer" className="text-link">
                View Collection on OpenSea
              </a>
              <br />
              <a href="https://polygonscan.com/address/0xD37d3E6cF2eA362E6fb41C96480859c544A3A598" target="_blank" rel="noopener noreferrer" className="text-link">
                View Contract on PolygonScan
              </a>
              <br /><br />
              <div className="as-seen-on">
                <span className="as-seen-text">as seen on</span>
                <a href="https://nftcalendar.io/" target="_blank" rel="noopener noreferrer">
                  <img src="/forgotten-decryptor-polygon/nft-logo.svg" alt="NFT Calendar" className="as-seen-logo" />
                </a>
              </div>
            </p>
          </div>
        </div>

        <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* ====== Branches ====== */}
        <div className="branches-container">
          <h2 className="branches-title">Evolution Branches & Level 2 Forms</h2>
          <div className="branches-grid">
            {Object.entries(LEVEL_2_FORMS).map(([branch, forms]) => (
              <div key={branch} className={`branch-card branch-${branch}`}>
                <h3 className="branch-title">Branch {branch}</h3>
                <ul className="forms-list">
                  {forms.map((form, idx) => (
                    <li key={idx} className="form-row">
                      <span className="form-name">{form.name}</span>
                      <span className={`rarity-badge rarity-${form.rarity}`}>
                        {form.rarity} {form.chance}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}