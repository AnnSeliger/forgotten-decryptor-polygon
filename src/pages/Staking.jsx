// src/pages/Staking.jsx
import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import WalletModal from '../components/WalletModal';
import '../styles.css';

export default function Staking() {
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
    <div className="page-bg-staking min-h-screen">
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
            <h1 className="page-title">Staking</h1>
            <p className="text-light-purple">
              <strong>Coming Soon - Available after liquidity for mycelium growth</strong>
              <br /><br />
              The staking system is currently under development and will be launched 
              after the initial liquidity phase is completed.
              <br /><br />
              Once live, you'll be able to:
              <br />
              • Stake your ForgottenNFTs to earn daily MYCEL rewards
              <br />
              • Unlock exclusive loyalty bonuses and multipliers
              <br />
              • Participate in the sustainable MYCEL ecosystem
              <br /><br />
              Stay tuned for updates on our Discord and Twitter channels!
            </p>
          </div>
        </div>

        <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}