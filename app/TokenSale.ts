'use client';

import { BaseContract, type Provider } from 'ethers';

import { LotteryTokenSale } from '@/lottery/typechain-types';

import { abi as TokenSaleABI } from './TokenSale.json';

export class TokenSale {
  private readonly _contract: LotteryTokenSale;

  public constructor(provider: Provider) {
    this._contract = new BaseContract(
      process.env.NEXT_PUBLIC_TOKEN_SALE_ADDRESS!,
      TokenSaleABI,
      provider,
    ) as LotteryTokenSale;
  }

  public async isOpen(): Promise<boolean> {
    return await this._contract.isOpen();
  }

  // TODO
}
