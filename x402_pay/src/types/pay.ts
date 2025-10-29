import type { ReactNode } from 'react';
import type { VersionedTransaction } from '@solana/web3.js';
import type { ComponentClassNames, ComponentStyles, ThemePreset } from './theme';

export type Network = 'solana' | 'solana-devnet';

export interface SignerAdapter {
  publicKey?: { toString(): string };
  address?: string;
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>;
}

export type PayState = 'idle' | 'connecting' | 'pending' | 'success' | 'error';

export interface X402PayProps {
  amount: number;
  description: string;
  wallet: SignerAdapter;
  network?: Network;
  rpcUrl?: string;
  apiEndpoint?: string;
  treasuryAddress?: string;
  facilitatorUrl?: string;

  theme?: ThemePreset;
  showBalance?: boolean;
  showNetworkInfo?: boolean;
  showPaymentDetails?: boolean;

  classNames?: ComponentClassNames;
  customStyles?: ComponentStyles;

  maxPaymentAmount?: number;
  enablePaymentCaching?: boolean;
  autoRetry?: boolean;

  onPaymentStart?: () => void;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: Error) => void;
  onWalletConnect?: (publicKey: string) => void;

  children: ReactNode;
}

export interface PayActionButtonProps {
  amount: number;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface PayStateBadgeProps {
  status: PayState;
  message?: string;
  progress?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface WalletPanelProps {
  wallet?: SignerAdapter;
  balance?: string;
  network?: Network;
  showBalance?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
