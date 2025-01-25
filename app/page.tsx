'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { BrowserProvider, JsonRpcProvider, type Provider } from 'ethers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import { Button } from '@headlessui/react';

import { TokenSale } from './TokenSale';

const TokenSaleContext = createContext<TokenSale | null>(null);

const useTokenSale = () => useContext(TokenSaleContext);

const SalePanel = () => {
  const requiredChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!, 10);
  const { active, chainId, library, activate } = useWeb3React<Provider>();
  const [tokenSale, setTokenSale] = useState<TokenSale | null>(null);
  const [isOpen, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    if (active) {
      if (chainId !== requiredChainId) {
        // TODO: show error message.
      } else {
        setTokenSale(new TokenSale(library!));
      }
    } else {
      setTokenSale(new TokenSale(new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL!)));
    }
  }, [active, chainId, library, requiredChainId]);
  useEffect(() => {
    (async () => {
      if (tokenSale) {
        setOpen(await tokenSale.isOpen());
      } else {
        setOpen(null);
      }
    })();
  }, [tokenSale]);
  return (
    <TokenSaleContext.Provider value={tokenSale}>
      <>
        {active ? null : (
          <p>
            <Button
              onClick={() => {
                activate(new InjectedConnector({ supportedChainIds: [requiredChainId] }));
              }}
            >
              Connect
            </Button>
          </p>
        )}
        {isOpen !== null ? <p>Status: {isOpen ? 'OPEN' : 'CLOSE'}</p> : null}
      </>
    </TokenSaleContext.Provider>
  );
};

export default function Home() {
  return (
    <Web3ReactProvider getLibrary={provider => new BrowserProvider(provider)}>
      <SalePanel />
    </Web3ReactProvider>
  );
}
