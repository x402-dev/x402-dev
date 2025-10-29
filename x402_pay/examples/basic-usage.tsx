import { X402Pay } from '../src';
import type { WalletAdapter } from '../src';
import type { VersionedTransaction } from '@solana/web3.js';

// Example: Basic usage with mock wallet
function App() {
  // Your wallet from wallet adapter or other provider
  const wallet: WalletAdapter = {
    publicKey: {
      toString: () => 'YourWalletAddressHere...',
    },
    signTransaction: async (tx: VersionedTransaction): Promise<VersionedTransaction> => {
      // Wallet signing logic
      return tx;
    },
  };

  return (
    <X402Pay
      amount={2.5}
      description="Premium AI Chat Access"
      wallet={wallet}
      network="solana-devnet"
      onPaymentSuccess={(txId: string) => {
        console.log('Payment successful!', txId);
      }}
      onPaymentError={(error: Error) => {
        console.error('Payment failed:', error);
      }}
    >
      {/* Your protected content goes here */}
      <div className="p-8">
        <h1 className="text-3xl font-bold">Premium Content</h1>
        <p>This content is only visible after payment.</p>
      </div>
    </X402Pay>
  );
}

export default App;
