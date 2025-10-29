import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import type { Network } from '@/types';

function getUSDCMint(network: Network): string {
  return network === 'solana'
    ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // Mainnet USDC
    : '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'; // Devnet USDC
}

function getRpcUrl(network: Network): string {
  return network === 'solana'
    ? 'https://api.mainnet-beta.solana.com'
    : 'https://api.devnet.solana.com';
}

export async function fetchUSDCBalance(
  walletAddress: string,
  network: Network,
  customRpcUrl?: string
): Promise<string> {
  try {
    const rpcUrl = customRpcUrl || getRpcUrl(network);
    const connection = new Connection(rpcUrl, 'confirmed');
    const walletPubkey = new PublicKey(walletAddress);
    const usdcMint = new PublicKey(getUSDCMint(network));

    const tokenAccountAddress = await getAssociatedTokenAddress(
      usdcMint,
      walletPubkey
    );

    const tokenAccount = await getAccount(connection, tokenAccountAddress);

    const balance = Number(tokenAccount.amount) / 1_000_000;

    return balance.toFixed(2);
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    return '0.00';
  }
}

export function toMicroUSDC(amount: number): bigint {
  return BigInt(Math.floor(amount * 1_000_000));
}

export function fromMicroUSDC(microAmount: bigint | number): number {
  return Number(microAmount) / 1_000_000;
}
