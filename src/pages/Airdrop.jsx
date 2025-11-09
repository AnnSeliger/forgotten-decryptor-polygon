// src/pages/Airdrop.jsx
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useDisconnect, usePublicClient } from 'wagmi';
import { CONTRACTS, ABI, CHAIN } from '../contracts/constants';
import { formatEther } from 'viem';
import { useState, useEffect } from 'react';
import WalletModal from '../components/WalletModal';

export default function Airdrop() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const publicClient = usePublicClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [claimableTokens, setClaimableTokens] = useState([]);
  const [rewards, setRewards] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('');
  const [expandedLevels, setExpandedLevels] = useState({});

  const getTokenLevel = (reward) => {
    const rewardValue = parseFloat(formatEther(reward));
    return rewardValue === 1000 ? 'Level 3' : 'Level 1-2';
  };

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      setIsModalOpen(true);
    }
  };

  const { data: tokensData, refetch: refetchTokens } = useReadContract({
    address: CONTRACTS.AIRDROP,
    abi: ABI.AIRDROP,
    functionName: 'getClaimableTokens',
    args: [address],
    chainId: CHAIN.id, // Добавить эту строку
    query: {
      enabled: isConnected && !!address,
    },
  });

  const loadRewards = async (tokens) => {
    if (!tokens || tokens.length === 0) return;

    setIsLoading(true);
    try {
      const rewardsMap = {};
      
      for (const tokenId of tokens) {
        try {
          const reward = await publicClient.readContract({
            address: CONTRACTS.AIRDROP,
            abi: ABI.AIRDROP,
            functionName: 'getRewardForToken',
            args: [tokenId],
          });
          rewardsMap[tokenId.toString()] = reward;
        } catch (error) {
          console.error(`Error loading reward for token ${tokenId}:`, error);
          rewardsMap[tokenId.toString()] = 0n;
        }
      }
      
      setRewards(rewardsMap);
    } catch (error) {
      console.error("Error loading rewards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tokensData) {
      setClaimableTokens(tokensData);
      loadRewards(tokensData);
    }
  }, [tokensData]);

  useEffect(() => {
    if (isConfirmed) {
      refetchTokens();
      setStep('');
    }
  }, [isConfirmed]);

  const groupedTokens = claimableTokens.reduce((acc, tokenId) => {
    const reward = rewards[tokenId.toString()] || 0n;
    const level = getTokenLevel(reward);
    
    if (!acc[level]) {
      acc[level] = {
        tokens: [],
        totalReward: 0n,
        count: 0
      };
    }
    
    acc[level].tokens.push(tokenId);
    acc[level].totalReward += reward;
    acc[level].count++;
    
    return acc;
  }, {});

  const totalReward = claimableTokens.reduce((sum, tokenId) => {
    return sum + (rewards[tokenId.toString()] || 0n);
  }, 0n);

  const claimSingleToken = async (tokenId) => {
    setStep(`claiming-${tokenId}`);
    try {
      writeContract({
        address: CONTRACTS.AIRDROP,
        abi: ABI.AIRDROP,
        functionName: 'claim',
        args: [tokenId],
      });
    } catch (error) {
      console.error('Claim failed:', error);
      setStep('');
    }
  };

  const claimLevelTokens = async (levelTokens) => {
    setStep(`claiming-level-${levelTokens.join('-')}`);
    try {
      writeContract({
        address: CONTRACTS.AIRDROP,
        abi: ABI.AIRDROP,
        functionName: 'claimMultiple',
        args: [levelTokens],
      });
    } catch (error) {
      console.error('Claim level failed:', error);
      setStep('');
    }
  };

  const claimAllTokens = async () => {
    setStep('claiming-all');
    try {
      writeContract({
        address: CONTRACTS.AIRDROP,
        abi: ABI.AIRDROP,
        functionName: 'claimMultiple',
        args: [claimableTokens],
      });
    } catch (error) {
      console.error('Claim all failed:', error);
      setStep('');
    }
  };

  const toggleLevelExpansion = (level) => {
    setExpandedLevels(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  return (
    <div className="page-bg-airdrop min-h-screen">
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

        <h1 className="page-title">🍄 MYCEL Airdrop</h1>

        {!isConnected ? (
          <div className="text-overlay">
            <p className="text-light-purple">Connect your wallet to check your airdrop eligibility</p>
          </div>
        ) : isLoading ? (
          <div className="text-overlay">
            <p className="text-light-purple">Loading your NFT collection...</p>
          </div>
        ) : claimableTokens.length === 0 ? (
          <div className="text-overlay">
            <p className="text-light-purple">No NFTs eligible for airdrop found in your wallet</p>
          </div>
        ) : (
          <div className="airdrop-container">
            {/* Airdrop Summary */}
            <div className="airdrop-section">
              <div className="airdrop-summary-header">
                <div className="airdrop-summary-content">
                  <h2>Airdrop Summary</h2>
                  <div className="summary-grid">
                    <div className="stat-item">
                      <span>Total Eligible NFTs:</span>
                      <strong>{claimableTokens.length}</strong>
                    </div>
                    {Object.entries(groupedTokens).map(([level, data]) => (
                      <div key={level} className="stat-item">
                        <span>{level} NFTs:</span>
                        <strong>{data.count} × {formatEther(data.totalReward / BigInt(data.count))} MYCEL</strong>
                      </div>
                    ))}
                    <div className="stat-item summary-total">
                      <span>Total Reward:</span>
                      <strong>{formatEther(totalReward)} MYCEL</strong>
                    </div>
                  </div>
                  
                  <button 
                    onClick={claimAllTokens}
                    disabled={isConfirming || step === 'claiming-all'}
                    className="action-btn buy-btn"
                  >
                    {isConfirming && step === 'claiming-all' ? 'Claiming...' : 
                     `Claim All ${formatEther(totalReward)} MYCEL`}
                  </button>
                </div>
              </div>
            </div>

            {/* NFTs List Grouped by Level */}
            <div className="airdrop-section">
              <h3>Your Eligible NFTs</h3>
              
              {Object.entries(groupedTokens).map(([level, levelData]) => {
                const isExpanded = expandedLevels[level];
                const isClaimingLevel = step === `claiming-level-${levelData.tokens.join('-')}`;
                
                return (
                  <div key={level} className="level-group">
                    <div className="level-header">
                      <div className="level-info">
                        <h4 className="level-title">{level}</h4>
                        <span className="level-stats">
                          {levelData.count} NFT{levelData.count !== 1 ? 's' : ''} • {formatEther(levelData.totalReward)} MYCEL
                        </span>
                      </div>
                      
                      <div className="level-actions">
                        <button
                          onClick={() => claimLevelTokens(levelData.tokens)}
                          disabled={isConfirming || isClaimingLevel}
                          className="quick-btn"
                        >
                          {isClaimingLevel ? 'Claiming...' : `Claim ${formatEther(levelData.totalReward)} MYCEL`}
                        </button>
                        
                        <button
                          onClick={() => toggleLevelExpansion(level)}
                          className="expand-btn"
                        >
                          {isExpanded ? '▲ Hide' : '▼ Show'} NFTs
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="nfts-grid-expanded">
                        {levelData.tokens.map((tokenId) => {
                          const reward = rewards[tokenId.toString()] || 0n;
                          const isClaiming = step === `claiming-${tokenId}`;
                          
                          return (
                            <div key={tokenId.toString()} className="nft-card-expanded">
                              <div className="nft-info">
                                <div className="nft-id">NFT #{tokenId.toString()}</div>
                                <div className="nft-reward">{formatEther(reward)} MYCEL</div>
                              </div>
                              <button
                                onClick={() => claimSingleToken(tokenId)}
                                disabled={isConfirming || isClaiming}
                                className="quick-btn"
                              >
                                {isClaiming ? 'Claiming...' : 'Claim'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Info Box */}
            <div className="airdrop-section">
              <h3>📋 Airdrop Details</h3>
              <ul>
                <li><strong>3,500,000 MYCEL</strong> allocated for airdrop rewards</li>
                <li><strong>150 MYCEL</strong> for Level 1 & 2 NFTs</li>
                <li><strong>1000 MYCEL</strong> for Level 3 NFTs</li>
                <li>Only NFTs with ID 1-20,500 are eligible</li>
                <li>You must be the current owner of the NFT</li>
                <li>Each NFT can only be claimed once</li>
              </ul>
            </div>

            {isConfirmed && (
              <div className="success-message">
                ✅ Airdrop claimed successfully! Check your MYCEL balance.
              </div>
            )}
          </div>
        )}

        <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}