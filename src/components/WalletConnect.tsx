"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Image from "next/image";

export default function WalletConnect() {
  const { isConnected } = useAccount();

  return (
    <div className="flex justify-center">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      {chain.hasIcon && chain.iconUrl && (
                        <img
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                          className="w-6 h-6 mr-2"
                        />
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {account.displayName}
                      {account.displayBalance && (
                        <span className="ml-2 text-gray-400">
                          ({account.displayBalance})
                        </span>
                      )}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
