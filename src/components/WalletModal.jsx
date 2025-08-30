import React from 'react';
import { useConnect } from 'wagmi';

function WalletModal({ isOpen, onClose }) {
  const { connect, connectors } = useConnect();

  if (!isOpen) return null;

  const handleWalletClick = (connector) => {
    connect({ connector });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="page-title">Connect Wallet</h2>
        <ul className="wallet-list">
          {connectors.map((connector) => (
            <li key={connector.id}>
              <button
                className="evolve-btn"
                onClick={() => handleWalletClick(connector)}
              >
                {connector.name}
              </button>
            </li>
          ))}
        </ul>
        <button className="close-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default WalletModal;