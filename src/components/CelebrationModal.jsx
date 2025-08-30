// src/components/CelebrationModal.jsx
import React, { useEffect, useState } from "react";

/* ====== LEVEL FORMS ====== */
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

/* ====== LEVEL 3 FORMS ====== */
const LEVEL_3_FORMS = {
  A1: "A1_L3_Totem_Flare",
  A2: "A2_L3_Halo_Entity",
  B1: "B1_L3_Shadow_Watcher",
  B2: "B2_L3_Winged_Core",
  C1: "C1_L3_Bone_Memory",
  C2: "C2_L3_Spirit_Growth",
};

/* helper: A1_L3_Totem_Flare -> "Totem Flare" */
function formatLevel3Name(code) {
  if (!code || typeof code !== "string") return code || "Unknown";
  const parts = code.split("_");
  if (parts.length >= 3) return parts.slice(2).join(" ").replace(/_/g, " ");
  return code.replace(/_/g, " ");
}

/* precomputed L3 human names */
const L3_HUMAN_NAMES = Object.values(LEVEL_3_FORMS).map(formatLevel3Name);

/* ✅ NEW: robust L3 detection by code or human name */
function isLevel3Form(value) {
  if (!value || typeof value !== "string") return false;
  if (/^[ABC][12]_L3_/.test(value)) return true;       // code form like "C2_L3_Spirit_Growth"
  return L3_HUMAN_NAMES.includes(value);               // human name like "Spirit Growth"
}

/* 🔎 robust: пытаемся определить ветку, если nft.branch отсутствует */
function inferBranch(nft, fallbackName) {
  if (nft?.branch) return nft.branch;

  const raw = nft?.form || nft?.metadata?.name || fallbackName || "";
  const m = typeof raw === "string" ? raw.match(/^([ABC][12])_/) : null;
  if (m) return m[1];

  const human = nft?.metadata?.name || fallbackName || "";
  if (typeof human === "string" && human) {
    for (const [br, l3code] of Object.entries(LEVEL_3_FORMS)) {
      if (formatLevel3Name(l3code) === human) return br;
    }
  }
  return null;
}

const CelebrationModal = ({ nft, onClose, fromLevel }) => {
  const [portalVisible, setPortalVisible] = useState(false);
  const [showNFT, setShowNFT] = useState(false);

  useEffect(() => {
    if (!nft) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setPortalVisible(true), 120);
    const t2 = setTimeout(() => setShowNFT(true), 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = prevOverflow || "auto";
    };
  }, [nft]);

  if (!nft) return null;

  const oldForm = nft.oldForm || "Dormant Dreamer";
  const newForm = nft.metadata?.name || nft.form || "Unknown";

  // ===================== добавлено для Rarity =====================
  const RARITY_COLORS = {
  Common: "#a98cff",
  Uncommon: "#6efff5",
  Rare: "#4fd1ff",
  Epic: "#d46bff",
  Legendary: "#ffa500",
  Mythic: "#ffea00",
};
const rarity = nft?.metadata?.attributes?.find(a => a.trait_type.toLowerCase() === "rarity")?.value || "Common";
const rarityColor = RARITY_COLORS[rarity] || "#FFFFFF";

  const from = Number(fromLevel);
  const looksLikeL3 =
    isLevel3Form(newForm) ||
    isLevel3Form(nft.form) ||
    isLevel3Form(nft?.metadata?.name) ||
    from === 2 || from === 3 ||
    (Array.isArray(nft?.metadata?.attributes) &&
      nft.metadata.attributes.some(
        (a) =>
          (a.trait_type === "Level" || a.trait_type === "LEVEL" || a.trait_type === "level") &&
          Number(a.value) === 3
      ));

  let firstLineText, secondLineText;

  if (!looksLikeL3 && from === 1) {
    firstLineText = `🌱 Evolved: ${oldForm} →`;
    secondLineText = newForm;
  } else if (looksLikeL3) {
    const br = inferBranch(nft, newForm);
    const l3 = br ? LEVEL_3_FORMS[br] : null;
    firstLineText = br ? `Branch ${br} assembled →` : `Branch assembled →`;
    secondLineText = l3 ? formatLevel3Name(l3) : (typeof newForm === "string" ? newForm : "Unknown");
  } else {
    firstLineText = `🌱 Evolved: ${oldForm} →`;
    secondLineText = newForm;
  }

  const colors = ["#ff6fff", "#ff99ff", "#00fff2", "#c77dff"];

  return (
    <div className="celebration-overlay" role="dialog" aria-modal="true">
      <div className="celebration-center">
        <h2 className="celebration-title">✨&nbsp;Evolution Complete!&nbsp;✨</h2>

        <div className={`pixel-portal ${portalVisible ? "visible" : ""}`}>
          <div className="portal-halo" />
          <div className="portal-scanline" />

          {Array.from({ length: 64 }).map((_, i) => {
            const angle = (i / 64) * 360;
            const dist = 140 + Math.round(Math.random() * 160);
            const dur = 3 + Math.random() * 3;
            const delay = -(Math.random() * 2);
            const bg = colors[i % colors.length];
            return (
              <div
                key={i}
                className="pixel-particle"
                style={{
                  background: bg,
                  color: bg,
                  ["--angle"]: `${angle}deg`,
                  ["--dist"]: `${dist}px`,
                  ["--dur"]: `${dur}s`,
                  ["--delay"]: `${delay}s`,
                }}
              />
            );
          })}

          {showNFT && (
            <img
              src={nft.metadata?.image || nft.image}
              alt={typeof newForm === "string" ? newForm : "NFT"}
              className="celebration-nft"
              draggable={false}
              style={{
                border: `4px solid ${rarityColor}`,
                boxShadow: `0 0 28px ${rarityColor}66, 0 0 60px ${rarityColor}33`,
              }}
            />
          )}
        </div>

        <div className="celebration-text">
          <p className="celebration-line first-line">{firstLineText}</p>
          <p className="celebration-line result-line" style={{ color: rarityColor }}>{secondLineText}</p>
          <p className="celebration-line rarity-line" style={{ color: rarityColor }}>
            Rarity: {rarity}
          </p>
          <button
            className="celebration-close-btn"
            onClick={() => {
              setShowNFT(false);
              setTimeout(() => {
                setPortalVisible(false);
                setTimeout(() => onClose && onClose(), 220);
              }, 120);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal;