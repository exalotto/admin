'use client';

import { createContext, useEffect, useState } from 'react';

import { BrowserProvider, JsonRpcProvider, type Provider } from 'ethers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

import { Button } from '@headlessui/react';

import { TokenSale } from './TokenSale';
import Link from 'next/link';

const TokenSaleContext = createContext<TokenSale | null>(null);

const SalePanel = () => {
  const requiredChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!, 10);
  const { active, chainId, account, library, activate } = useWeb3React<Provider>();
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
        {active ? (
          <p>
            Connected as{' '}
            <Link
              href={`https://${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${account}`}
              rel="noreferrer"
              target="_blank"
            >
              {account}
            </Link>{' '}
            to network with ID {chainId} via {process.env.NEXT_PUBLIC_RPC_URL}
          </p>
        ) : (
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
        <p>
          TokenSale contract address:{' '}
          <Link
            href={`https://${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}/address/${process.env.NEXT_PUBLIC_TOKEN_SALE_ADDRESS}`}
            rel="noreferrer"
            target="_blank"
          >
            {process.env.NEXT_PUBLIC_TOKEN_SALE_ADDRESS}
          </Link>
        </p>
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
