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
          onTouchStart={(e) => e.preventDefault()} // Поддержка touch для мобильных
        >
          {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>
        <div className="page-content">
          <div className="text-overlay">
            <h1 className="page-title">About the Project</h1>
            <p className="text-light-purple">
              <strong>The Garden of Forgotten Dreams</strong> is a mystical pixel-based NFT collection 
              created by digital surrealist <strong>AnnaSeliger</strong>. Entirely handcrafted and curated solo, 
              it represents a journey of transformation and symbolic evolution.
            </p>

            <h2 className="text-pink mt-4">🌱 Roadmap</h2>
            <ul className="list-disc list-inside text-light-purple ml-4">
              <li>🚀 Launch of 10,000 Level 1 NFTs</li>
              <li>🔓 Unlock Evolution Paths to Level 2 (A1, A2, B1, B2, C1, C2)</li>
              <li>🎨 Release of Final Evolution L3 Artworks</li>
              <li>📖 Expand the Forgotten World together with the community</li>
              <li>💎 Emergence and growth of new Inhabitants of the Garden of Forgotten Dreams</li>
              <li>💎 Introduction of new evolution stages and original artworks</li>
            </ul>

            <h2 className="text-pink mt-4">🌀 Evolution System</h2>
            <p className="text-light-purple">
              Unlike static NFT collections, <strong>The Garden of Forgotten Dreams</strong> is alive. 
              Each of the first 10,000 characters at Level 1 can evolve through unique, branching transformation paths. 
              These evolutions are triggered through smart contract interactions — your choices shape their destiny.
            </p>

            <h2 className="text-pink mt-4">✨ A Living Pixel Mythos</h2>
            <p className="text-light-purple">
              My NFTs are not just images — they are beings who inhabit the Garden of Forgotten Dreams. 
              Each one carries a soul, a past, and a future waiting to unfold. 
              With every evolution, the collection deepens in mystery and visual intensity, reflecting the surreal digital mythology behind its creation.
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