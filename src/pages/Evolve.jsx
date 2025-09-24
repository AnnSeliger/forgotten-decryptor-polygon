import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { polygon } from "viem/chains";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contracts/constants";
import CelebrationModal from "../components/CelebrationModal";
import WalletModal from "../components/WalletModal";
import "../styles.css";

/* ========= КОНСТАНТЫ ФОРМ ========= */
const LEVEL_2_FORMS = {
  A1: [
    { name: "A1_01_Pale_Bloom", weight: 0.35 },
    { name: "A1_02_Ember_Gaze", weight: 0.3 },
    { name: "A1_03_Whispering_Ash", weight: 0.2 },
    { name: "A1_04_Blazing_Caller", weight: 0.1 },
    { name: "A1_05_Crimson_Sleep", weight: 0.05 },
  ],
  A2: [
    { name: "A2_01_Aurora_Whisper", weight: 0.35 },
    { name: "A2_02_Frozen_Shell", weight: 0.3 },
    { name: "A2_03_Halo_of_Stillness", weight: 0.2 },
    { name: "A2_04_Crown_of_Snow", weight: 0.1 },
    { name: "A2_05_Mirror_Veil", weight: 0.05 },
  ],
  B1: [
    { name: "B1_01_Hollow_Gaze", weight: 0.35 },
    { name: "B1_02_Obsidian_Bloom", weight: 0.3 },
    { name: "B1_03_Silent_Maw", weight: 0.2 },
    { name: "B1_04_Phantom_Core", weight: 0.1 },
    { name: "B1_05_Echo_Blind", weight: 0.05 },
  ],
  B2: [
    { name: "B2_01_Wings_of_Silence", weight: 0.35 },
    { name: "B2_02_Luminous_Shade", weight: 0.3 },
    { name: "B2_03_Solar_Feather", weight: 0.2 },
    { name: "B2_04_Radiant_Tail", weight: 0.1 },
    { name: "B2_05_Dawnfire", weight: 0.05 },
  ],
  C1: [
    { name: "C1_01_Echo_Crown", weight: 0.35 },
    { name: "C1_02_Barked_Memory", weight: 0.3 },
    { name: "C1_03_Spinal_Grove", weight: 0.2 },
    { name: "C1_04_Thorned_Whisper", weight: 0.1 },
    { name: "C1_05_Verdigris_Skull", weight: 0.05 },
  ],
  C2: [
    { name: "C2_01_Bloom_of_Silence", weight: 0.35 },
    { name: "C2_02_Verdant_Echo", weight: 0.3 },
    { name: "C2_03_Soul_Spore", weight: 0.2 },
    { name: "C2_04_Glimmer_Root", weight: 0.1 },
    { name: "C2_05_Golden_Vein", weight: 0.05 },
  ],
};

const LEVEL_3_FORMS = {
  A1: "A1_L3_Totem_Flare",
  A2: "A2_L3_Halo_Entity",
  B1: "B1_L3_Shadow_Watcher",
  B2: "B2_L3_Winged_Core",
  C1: "C1_L3_Bone_Memory",
  C2: "C2_L3_Spirit_Growth",
};

/* ========= IPFS CIDs ========= */
const BASE_URIS = {
  level1: "bafybeiaho3trs6xzuq3gy2sryyvvfet5scmdnxjcw4nopwwclfhaokpjl4",
  level2: "bafybeigsvtg3pvf5oaozai7sycqkywitxvgwdq2hhe6rslrilvj2u6iyse",
  level3: "bafybeidfmsn5ureddehq4wbkcsaxn2r5johybkbizebhokvtrxllanytby",
};

/* ========= IPFS GWs + utils ========= */
const GATEWAYS = [
  "https://copper-rainy-swan-936.mypinata.cloud/ipfs",
  "https://ipfs.io/ipfs",
  "https://cloudflare-ipfs.com/ipfs",
];

const rewriteIpfs = (url) => {
  if (!url) return url;
  if (url.startsWith("ipfs://")) {
    return `${GATEWAYS[0]}/${url.replace("ipfs://", "")}`;
  }
  return url;
};

const fetchFromGateways = async (path) => {
  for (const gw of GATEWAYS) {
    try {
      const res = await axios.get(`${gw}/${path}`, { timeout: 15000 });
      return res.data;
    } catch (_) {
      // try next gateway
    }
  }
  throw new Error("All gateways failed");
};

