// src/pages/Loyalty.jsx
import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import WalletModal from '../components/WalletModal';
import '../styles.css';

export default function Loyalty() {
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

  return (
    <div className="page-bg-loyalty min-h-screen">
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
            <h1 className="page-title">Loyalty System</h1>
            <p className="text-light-purple">
              <strong>Coming Soon - Grow with staking rewards</strong>
              <br /><br />
              The loyalty system is currently in development and will be launched 
              alongside our staking platform to reward long-term participants.
              <br /><br />
              Future features will include:
              <br />
              • Tier-based rewards (Silver, Gold, Platinum, Diamond)
              <br />
              • MYCEL burning for bonus multipliers
              <br />
              • Exclusive airdrops for loyal holders
              <br />
              • Special evolution paths for dedicated collectors
              <br /><br />
              Your commitment to the Mycelium Network will be recognized and rewarded!
              <br /><br />
              Follow our progress on Discord and Twitter for the latest updates.
            </p>
          </div>
        </div>

        <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}