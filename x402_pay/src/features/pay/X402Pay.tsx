import * as React from 'react';
import { useState, useEffect } from 'react';
import { fetchUSDCBalance } from '@/entities/wallet/balance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { PayActionButton } from './PayActionButton';
import { PayStateBadge } from './PayStateBadge';
import { WalletPanel } from '@/entities/wallet/WalletPanel';
import { useX402Pay } from './useX402Pay';
import type { X402PayProps } from '@/types';
import { cx } from '@/shared/lib/utils';

export const X402Pay: React.FC<X402PayProps> = ({
  amount,
  description,
  wallet,
  network = 'solana-devnet',
  rpcUrl,
  apiEndpoint,
  treasuryAddress,
  facilitatorUrl,
  theme = 'solana',
  showBalance = true,
  showNetworkInfo = true,
  showPaymentDetails = true,
  classNames,
  customStyles,
  maxPaymentAmount,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  onWalletConnect,
  children,
}) => {
  const [isPaid, setIsPaid] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>('0.00');

  const { pay, isLoading, status, error, transactionId } = useX402Pay({
    wallet,
    network,
    rpcUrl,
    apiEndpoint,
    treasuryAddress,
    facilitatorUrl,
    maxPaymentAmount,
  });

  useEffect(() => {
    const walletAddress = wallet.publicKey?.toString() || wallet.address;
    if (walletAddress) {
      onWalletConnect?.(walletAddress);
      fetchUSDCBalance(walletAddress, network, rpcUrl).then(setWalletBalance);
    }
  }, [wallet, network, onWalletConnect]);

  useEffect(() => {
    if (status === 'success' && transactionId) {
      setIsPaid(true);
      onPaymentSuccess?.(transactionId);
    }
  }, [status, transactionId, onPaymentSuccess]);

  useEffect(() => {
    if (error) {
      onPaymentError?.(error);
    }
  }, [error, onPaymentError]);

  const handlePayment = async () => {
    onPaymentStart?.();
    await pay(amount, description);
  };

  if (isPaid) {
    return <>{children}</>;
  }

  const getThemeClasses = () => {
    switch (theme) {
      case 'solana':
        return 'border-solana-primary/20';
      case 'dark':
        return 'bg-card';
      case 'light':
        return 'bg-background';
      default:
        return '';
    }
  };

  return (
    <div
      className={cx(
        'flex items-center justify-center min-h-screen p-4',
        'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        classNames?.container
      )}
      style={customStyles?.container}
    >
      <Card
        className={cx(
          'w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-sm',
          getThemeClasses(),
          classNames?.card
        )}
        style={customStyles?.card}
      >
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-solana-gradient rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <CardTitle className={cx('text-3xl font-bold bg-solana-gradient bg-clip-text text-transparent', classNames?.text)} style={customStyles?.text}>
            Unlock Premium Access
          </CardTitle>
          <CardDescription className="text-lg text-slate-600 mt-2">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <WalletPanel
            wallet={wallet}
            balance={showBalance ? walletBalance : undefined}
            network={showNetworkInfo ? network : undefined}
            showBalance={showBalance}
          />

          {showPaymentDetails && (
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Payment Amount</span>
                <span className="text-2xl font-bold text-slate-900">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Currency</span>
                <span className="text-sm font-semibold text-slate-700 bg-slate-200 px-2 py-1 rounded-md">USDC</span>
              </div>
              {maxPaymentAmount && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">Maximum Amount</span>
                  <span className="text-xs text-slate-600">${maxPaymentAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {status !== 'idle' && (
            <PayStateBadge
              status={status}
              message={error?.message}
              className={classNames?.status}
              style={customStyles?.status}
            />
          )}

          <PayActionButton
            amount={amount}
            description={description}
            onClick={handlePayment}
            loading={isLoading}
            disabled={isLoading}
            className={cx('w-full h-12 text-lg font-semibold', classNames?.button)}
            style={customStyles?.button}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 text-center">
                <span className="font-semibold">Payment Error:</span> {error.message}
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-800 text-center">
              <span className="font-semibold">Live Payments:</span> Uses facilitator on Solana Mainnet.
              <br />Requires real USDC balance. Test payments may be refunded by the merchant.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

X402Pay.displayName = 'X402Pay';