const weightedRandomForm = (branch) => {
  const forms = LEVEL_2_FORMS[branch] || LEVEL_2_FORMS.A1;
  const total = forms.reduce((s, f) => s + f.weight, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (const f of forms) {
    acc += f.weight;
    if (r <= acc) return f.name;
  }
  return forms[0].name;
};

let cachedLevel1Metadata = null;
const fetchMetadata = async (urlPath, level) => {
  try {
    if (level === 1) {
      if (cachedLevel1Metadata) return cachedLevel1Metadata;
      const data = await fetchFromGateways(`${BASE_URIS.level1}/level1.json`);
      data.image = rewriteIpfs(data.image);
      data.animation_url = rewriteIpfs(data.animation_url);
      cachedLevel1Metadata = data;
      return data;
    } else {
      const data = await fetchFromGateways(urlPath);
      data.image = rewriteIpfs(data.image);
      data.animation_url = rewriteIpfs(data.animation_url);
      return data;
    }
  } catch (e) {
    console.error(`[Evolve] metadata fetch failed (L${level}):`, e?.message || e);
    return null;
  }
};

/* ========= Рендер медиа ========= */
function NFTMedia({ meta, className, style }) {
  const anim = meta?.animation_url;
  const img = meta?.image;
  const isVideo =
    anim &&
    (anim.endsWith(".mp4") || anim.endsWith(".webm") || anim.includes("video"));
  const isGif = anim && anim.endsWith(".gif");

  if (isVideo) {
    return (
      <video
        className={`nft-image ${className || ""}`}
        style={style}
        src={anim}
        poster={img || undefined}
        playsInline
        muted
        loop
        autoPlay
      />
    );
  }
  if (isGif) {
    return (
      <img
        className={`nft-image ${className || ""}`}
        style={style}
        src={anim}
        alt={meta?.name || ""}
      />
    );
  }
  return (
    <img
      className={`nft-image ${className || ""}`}
      style={style}
      src={img}
      alt={meta?.name || ""}
    />
  );
}

/* ========= ОСНОВНОЙ КОМПОНЕНТ ========= */
export default function Evolve() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const publicClient = usePublicClient({ chainId: polygon.id });
  const { data: walletClient } = useWalletClient();

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [evolvingIds, setEvolvingIds] = useState(new Set());
  const [error, setError] = useState(null);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  const [sortOption, setSortOption] = useState("none");
  const [filterLevel, setFilterLevel] = useState("all");

  const [flashIds, setFlashIds] = useState(new Set());
  const [celebrationData, setCelebrationData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  /* === Ленивая загрузка NFT с батчами === */
  const BATCH_SIZE = 20;

  const loadNFTs = useCallback(async () => {
    if (!isConnected || !address || chain?.id !== polygon.id) {
      setError('Please connect your wallet to the Polygon network');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const [ids, levels, forms] = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getTokensOfOwner",
        args: [address],
      });

      const fetched = ids.map((id, i) => {
        const tokenId = Number(id);
        const level = Number(levels[i]);
        const formRaw = forms[i] || "";
        const form = String(formRaw).replace(/-/g, "_");
        const branch = form && form.length >= 2 ? form.slice(0, 2) : null;
        return { tokenId, level, form, branch, rarity: "", metadata: null };
      });

      setTokens(fetched);
      setVisibleCount(fetched.length <= 20 ? fetched.length : 12);

      const loadMetadataBatch = async (startIndex = 0) => {
        const batch = fetched.slice(startIndex, startIndex + BATCH_SIZE);
        if (batch.length === 0) return;

        await Promise.all(
          batch.map(async (token, idx) => {
            try {
              let meta = null;
              if (token.level === 1) meta = await fetchMetadata(null, 1);
              else if (token.level === 2 && token.form)
                meta = await fetchMetadata(`${BASE_URIS.level2}/${token.form}.json`, 2);
              else if (token.level === 3 && token.form)
                meta = await fetchMetadata(`${BASE_URIS.level3}/${token.form}.json`, 3);

              if (meta) {
                meta.image = rewriteIpfs(meta.image);
                meta.animation_url = rewriteIpfs(meta.animation_url);
                const rarity = meta.attributes?.find((a) => a.trait_type === "Rarity")?.value || "";
                setTokens((prev) => {
                  const n = [...prev];
                  n[startIndex + idx] = { ...token, metadata: meta, rarity };
                  return n;
                });
              }
            } catch (e) {
              console.error(`[Evolve] Batch metadata fetch failed:`, e);
            }
          })
        );

        setTimeout(() => loadMetadataBatch(startIndex + BATCH_SIZE), 0);
      };

      loadMetadataBatch(0);
    } catch (err) {
      console.error("❌ Error loading NFTs:", err);
      setError("Failed to load NFTs.");
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, publicClient, chain?.id]);

  useEffect(() => {
    if (isConnected && chain?.id !== polygon.id) {
      switchChain({ chainId: polygon.id });
    }
    if (isConnected) loadNFTs();
  }, [isConnected, loadNFTs, chain?.id, switchChain]);

  /* === Прогресс веток для L3 === */
  const branchCounts = tokens
    .filter((t) => t.level === 2)
    .reduce((acc, token) => {
      acc[token.branch] = acc[token.branch] || new Set();
      if (token.form) acc[token.branch].add(token.form);
      return acc;
    }, {});

  const openModal = (nft) => setSelectedNFT(nft);
  const closeModal = () => setSelectedNFT(null);

  const openConnectModal = () => setIsModalOpen(true);
  const closeConnectModal = () => setIsModalOpen(false);

  /* === Эволюция L1 -> L2 === */
  const evolveToLevel2 = async (tokenId) => {
    if (!walletClient || !address || chain?.id !== polygon.id) {
      setError('Please connect your wallet to the Polygon network');
      if (chain?.id !== polygon.id) {
        switchChain({ chainId: polygon.id });
      }
      return;
    }
    try {
      setEvolvingIds((prev) => new Set(prev).add(tokenId));

      const branches = Object.keys(LEVEL_2_FORMS);
      const randomBranch = branches[Math.floor(Math.random() * branches.length)];
      const selectedForm = weightedRandomForm(randomBranch);

      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "evolveToLevel2",
        args: [BigInt(tokenId), selectedForm],
        account: address,
        chain: polygon,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      const newMeta = await fetchMetadata(`${BASE_URIS.level2}/${selectedForm}.json`, 2);
      await loadNFTs();

      setFlashIds((prev) => new Set(prev).add(tokenId));
      setTimeout(() => {
        setFlashIds((prev) => {
          const n = new Set(prev);
          n.delete(tokenId);
          return n;
        });
      }, 1000);

      setCelebrationData({ form: selectedForm, metadata: newMeta });
    } catch (err) {
      console.error("❌ evolveToLevel2 failed:", err);
      setError(err?.shortMessage || err?.message || "Evolution failed");
    } finally {
      setEvolvingIds((prev) => {
        const n = new Set(prev);
        n.delete(tokenId);
        return n;
      });
    }
  };

  /* === Эволюция L2 -> L3 === */
  const handleEvolveBranch = async (branch) => {
    if (!walletClient || !address || chain?.id !== polygon.id) {
      setError('Please connect your wallet to the Polygon network');
      if (chain?.id !== polygon.id) {
        switchChain({ chainId: polygon.id });
      }
      return;
    }

    const branchTokens = tokens.filter((t) => t.level === 2 && t.branch === branch);
    const uniqueForms = [...new Set(branchTokens.map((t) => t.form))];

    if (uniqueForms.length < 5) {
      console.warn(`${branch}: ${uniqueForms.length}/5 unique forms collected`);
      return;
    }

    const picked = [];
    for (const f of uniqueForms) {
      const first = branchTokens.find((t) => t.form === f);
      if (first) picked.push(first);
      if (picked.length === 5) break;
    }

    const tokenIds = picked.map((t) => BigInt(t.tokenId));
    const l3Form = LEVEL_3_FORMS[branch];

    try {
      picked.forEach((t) => setEvolvingIds((prev) => new Set(prev).add(t.tokenId)));

      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "evolveToLevel3",
        args: [tokenIds, l3Form],
        account: address,
        chain: polygon,
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      const newMeta = await fetchMetadata(`${BASE_URIS.level3}/${l3Form}.json`, 3);
      await loadNFTs();

      setCelebrationData({ form: l3Form, metadata: newMeta });
    } catch (err) {
      console.error("❌ Evolution to Level 3 failed:", err);
      setError(err?.shortMessage || err?.message || "Evolution to L3 failed");
    } finally {
      picked.forEach((t) =>
        setEvolvingIds((prev) => {
          const n = new Set(prev);
          n.delete(t.tokenId);
          return n;
        })
      );
    }
  };

  return (
    <div className="page-bg-evolve min-h-screen">
      <div className="container">
        <button
          className="connect-wallet-btn"
          onClick={isConnected ? disconnect : openConnectModal}
          onTouchStart={(e) => e.preventDefault()}
        >
          {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
        </button>

        <div className="page-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              alignItems: "start",
              marginBottom: 12,
            }}
          >
            <div className="text-overlay" style={{ textAlign: "left" }}>
              <h1 className="page-title" style={{ marginBottom: 8 }}>
                Garden Residents
              </h1>
              {loading && <p>Loading NFTs...</p>}
              {error && <p className="text-pink">{String(error)}</p>}
              <p className="text-light-purple">Owned tokens: {tokens.length}</p>

              <div className="sort-controls" style={{ marginTop: 8 }}>
                <label>Sort by:&nbsp;</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="none">None</option>
                  <option value="branch">Branch</option>
                  <option value="form">Form</option>
                </select>
                <label style={{ marginLeft: 20 }}>Filter by Level:&nbsp;</label>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                </select>
              </div>
            </div>

            <div className="text-overlay" style={{ textAlign: "left" }}>
              <h2 style={{ marginTop: 0 }}>Branch Progress</h2>
              {Object.entries(branchCounts).map(([branch, forms]) => (
                <p key={branch} style={{ margin: "6px 0" }}>
                  {branch}: {forms.size}/5{" "}
                  {forms.size >= 5 && (
                    <button
                      className="evolve-btn"
                      onClick={() => handleEvolveBranch(branch)}
                      disabled={[...evolvingIds].length > 0}
                      style={{ marginLeft: 10 }}
                    >
                      Evolve to Level 3
                    </button>
                  )}
                </p>
              ))}
            </div>
          </div>

          <div className="token-grid">
            {tokens
              .filter((t) => filterLevel === "all" || t.level === Number(filterLevel))
              .sort((a, b) => {
                if (sortOption === "branch") return (a.branch || "").localeCompare(b.branch || "");
                if (sortOption === "form") return (a.form || "").localeCompare(b.form || "");
                return 0;
              })
              .slice(0, visibleCount)
              .map((nft) => {
                const flashing = flashIds.has(nft.tokenId);
                const evolving = evolvingIds.has(nft.tokenId);

                return (
                  <div
                    key={nft.tokenId}
                    className={`nft-card level-${nft.level} ${nft.rarity || ""}`}
                    onClick={() => openModal(nft)}
                    style={{
                      position: "relative",
                      ...(flashing
                        ? {
                            outline: "3px solid #00fff2",
                            boxShadow: "0 0 24px #00fff2",
                            transform: "scale(1.03)",
                          }
                        : null),
                    }}
                  >
                    {nft.metadata ? (
                      <>
                        <NFTMedia meta={nft.metadata} />
                        <div className="nft-info">
                          <h2>{nft.metadata.name}</h2>
                          <p className="nft-desc">{nft.metadata.description}</p>
                          <p>Level: {nft.level}</p>
                          <p>Form: {nft.form || "—"}</p>
                          {nft.metadata.attributes && (
                            <ul className="nft-attrs">
                              {nft.metadata.attributes.map((attr, idx) => (
                                <li key={idx}>
                                  <strong>{attr.trait_type}:</strong>{" "}
                                  {attr.value}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        {nft.level === 1 && (
                          <button
                            className={`evolve-btn ${evolving ? "evolving" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              evolveToLevel2(nft.tokenId);
                            }}
                            disabled={evolving}
                          >
                            {evolving ? "Evolving..." : "Evolve to Level 2"}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-light-purple">Metadata unavailable</p>
                    )}
                  </div>
                );
              })}
          </div>

          {visibleCount < tokens.length && (
            <button
              className="evolve-btn show-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 12)}
            >
              Show More
            </button>
          )}
        </div>
      </div>

      {selectedNFT && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {selectedNFT.metadata ? <NFTMedia meta={selectedNFT.metadata} /> : null}
            <h2>{selectedNFT.metadata?.name}</h2>
            <p>{selectedNFT.metadata?.description}</p>
            <ul className="nft-attrs">
              {selectedNFT.metadata?.attributes?.map((attr, idx) => (
                <li key={idx}>
                  <strong>{attr.trait_type}:</strong> {attr.value}
                </li>
              ))}
            </ul>
            <button onClick={closeModal} className="close-modal-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {celebrationData && (
        <CelebrationModal
          isOpen={!!celebrationData}
          nft={celebrationData}
          onClose={() => setCelebrationData(null)}
        />
      )}

      {isModalOpen && <WalletModal isOpen={isModalOpen} onClose={closeConnectModal} />}
    </div>
  );
}