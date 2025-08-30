import { http, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const infuraKey = import.meta.env.VITE_INFURA_API_KEY;

// Фallback RPC, если Infura ключ отсутствует
const getPolygonRpc = (key) => {
  if (key) {
    return `https://polygon-mainnet.infura.io/v3/${key}`;
  }
  console.warn("VITE_INFURA_API_KEY not found, using public RPC as fallback. This may be unreliable.");
  return "https://polygon-rpc.com"; // Публичный RPC как резерв
};

export const config = createConfig({
  chains: [polygon],
  connectors: [
    injected(), // Приоритет для инжектированных кошельков (MetaMask на мобильных)
    walletConnect({
      projectId: "bb93798df2c013c0d53e2d0dafa62aad", // Убедитесь, что это действительный ID
    }),
  ],
  transports: {
    [polygon.id]: http(getPolygonRpc(infuraKey)), // Динамический выбор RPC
  },
  autoConnect: true, // Добавляем автоподключение
});