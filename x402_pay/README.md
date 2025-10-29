# x402 pay — React components for Solana paywalls

A lightweight, white‑label React library to gate content and accept USDC payments on Solana via the x402 payment flow. Keep your backend contract as‑is while using a cleaner public API and a modular, feature‑sliced structure.

## 🚀 Features

- Drop‑in React components: X402Pay, PayActionButton, PayStateBadge, WalletPanel
- Solana‑native: simple wallet adapter surface (Phantom, Solflare, …)
- TypeScript types and narrow public API
- Tailwind/shadcn primitives under the hood (easy to rebrand later)
- Contract‑safe: endpoint + headers/body unchanged by default

## 📋 Prerequisites

- Node.js v18+
- React 18+
- A Solana wallet (Phantom, Solflare, …)
- USDC balance (mainnet) or devnet setup for testing

## 📦 Installation

```bash
# Replace with your package name if published under your scope
npm install x402-pay
```

Install peer dependencies (wallet adapters):

```bash
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/web3.js
```

## ⚙️ Setup

### 1) Import styles

```tsx
// Replace with your package name
import 'x402-pay/styles';
```

### 2) Wallet provider setup

Wrap your app with Solana wallet providers:

```tsx
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

function AppProviders({ children }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

## 🎯 Quick start (wrapper)

```tsx
import { X402Pay } from 'x402-pay';
import { useWallet } from '@solana/wallet-adapter-react';

function PremiumPage() {
  const wallet = useWallet();
  return (
    <X402Pay
      amount={2.5}
      description="Premium AI Chat Access"
      wallet={wallet}
      network="solana-devnet"
      onPaymentSuccess={(txId) => console.log('paid', txId)}
    >
      <PremiumContent />
    </X402Pay>
  );
}
```

## 🧩 Composable usage (hook + primitives)

```tsx
import { useX402Pay, PayActionButton, PayStateBadge, WalletPanel } from 'x402-pay';

function Gate({ wallet }) {
  const { pay, isLoading, status, error, transactionId } = useX402Pay({
    wallet,
    network: 'solana-devnet',
    // apiEndpoint defaults to a constant in config (can be overridden)
  });

  return (
    <div>
      <WalletPanel wallet={wallet} showBalance network="solana-devnet" />
      <PayActionButton
        amount={2.5}
        description="Premium AI Chat Access"
        onClick={() => pay(2.5, 'Premium AI Chat Access')}
        loading={isLoading}
        disabled={isLoading}
      />
      {status !== 'idle' && (
        <PayStateBadge status={status} message={error?.message} />
      )}
      {transactionId && <p className="text-xs">tx: {transactionId}</p>}
    </div>
  );
}
```

## 📚 API Reference (high level)

### X402Pay props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `amount` | `number` | ✅ | - | Payment amount in USD |
| `description` | `string` | ✅ | - | Payment description |
| `wallet` | `WalletAdapter` | ✅ | - | Solana wallet adapter instance |
| `network` | `'solana' \| 'solana-devnet'` | ❌ | `'solana-devnet'` | Network to use |
| `rpcUrl` | `string` | ❌ | - | Custom RPC URL |
| `treasuryAddress` | `string` | ❌ | - | Custom treasury address |
| `facilitatorUrl` | `string` | ❌ | - | Custom facilitator URL |
| `theme` | `'solana' \| 'dark' \| 'light' \| 'custom'` | ❌ | `'solana'` | Visual theme |
| `showBalance` | `boolean` | ❌ | `true` | Show wallet balance |
| `showNetworkInfo` | `boolean` | ❌ | `true` | Show network info |
| `maxPaymentAmount` | `number` | ❌ | - | Maximum payment amount |
| Callbacks | `onPaymentStart/onPaymentSuccess/onPaymentError/onWalletConnect` | ❌ | - | Lifecycle hooks |

See [full API documentation](./docs/API_REFERENCE.md) for complete reference (components, hook, and types).

## 🛠️ Development

```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Build
npm run build

# Lint (optional if config present)
npm run lint
```

## 🐛 Troubleshooting

Common issues:

- Wallet not connected: ensure providers/wallet extension and matching network
- Insufficient USDC: top up and ensure enough SOL for fees (use faucet on devnet)
- RPC rate limit: add a custom RPC `rpcUrl`
- Styling: ensure you imported `x402-pay/styles`

## ✅ Status

**Ready for Production** — Fully functional paywall components using the x402 payment flow.

### Features Complete
- Core paywall wrapper and primitives
- Multi‑wallet support
- TypeScript + modular design
- Devnet friendly; mainnet ready

## 🤝 Contributing

Contributions welcome!

## 📄 License

MIT License

## 🔗 Related

- x402 protocol and Solana client implementations

---

Built with ❤️ for the Solana ecosystem