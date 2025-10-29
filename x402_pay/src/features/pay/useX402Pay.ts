import { useCallback, useReducer } from 'react';
import { performProtectedRequest } from '@/shared/api/protected-fetch';
import type { SignerAdapter, Network, PayState } from '@/types';
import { decodeBase64 } from '@/shared/lib/utils';
import { DEFAULT_API_ENDPOINT } from '@/shared/config';

export interface PayConfig {
  wallet: SignerAdapter;
  network: Network;
  rpcUrl?: string;
  apiEndpoint?: string;
  treasuryAddress?: string;
  facilitatorUrl?: string;
  maxPaymentAmount?: number;
}

export interface UseX402PayReturn {
  pay: (amount: number, description: string) => Promise<string | null>;
  isLoading: boolean;
  status: PayState;
  error: Error | null;
  transactionId: string | null;
  reset: () => void;
}

export function useX402Pay(config: PayConfig): UseX402PayReturn {
  type State = { status: PayState; error: Error | null; transactionId: string | null; isLoading: boolean };
  type Action =
    | { type: 'reset' }
    | { type: 'start' }
    | { type: 'success'; txId: string }
    | { type: 'error'; error: Error };

  const initial: State = { status: 'idle', error: null, transactionId: null, isLoading: false };
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'reset':
        return initial;
      case 'start':
        return { ...state, status: 'pending', isLoading: true, error: null, transactionId: null };
      case 'success':
        return { ...state, status: 'success', isLoading: false, error: null, transactionId: action.txId };
      case 'error':
        return { ...state, status: 'error', isLoading: false, error: action.error };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initial);

  const reset = useCallback(() => dispatch({ type: 'reset' }), []);

  const pay = useCallback(
    async (amount: number, description: string): Promise<string | null> => {
      try {
        dispatch({ type: 'start' });

        if (config.maxPaymentAmount && amount > config.maxPaymentAmount) {
          const err = new Error(
            `Payment amount ${amount} exceeds maximum allowed ${config.maxPaymentAmount}`
          );
          err.name = 'AMOUNT_EXCEEDS_MAX';
          throw err;
        }

        const walletAddress = config.wallet.publicKey?.toString() || config.wallet.address;
        if (!walletAddress) {
          const err = new Error('Wallet not connected');
          err.name = 'WALLET_NOT_CONNECTED';
          throw err;
        }

  const apiEndpoint = config.apiEndpoint || DEFAULT_API_ENDPOINT;

        const response = await performProtectedRequest(
          apiEndpoint,
          {
            wallet: config.wallet,
            network: config.network,
            rpcUrl: config.rpcUrl,
            maxPaymentAmount: config.maxPaymentAmount,
          },
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { message: description, amount },
          }
        );

        if (!response.ok) {
          const err = new Error(`Payment request failed: ${response.statusText}`);
          err.name = 'REQUEST_FAILED';
          throw err;
        }

  // Optional: some merchants return a JSON body; it's not required here
  try {
    await response.clone().json();
  } catch {
    // noop: response body may be empty
  }
        const paymentResponse = response.headers.get('X-PAYMENT-RESPONSE');
        let txId = `tx_${Date.now()}`;

        if (paymentResponse) {
          try {
            const decoded = JSON.parse(decodeBase64(paymentResponse));
            txId = decoded.transactionId || decoded.signature || txId;
          } catch (e) {
            const warn = e instanceof Error ? e : new Error('Decode failed');
            warn.name = 'DECODE_FAILED';
            console.warn('Could not decode payment response:', warn);
          }
        }

        dispatch({ type: 'success', txId });
        return txId;
      } catch (err) {
        const paymentError = err instanceof Error ? err : new Error('Payment failed');
        if (!('name' in paymentError) || !paymentError.name) {
          paymentError.name = 'UNKNOWN_ERROR';
        }
        dispatch({ type: 'error', error: paymentError });
        return null;
      }
    },
    [config]
  );

  return { pay, isLoading: state.isLoading, status: state.status, error: state.error, transactionId: state.transactionId, reset };
}
