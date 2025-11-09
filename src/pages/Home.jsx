import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import WalletModal from '../components/WalletModal';
import { Link } from 'react-router-dom';
import '../styles.css';
import { MYCEL_TOKEN_ADDRESS } from '../contracts/constants'; // Импортируем адрес токена

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
            <h1 className="page-title">Welcome to Mycelium Network</h1>
            <p className="text-light-purple">
              <strong>Where Art Meets Sustainable Economics</strong>
              <br /><br />
              Discover the revolutionary ecosystem where <strong>ForgottenNFT collection</strong> merges with 
              the <strong className="text-pink">MYCEL token</strong> to create unprecedented value for early adopters.
            </p>

            {/* Key Investment Highlights */}
            <div className="investment-highlights">
              <h2 className="highlight-title">🚀 Why Mycelium Stands Out</h2>
              
              <div className="highlight-grid">
                <div className="highlight-card">
                  <div className="highlight-icon">💰</div>
                  <h3>Fixed Supply Economy</h3>
                  <p>Only <strong>10,000,000 MYCEL</strong> will ever exist</p>
                  <p className="highlight-sub">Zero inflation • Deflationary mechanics</p>
                </div>

                <div className="highlight-card">
                  <div className="highlight-icon">🛡️</div>
                  <h3>Transparent & Secure</h3>
                  <p><strong>2-year team vesting</strong> • Liquidity locked</p>
                  <p className="highlight-sub">Verified contracts • Full transparency</p>
                </div>

                <div className="highlight-card">
                  <div className="highlight-icon">🌿</div>
                  <h3>Dual Revenue Streams</h3>
                  <p>Earn from <strong>NFT evolution</strong> + <strong>MYCEL rewards</strong></p>
                  <p className="highlight-sub">Airdrops • Staking • Royalties</p>
                </div>

                <div className="highlight-card">
                  <div className="highlight-icon">📈</div>
                  <h3>Proven Value Growth</h3>
                  <p><strong>50%</strong> of sales + <strong>1%</strong> royalties feed liquidity</p>
                  <p className="highlight-sub">Sustainable tokenomics</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-number">10M</span>
                <span className="stat-label">Total MYCEL Supply</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">3.5M</span>
                <span className="stat-label">Airdrop Allocation</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2YR</span>
                <span className="stat-label">Team Vesting</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">6</span>
                <span className="stat-label">Evolution Paths</span>
              </div>
            </div>

            <p className="text-light-purple">
              <strong>Immediate Opportunities:</strong>
              <br />
              • <strong>Airdrop:</strong> 150 MYCEL for Level 1-2 NFTs, 1000 MYCEL for Level 3
              <br />
              • <strong>Presale:</strong> Early access to MYCEL tokens
              <br />
              • <strong>Evolution:</strong> Increase NFT value through transformation
              <br /><br />
              Each NFT starts at Level 1 and evolves through six unique branches, each with five forms. 
              Collect five Level 2 NFTs from the same branch to unlock exclusive Level 3 residents with 
              enhanced value and utility.
              <br /><br />
              <Link to="/about" className="cta-button">
                Explore Detailed Tokenomics
              </Link>
              <br /><br />
              <a href="https://opensea.io/collection/forgottennft-458784060" target="_blank" rel="noopener noreferrer" className="text-link">
                View Collection on OpenSea
              </a>
              <br />
              <a href="https://polygonscan.com/address/0xD37d3E6cF2eA362E6fb41C96480859c544A3A598" target="_blank" rel="noopener noreferrer" className="text-link">
                View NFT Contract on PolygonScan
              </a>
              <br />
              <a href={`https://polygonscan.com/address/${MYCEL_TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-link">
                View MYCEL Token Contract on PolygonScan
              </a>
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