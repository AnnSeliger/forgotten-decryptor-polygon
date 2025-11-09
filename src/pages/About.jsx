import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import WalletModal from '../components/WalletModal';
import '../styles.css';

export default function About() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnect = () => {
    console.log('Connect button clicked on About', connectors);
    if (connectors && connectors.length > 0) {
      connect({ connector: connectors[0] });
    } else {
      console.error('No connectors available');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="page-bg-about min-h-screen">
      <div className="container">
        <button
          className="connect-wallet-btn"
          onClick={isConnected ? disconnect : openModal}
          onTouchStart={(e) => e.preventDefault()}
        >
          {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>
        <div className="page-content">
          <div className="text-overlay">
            <h1 className="page-title">The Mycelium Network</h1>
            <p className="text-light-purple">
              <strong>The Garden of Forgotten Dreams</strong> is a mystical pixel-based NFT collection 
              created by digital surrealist <strong>AnnaSeliger</strong>. Entirely handcrafted and curated solo, 
              it represents a journey of transformation and symbolic evolution, now intertwined with the 
              <strong> MYCEL token</strong> to create a sustainable, profitable ecosystem for our community.
            </p>

            <h2 className="text-pink mt-4">🌱 Roadmap & Tokenomics</h2>
            
            <h3 className="text-light-purple mt-3">🚀 Phase 1: Foundation (Completed)</h3>
            <ul className="list-disc list-inside text-light-purple ml-4">
              <li>Launch of 10,000 Level 1 NFTs</li>
              <li>MYCEL Token deployment with fixed supply of 10,000,000</li>
              <li>Smart contract audits and security implementation</li>
            </ul>

            <h3 className="text-light-purple mt-3">🔓 Phase 2: Growth & Liquidity (Current)</h3>
            <ul className="list-disc list-inside text-light-purple ml-4">
              <li><strong>Presale Event</strong> - Building initial liquidity</li>
              <li>50% of Level 1 NFT sales + 1% secondary royalties directed to liquidity pool</li>
              <li>Unlock Evolution Paths to Level 2 (A1, A2, B1, B2, C1, C2)</li>
              <li>MYCEL Airdrop: 150 MYCEL for Level 1-2 NFTs, 1000 MYCEL for Level 3</li>
            </ul>

            <h3 className="text-light-purple mt-3">🎨 Phase 3: Expansion</h3>
            <ul className="list-disc list-inside text-light-purple ml-4">
              <li>Release of Final Evolution L3 Artworks</li>
              <li>Staking System launch - earn daily MYCEL rewards</li>
              <li>Loyalty System implementation - burn MYCEL for multipliers</li>
              <li>Expand the Forgotten World with community governance</li>
            </ul>

            <h3 className="text-light-purple mt-3">💎 Phase 4: Ecosystem Maturity</h3>
            <ul className="list-disc list-inside text-light-purple ml-4">
              <li>Introduction of new evolution stages and original artworks</li>
              <li>Advanced breeding mechanics for new Garden inhabitants</li>
              <li>Cross-chain expansion and partner integrations</li>
              <li>Full DAO implementation for community-led development</li>
            </ul>

            <h2 className="text-pink mt-4">💰 Transparent Token Distribution</h2>
            <div className="text-light-purple">
              <p><strong>Total Supply: 10,000,000 MYCEL (Fixed - No Inflation)</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Treasury (40% - 4,000,000 MYCEL)</strong> - Presale & staking rewards</li>
                <li><strong>NFT Rewards (35% - 3,500,000 MYCEL)</strong> - Airdrop distribution</li>
                <li><strong>Marketing (10% - 1,000,000 MYCEL)</strong> - Growth and partnerships</li>
                <li><strong>Team (10% - 1,000,000 MYCEL)</strong> - <strong>2-year linear vesting</strong></li>
                <li><strong>Ecosystem (5% - 500,000 MYCEL)</strong> - Liquidity pool initialization</li>
              </ul>
            </div>

            <h2 className="text-pink mt-4">🛡️ Security & Transparency</h2>
            <p className="text-light-purple">
              Our commitment to transparency sets us apart. All contracts are verified and publicly auditable. 
              Team tokens are locked in a vesting contract for 2 years with linear unlocking. Liquidity pools 
              will be locked for minimum 1 year. Every transaction, from presale to airdrop, is trackable on-chain.
            </p>

            <h2 className="text-pink mt-4">🌿 The Mycelium Advantage</h2>
            <p className="text-light-purple">
              Like natural mycelium networks, our ecosystem creates interconnected value flows. NFT evolution 
              increases rarity and value, staking generates passive MYCEL rewards, and the loyalty system 
              creates sustainable tokenomics through strategic burning. This symbiotic relationship between 
              NFTs and MYCEL token creates a self-sustaining digital economy.
            </p>

            <h2 className="text-pink mt-4">🎯 Investment Highlights</h2>
            <ul className="list-disc list-inside text-light-purple ml-4">
              <li><strong>Proven Artist</strong> - AnnaSeliger's unique surreal pixel art style</li>
              <li><strong>Real Utility</strong> - MYCEL powers entire ecosystem evolution</li>
              <li><strong>Sustainable Economics</strong> - Burning mechanisms and fixed supply</li>
              <li><strong>Community Focused</strong> - Transparent operations and fair distribution</li>
              <li><strong>Growth Potential</strong> - Multiple revenue streams and expansion paths</li>
              <li><strong>Early Access</strong> - Join before major exchange listings</li>
            </ul>

            <h2 className="text-pink mt-4">🌀 Evolution System</h2>
            <p className="text-light-purple">
              Unlike static NFT collections, <strong>The Garden of Forgotten Dreams</strong> is alive. 
              Each of the first 10,000 characters at Level 1 can evolve through unique, branching transformation paths. 
              These evolutions are triggered through smart contract interactions — your choices shape their destiny 
              and increase their value in the ecosystem.
            </p>

            <h2 className="text-pink mt-4">🔥 Strategic Burning & Value Accrual</h2>
            <p className="text-light-purple">
              Our ecosystem features multiple burning mechanisms that benefit long-term holders. NFT burning 
              for evolution creates scarcity, while MYCEL burning in the loyalty system reduces supply and 
              increases value. This deflationary pressure combined with fixed supply creates ideal conditions 
              for value appreciation.
            </p>

            <h2 className="text-pink mt-4">✨ A Living Pixel Mythos</h2>
            <p className="text-light-purple">
              My NFTs are not just images — they are beings who inhabit the Garden of Forgotten Dreams. 
              Each one carries a soul, a past, and a future waiting to unfold. 
              With every evolution, the collection deepens in mystery and visual intensity, reflecting the surreal digital mythology behind its creation.
            </p>

            <h2 className="text-pink mt-4">🚀 Join Our Growing Mycelium Network</h2>
            <p className="text-light-purple">
              This is more than an NFT project - it's a digital ecosystem with real economic foundations. 
              By participating in our presale, you're not just buying NFTs; you're investing in a sustainable 
              economy with multiple revenue streams and growth mechanisms. The connection between NFTs, MYCEL token, 
              staking, and loyalty systems creates a brilliant opportunity for early adopters to benefit from 
              the organic growth of our mycelium network.
            </p>

            <h2 className="text-pink mt-4">🤝 Connect With Me</h2>
            <p className="text-light-purple">
              Join our Discord for updates, lore drops, and early access:<br />
              👉 <a 
                href="https://discord.com/channels/1392802406978420816/1392802408391905363" 
                target="_blank" 
                rel="noreferrer" 
                className="text-pink underline hover:text-teal-200 transition-colors"
              >
                Forgotten Dreams Discord
              </a>
              <br />
              👉 <a 
                href="https://x.com/boiko678070" 
                target="_blank" 
                rel="noreferrer" 
                className="text-pink underline hover:text-teal-200 transition-colors"
              >
                My Twitter
              </a>
            </p>
          </div>
        </div>
      </div>
      {isModalOpen && <WalletModal isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
}