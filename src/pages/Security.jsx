import React, { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import WalletModal from '../components/WalletModal';
import '../styles.css';

export default function Security() {
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

  const SECURITY_DATA = {
    contracts: {
      nft: {
        address: "0xD37d3E6cF2eA362E6fb41C96480859c544A3A598",
        name: "ForgottenNFT Collection",
        verified: true,
        link: "https://polygonscan.com/address/0xD37d3E6cF2eA362E6fb41C96480859c544A3A598"
      },
      token: {
        address: "0xA87962bC5D6c9a4FeE9772839a89f877Bdd444dB",
        name: "MYCEL Token",
        verified: true,
        link: "https://polygonscan.com/address/0xA87962bC5D6c9a4FeE9772839a89f877Bdd444dB"
      },
      presale: {
        address: "0x878f8a3cD6cBFdB107040A2c0D7B0e2804A7103c",
        name: "Presale Contract",
        verified: true,
        link: "https://polygonscan.com/address/0x878f8a3cD6cBFdB107040A2c0D7B0e2804A7103c"
      },
      airdrop: {
        address: "0xF02A7e1fb45BF195842fF27c17F1624afA267B8f",
        name: "Airdrop Contract",
        verified: true,
        link: "https://polygonscan.com/address/0xF02A7e1fb45BF195842fF27c17F1624afA267B8f"
      }
    },
    wallets: {
      treasury: {
        address: "0x08A1BbCaB9F97a04F40cdA059e9742647442F552",
        balance: "2,500,000 MYCEL",
        purpose: "Treasury & Presale"
      },
      nftRewards: {
        address: "0x6ac5997C48b485acEDD118405feFF6504112e262",
        balance: "3,500,000 MYCEL",
        purpose: "NFT Rewards Distribution"
      },
      marketing: {
        address: "0x7BE22cf01090906d8499Cc5D9e2b00F3300B0A65",
        balance: "1,000,000 MYCEL",
        purpose: "Marketing & Growth"
      },
      team: {
        address: "0xb13AF0CE4E1CBFa165bF44c29f8e7579a0F5757F",
        balance: "1,000,000 MYCEL",
        purpose: "Team (2-year vesting)"
      },
      ecosystem: {
        address: "0xA495dDd25798be1C476280e262eB9F2E6afB5866",
        balance: "500,000 MYCEL",
        purpose: "Ecosystem & Liquidity"
      }
    }
  };

  return (
    <div className="page-bg-about min-h-screen">
      <div className="container">
        <button
          className="connect-wallet-btn"
          onClick={handleConnect}
          onTouchStart={(e) => e.preventDefault()}
        >
          {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>
        
        <div className="page-content">
          <div className="text-overlay">
            <h1 className="page-title">🔒 Security & Transparency</h1>
            <p className="text-light-purple">
              <strong>Complete Transparency - Zero Trust Required</strong>
              <br /><br />
              We believe in radical transparency. Every contract, every transaction, every token distribution 
              is publicly verifiable on-chain. Don't trust - verify everything yourself.
            </p>

            {/* Verified Contracts */}
            <h2 className="text-pink mt-6">📝 Verified Smart Contracts</h2>
            <p className="text-light-purple">
              All our smart contracts are verified on PolygonScan and built with battle-tested OpenZeppelin libraries.
            </p>

            <div className="branches-grid mt-4">
              {Object.entries(SECURITY_DATA.contracts).map(([key, contract]) => (
                <div key={key} className="branch-card">
                  <h3 className="branch-title">{contract.name}</h3>
                  <div className="text-left">
                    <p className="text-light-purple text-sm mb-2">
                      <strong>Address:</strong><br />
                      <a 
                        href={contract.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-pink break-all hover:text-teal-200"
                      >
                        {contract.address}
                      </a>
                    </p>
                    <p className="text-light-purple text-sm">
                      <span className={`inline-block px-2 py-1 rounded ${
                        contract.verified ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {contract.verified ? '✅ Verified' : '❌ Not Verified'}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Token Distribution */}
            <h2 className="text-pink mt-8">💰 Transparent Token Distribution</h2>
            <p className="text-light-purple">
              <strong>Total Supply: 10,000,000 MYCEL (Fixed - Zero Inflation)</strong>
            </p>

            <div className="branches-grid mt-4">
              {Object.entries(SECURITY_DATA.wallets).map(([key, wallet]) => (
                <div key={key} className="branch-card">
                  <h3 className="branch-title">{wallet.purpose}</h3>
                  <div className="text-left">
                    <p className="text-light-purple text-sm mb-2">
                      <strong>Balance:</strong><br />
                      <span className="text-pink">{wallet.balance}</span>
                    </p>
                    <p className="text-light-purple text-sm">
                      <strong>Address:</strong><br />
                      <a 
                        href={`https://polygonscan.com/address/${wallet.address}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-pink break-all hover:text-teal-200 text-xs"
                      >
                        {wallet.address}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Measures */}
            <h2 className="text-pink mt-8">🛡️ Security-First Architecture</h2>
            
            <div className="branches-grid mt-4">
              <div className="branch-card">
                <h3 className="branch-title">🔍 Code Transparency</h3>
                <p className="text-light-purple text-sm">
                  • All contracts verified on PolygonScan<br />
                  • Source code publicly available<br />
                  • OpenZeppelin libraries used<br />
                  • Anyone can audit contract logic
                </p>
              </div>

              <div className="branch-card">
                <h3 className="branch-title">💰 Token Safety</h3>
                <p className="text-light-purple text-sm">
                  • Fixed supply: 10,000,000 MYCEL<br />
                  • No mint function after deployment<br />
                  • Team tokens: 2-year linear vesting<br />
                  • Liquidity will be locked
                </p>
              </div>

              <div className="branch-card">
                <h3 className="branch-title">👥 Team Accountability</h3>
                <p className="text-light-purple text-sm">
                  • Team allocation: 1,000,000 MYCEL<br />
                  • Vesting: 2 years linear unlock<br />
                  • Vesting contract: {SECURITY_DATA.wallets.team.address}<br />
                  • Public team commitment
                </p>
              </div>

              <div className="branch-card">
                <h3 className="branch-title">🚫 Anti-Rug Protection</h3>
                <p className="text-light-purple text-sm">
                  • Liquidity will be time-locked<br />
                  • No contract ownership changes<br />
                  • All transactions are public<br />
                  • Community-controlled distributions
                </p>
              </div>
            </div>

            {/* Technical Specifications */}
            <h2 className="text-pink mt-8">🔧 Technical Specifications</h2>
            
            <div className="text-light-purple mt-4">
              <h3 className="text-pink text-lg mb-2">NFT Contract Features:</h3>
              <ul className="list-disc list-inside ml-4 text-sm">
                <li>Standard: ERC-721</li>
                <li>Max supply: 20,500 NFTs</li>
                <li>Multi-level system (Level 1-3)</li>
                <li>Evolution mechanics</li>
                <li>Secondary royalties: 1%</li>
              </ul>

              <h3 className="text-pink text-lg mt-4 mb-2">Token Contract Features:</h3>
              <ul className="list-disc list-inside ml-4 text-sm">
                <li>Standard: ERC-20</li>
                <li>Symbol: MYCEL</li>
                <li>Decimals: 18</li>
                <li>Total supply: 10,000,000</li>
                <li>Burnable functionality</li>
                <li>Ownable with transfer capability</li>
              </ul>

              <h3 className="text-pink text-lg mt-4 mb-2">Presale Contract:</h3>
              <ul className="list-disc list-inside ml-4 text-sm">
                <li>Price: 1 WETH = 1,000,000 MYCEL</li>
                <li>Total for presale: 1,500,000 MYCEL</li>
                <li>Minimum purchase: 0.001 WETH</li>
                <li>70% of sales to liquidity</li>
                <li>30% of sales to team for development</li>
              </ul>
            </div>

            {/* Our Commitment */}
            <h2 className="text-pink mt-8">🤝 Our Commitment to You</h2>
            <p className="text-light-purple">
              We're building this project with complete transparency and long-term vision. 
              Every transaction, every contract deployment, every token transfer is permanently 
              recorded on the blockchain for your verification. We're committed to building 
              a sustainable ecosystem with our community.
            </p>

            {/* Security Contacts */}
            <h2 className="text-pink mt-8">📞 Security & Support</h2>
            <p className="text-light-purple">
              Found a vulnerability? Have security questions?<br />
              Contact us directly:<br /><br />
              
              <strong>Discord:</strong>{' '}
              <a 
                href="https://discord.com/channels/1392802406978420816/1392802408391905363"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink underline hover:text-teal-200"
              >
                Join Our Discord
              </a>
              <br />
              
              <strong>Twitter:</strong>{' '}
              <a 
                href="https://x.com/boiko678070"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink underline hover:text-teal-200"
              >
                @boiko678070
              </a>
              <br /><br />
              
              <strong>Bug Bounty:</strong> We offer rewards for critical vulnerabilities found in our smart contracts!
            </p>

            {/* Trust Verification Call-to-Action */}
            <div className="mt-8 p-4 border-2 border-green-500 rounded-lg bg-green-500 bg-opacity-10">
              <h3 className="text-green-400 text-lg mb-2">✅ Don't Trust - Verify Everything</h3>
              <p className="text-light-purple text-sm">
                We encourage you to verify every claim on this page. All contracts are verified, 
                all transactions are public, all token distributions are transparent. 
                This is real Web3 transparency - no shortcuts, no hidden agendas.
              </p>
            </div>

            {/* Quick Links for Verification */}
            <div className="mt-6 text-center">
              <p className="text-light-purple text-sm">
                <strong>Quick Verification Links:</strong><br />
                <a href="https://polygonscan.com/address/0xD37d3E6cF2eA362E6fb41C96480859c544A3A598" 
                   className="text-pink hover:text-teal-200 mx-2">NFT Contract</a> • 
                <a href="https://polygonscan.com/address/0xA87962bC5D6c9a4FeE9772839a89f877Bdd444dB" 
                   className="text-pink hover:text-teal-200 mx-2">Token Contract</a> • 
                <a href="https://polygonscan.com/address/0x878f8a3cD6cBFdB107040A2c0D7B0e2804A7103c" 
                   className="text-pink hover:text-teal-200 mx-2">Presale</a>
              </p>
            </div>
          </div>
        </div>

        <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
}