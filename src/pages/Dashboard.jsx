// src/pages/Dashboard.jsx
import { useAccount, useReadContract, useDisconnect } from 'wagmi';
import { CONTRACTS, ABI, CHAIN } from '../contracts/constants';
import { formatEther } from 'viem';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import WalletModal from '../components/WalletModal';

// Кастомные SVG иконки - в стиле проекта
const MycelIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M21 8C21 8 25 6 29 10C33 14 31 18 31 18C31 18 33 22 29 26C25 30 21 28 21 28C21 28 17 30 13 26C9 22 11 18 11 18C11 18 9 14 13 10C17 6 21 8 21 8Z" fill="url(#mycelGradient)"/>
    <path d="M18 18C18 16 19 14 21 14C23 14 24 16 24 18C24 20 23 22 21 22C19 22 18 20 18 18Z" fill="#ff8eb4"/>
    <defs>
      <linearGradient id="mycelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6fff" />
        <stop offset="100%" stopColor="#ff99ff" />
      </linearGradient>
    </defs>
  </svg>
);

const NftIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M21 4L31 9V21L21 26L11 21V9L21 4Z" fill="url(#nftGradient)" stroke="#ff6fff" strokeWidth="2"/>
    <rect x="16" y="14" width="10" height="2" fill="#ff99ff" rx="1"/>
    <rect x="16" y="18" width="7" height="2" fill="#ff99ff" rx="1"/>
    <rect x="16" y="22" width="9" height="2" fill="#ff99ff" rx="1"/>
    <defs>
      <linearGradient id="nftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6fff" />
        <stop offset="100%" stopColor="#ff99ff" />
      </linearGradient>
    </defs>
  </svg>
);

const StakeIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <rect x="14" y="19" width="14" height="12" rx="2" fill="url(#stakeGradient)" stroke="#ff6fff" strokeWidth="2"/>
    <path d="M17 19V16C17 14.343 18.343 13 20 13C21.657 13 23 14.343 23 16V19" stroke="#ff6fff" strokeWidth="2"/>
    <defs>
      <linearGradient id="stakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6fff" />
        <stop offset="100%" stopColor="#ff99ff" />
      </linearGradient>
    </defs>
  </svg>
);

const RewardIcon = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M21 7L25 16L35 16L27 22L31 31L21 25L11 31L15 22L7 16L17 16L21 7Z" fill="url(#rewardGradient)" stroke="#ff6fff" strokeWidth="2"/>
    <defs>
      <linearGradient id="rewardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6fff" />
        <stop offset="100%" stopColor="#ff99ff" />
      </linearGradient>
    </defs>
  </svg>
);

const EvolveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 6V10" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 22V26" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 16H10" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 16H26" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 8L12 12" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 8L20 12" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 24L12 20" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 24L20 20" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const StakingIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="10" stroke="#ff6fff" strokeWidth="2"/>
    <path d="M16 10V16L18 18" stroke="#ff99ff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LoyaltyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L20 12L28 12L22 18L26 26L16 20L6 26L10 18L4 12L12 12L16 4Z" fill="url(#loyaltyGradient)" stroke="#ff6fff" strokeWidth="2"/>
    <defs>
      <linearGradient id="loyaltyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6fff" />
        <stop offset="100%" stopColor="#ff99ff" />
      </linearGradient>
    </defs>
  </svg>
);

const AirdropIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="8" stroke="#ff6fff" strokeWidth="2"/>
    <circle cx="16" cy="16" r="4" stroke="#ff99ff" strokeWidth="1.5"/>
    <circle cx="16" cy="16" r="1" fill="#ff6fff"/>
    <path d="M16 8V10" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 22V24" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 16H10" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 16H24" stroke="#ff6fff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      setIsModalOpen(true);
    }
  };

  const { data: mycelBalance } = useReadContract({
    address: CONTRACTS.MYCEL,
    abi: ABI.MYCEL,
    functionName: 'balanceOf',
    args: [address],
    chainId: CHAIN.id,
    enabled: isConnected
  });

  const { data: nftBalance } = useReadContract({
    address: CONTRACTS.NFT,
    abi: ABI.NFT,
    functionName: 'balanceOf',
    args: [address],
    chainId: CHAIN.id,
    enabled: isConnected
  });

  const { data: stakedData } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: ABI.STAKING,
    functionName: 'getStakes',
    args: [address],
    chainId: CHAIN.id,
    enabled: isConnected
  });

  const { data: pendingReward } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: ABI.STAKING,
    functionName: 'pendingReward',
    args: [address],
    chainId: CHAIN.id,
    enabled: isConnected
  });

  const { data: hasClaimedAirdrop } = useReadContract({
    address: CONTRACTS.AIRDROPP,
    abi: ABI.AIRDROPP,
    functionName: 'hasClaimed',
    args: [address],
    chainId: CHAIN.id,
    enabled: isConnected
  });

  const mycel = mycelBalance ? formatEther(mycelBalance) : '0';
  const nfts = nftBalance?.toString() || '0';
  const staked = stakedData?.[0]?.length || 0;
  const rewards = pendingReward ? formatEther(pendingReward) : '0';
  const airdropStatus = hasClaimedAirdrop ? 'Claimed' : 'Available';

  if (!isConnected) {
    return (
      <div className="page-bg-dashboard min-h-screen">
        <div className="container">
          <div className="wallet-section">
            <button
              className="connect-wallet-btn"
              onClick={handleConnect}
              onTouchStart={(e) => e.preventDefault()}
            >
              Connect Wallet
            </button>
          </div>
          
          <h1 className="page-title">Dashboard</h1>
          <div className="text-overlay">
            <p className="text-light-purple">Connect your wallet to view your portfolio</p>
          </div>
          
          <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg-dashboard min-h-screen">
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

        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your contribution to the mycelium network</p>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <MycelIcon />
            </div>
            <h3>MYCEL Balance</h3>
            <p className="stat-value">{mycel}</p>
            <p className="stat-label">Your digital mycelium</p>
            <Link to="/airdrop" className="stat-btn">
              {airdropStatus === 'Available' ? 'Claim Airdrop' : 'Airdrop Claimed'}
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <NftIcon />
            </div>
            <h3>NFTs Owned</h3>
            <p className="stat-value">{nfts}</p>
            <p className="stat-label">Garden of Forgotten Dreams</p>
            <Link to="/evolve" className="stat-btn">Evolve</Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <StakeIcon />
            </div>
            <h3>Staked NFTs</h3>
            <p className="stat-value">{staked}</p>
            <p className="stat-label coming-soon">Coming Soon - Available after liquidity for mycelium growth</p>
            <div className="stat-btn disabled">Manage</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <RewardIcon />
            </div>
            <h3>Pending Rewards</h3>
            <p className="stat-value">{rewards} MYCEL</p>
            <p className="stat-label coming-soon">Coming Soon - Grow with staking rewards</p>
            <div className="stat-btn disabled">Claim</div>
          </div>
        </div>

        <div className="action-grid">
          <Link to="/evolve" className="action-card">
            <span className="action-icon">
              <EvolveIcon />
            </span>
            <span>Evolve NFTs</span>
            <small>Upgrade your collection</small>
          </Link>
          <Link to="/staking" className="action-card">
            <span className="action-icon">
              <StakingIcon />
            </span>
            <span>Staking</span>
            <small>Coming Soon</small>
          </Link>
          <Link to="/loyalty" className="action-card">
            <span className="action-icon">
              <LoyaltyIcon />
            </span>
            <span>Loyalty</span>
            <small>Coming Soon</small>
          </Link>
          <Link to="/airdrop" className="action-card">
            <span className="action-icon">
              <AirdropIcon />
            </span>
            <span>Airdrop</span>
            <small>Claim your MYCEL</small>
          </Link>
        </div>

        <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}