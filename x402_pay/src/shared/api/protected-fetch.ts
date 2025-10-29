import { createX402Client } from 'x402-solana/client';
import type { VersionedTransaction } from '@solana/web3.js';

export type Network = 'solana' | 'solana-devnet';

export interface SignerAdapter {
  publicKey?: { toString(): string };
  address?: string;
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>;
}

export interface ProtectedClientConfig {
  wallet: SignerAdapter;
  network: Network;
  rpcUrl?: string;
  maxPaymentAmount?: number; // USD units
}

export interface ProtectedRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

export async function performProtectedRequest(
  apiEndpoint: string,
  cfg: ProtectedClientConfig,
  opts: ProtectedRequestOptions
): Promise<Response> {
  const client = createX402Client({
    wallet: cfg.wallet,
    network: cfg.network,
    rpcUrl: cfg.rpcUrl,
    maxPaymentAmount: cfg.maxPaymentAmount !== undefined
      ? BigInt(Math.floor(cfg.maxPaymentAmount * 1_000_000))
      : undefined,
  });

  const response = await client.fetch(apiEndpoint, {
    method: opts.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  return response;
}
