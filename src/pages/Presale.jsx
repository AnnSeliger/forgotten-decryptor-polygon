import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useDisconnect } from 'wagmi';
import { CONTRACTS, ABI, CHAIN } from '../contracts/constants';
import { formatEther, parseEther } from 'viem';
import { useState } from 'react';
import WalletModal from '../components/WalletModal';

export default function Presale() {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [wethAmount, setWethAmount] = useState('');
  const [step, setStep] = useState('input');

  const isCorrectNetwork = chainId === CHAIN.id;

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      setIsModalOpen(true);
    }
  };

  // Read presale info
  const { data: presaleInfo, refetch: refetchPresale } = useReadContract({
    address: CONTRACTS.PRESALE,
    abi: ABI.PRESALE,
    functionName: 'getPresaleInfo',
    chainId: CHAIN.id,
  });

  // Read user WETH balance
  const { data: wethBalance } = useReadContract({
    address: CONTRACTS.WETH,
    abi: ABI.WETH,
    functionName: 'balanceOf',
    args: [address],
    chainId: CHAIN.id,
    enabled: isConnected && isCorrectNetwork,
  });

  const [active, price, sold, total, raised, remaining, minPurchase] = presaleInfo || [];

  // ФИКС: Правильный расчет получаемых MYCEL токенов
  const calculateMycelAmount = () => {
    if (!wethAmount || !price) return '0';
    try {
      const wethInWei = parseEther(wethAmount);
      const tokenAmount = wethInWei / price;
      return tokenAmount.toString();
    } catch (error) {
      return '0';
    }
  };

  const handleBuyTokens = async () => {
    if (!wethAmount || !active) return;
    
    // ФИКС: Проверка сети
    if (!isCorrectNetwork) {
      alert(`Please switch to ${CHAIN.name}`);
      return;
    }
    
    const amount = parseEther(wethAmount);
    
    if (wethBalance < amount) {
      alert(`Insufficient WETH balance. You have ${formatEther(wethBalance)} WETH`);
      return;
    }

    if (amount < (minPurchase || parseEther('0.001'))) {
      alert(`Minimum purchase is ${formatEther(minPurchase || parseEther('0.001'))} WETH`);
      return;
    }

    try {
      setStep('approve');
      
      // Approve WETH spending
      await writeContract({
        address: CONTRACTS.WETH,
        abi: ABI.WETH,
        functionName: 'approve',
        args: [CONTRACTS.PRESALE, amount],
      });

      setStep('buy');
      
      // Buy tokens
      await writeContract({
        address: CONTRACTS.PRESALE,
        abi: ABI.PRESALE,
        functionName: 'buyTokens',
        args: [amount],
      });

      setTimeout(() => {
        refetchPresale();
        setStep('input');
        setWethAmount('');
      }, 2000);

    } catch (error) {
      console.error('Purchase failed:', error);
      setStep('input');
    }
  };

  return (
    <div className="page-bg-presale min-h-screen">
      <div className="container">
        {/* Кнопка подключения кошелька */}
        <div className="wallet-section">
          <button
            className="connect-wallet-btn"
            onClick={handleConnect}
            onTouchStart={(e) => e.preventDefault()}
          >
            {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>
          {isConnected && !isCorrectNetwork && (
            <div className="network-warning">
              ⚠️ Please switch to {CHAIN.name}
            </div>
          )}
        </div>

        <h1 className="page-title">MYCEL Presale</h1>

        {!isConnected ? (
          <div className="text-overlay">
            <p className="text-light-purple">Connect your wallet to participate in the presale</p>
          </div>
        ) : !isCorrectNetwork ? (
          <div className="text-overlay">
            <p className="text-warning">Please switch to {CHAIN.name} to continue</p>
          </div>
        ) : presaleInfo ? (
          <div className="presale-container">
            {/* Presale Stats */}
            <div className="presale-stats">
              <div className="stat-item">
                <span>Status:</span>
                <strong>{active ? '🟢 LIVE' : '🔴 ENDED'}</strong>
              </div>
              <div className="stat-item">
                <span>Price:</span>
                <strong>1 MYCEL = {formatEther(price)} WETH</strong>
              </div>
              <div className="stat-item">
                <span>Progress:</span>
                <strong>{formatEther(sold)} / {formatEther(total)} MYCEL</strong>
              </div>
              <div className="stat-item">
                <span>Raised:</span>
                <strong>{formatEther(raised)} WETH</strong>
              </div>
              <div className="stat-item">
                <span>Your WETH:</span>
                <strong>{wethBalance ? formatEther(wethBalance) : '0'} WETH</strong>
              </div>
            </div>

            {/* Purchase Form */}
            <div className="presale-form">
              <div className="input-group">
                <input
                  type="number"
                  placeholder="WETH amount"
                  value={wethAmount}
                  onChange={(e) => setWethAmount(e.target.value)}
                  step="0.0001"
                  min={minPurchase ? formatEther(minPurchase) : '0.001'}
                />
                <div className="quick-buttons-container">
                  <button onClick={() => setWethAmount('0.001')} className="quick-btn">0.001</button>
                  <button onClick={() => setWethAmount('0.01')} className="quick-btn">0.01</button>
                  <button onClick={() => setWethAmount('0.1')} className="quick-btn">0.1</button>
                </div>
              </div>

              {wethAmount && (
                <div className="calculation">
                  <p>You will receive: <strong>{calculateMycelAmount()} MYCEL</strong></p>
                  <p className="small-text">
                    Rate: 1 MYCEL = {formatEther(price)} WETH
                  </p>
                </div>
              )}

              <button 
                onClick={handleBuyTokens}
                disabled={!wethAmount || !active || isConfirming || !isCorrectNetwork}
                className="action-btn buy-btn"
              >
                {isConfirming ? 'Processing...' : 
                 step === 'approve' ? 'Approving...' :
                 step === 'buy' ? 'Buying...' : 
                 'Buy MYCEL Tokens'}
              </button>

              {isConfirmed && (
                <div className="success-message">
                  ✅ Purchase successful! Check your MYCEL balance.
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="info-box">
              <h3 className="details-title">📋 Presale Details</h3>
              <ul className="colored-details">
                <li><strong>1,500,000 MYCEL</strong> total supply</li>
                <li><strong>0.000001 WETH</strong> per MYCEL</li>
                <li><strong>0.001 WETH</strong> minimum purchase</li>
                <li>Your WETH Balance: <strong>{wethBalance ? formatEther(wethBalance) : '0'} WETH</strong></li>
                <li><strong>70%</strong> of raised funds go to liquidity</li>
                <li><strong>30%</strong> to team and development</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-overlay">
            <p className="text-light-purple">Loading presale information...</p>
          </div>
        )}

        <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}