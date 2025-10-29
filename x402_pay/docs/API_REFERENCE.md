# API Reference

## Components

### X402Pay

Primary wrapper that gates children until a payment succeeds.

```tsx
<X402Pay
  amount={number}
  description={string}
  wallet={WalletAdapter}
  network?={'solana' | 'solana-devnet'}
  treasuryAddress?={string}
  facilitatorUrl?={string}
  theme?={'solana' | 'dark' | 'light' | 'custom'}
  showBalance?={boolean}
  showNetworkInfo?={boolean}
  showPaymentDetails?={boolean}
  classNames?={ComponentClassNames}
  customStyles?={ComponentStyles}
  maxPaymentAmount?={number}
  onPaymentStart?={() => void}
  onPaymentSuccess?={(txId: string) => void}
  onPaymentError?={(error: Error) => void}
  onWalletConnect?={(address: string) => void}
>
  {children}
</X402Pay>
```

### PayActionButton

Standalone button to trigger a payment when used with the hook.

```tsx
<PayActionButton
  amount={number}
  description={string}
  onClick={() => void}
  disabled?={boolean}
  loading?={boolean}
  className?={string}
  style?={React.CSSProperties}
/>
```

### PayStateBadge

Small status indicator for payment state.

```tsx
<PayStateBadge
  status={'idle' | 'connecting' | 'pending' | 'success' | 'error'}
  message?={string}
  progress?={number}
  className?={string}
  style?={React.CSSProperties}
/>
```

### WalletPanel

Compact wallet + balance + network display.

```tsx
<WalletPanel
  wallet?={WalletAdapter}
  balance?={string}
  network?={'solana' | 'solana-devnet'}
  showBalance?={boolean}
  className?={string}
  style?={React.CSSProperties}
/>
```

---

## Hook

### useX402Pay

React hook to handle the x402 payment flow.

```tsx
const {
  pay,
  isLoading,
  status,
  error,
  transactionId,
  reset,
} = useX402Pay({
  wallet,
  network,
  rpcUrl?,
  apiEndpoint?,
  treasuryAddress?,
  facilitatorUrl?,
  maxPaymentAmount?,
});
```

Returns:

| Property | Type | Description |
|----------|------|-------------|
| `pay` | `(amount: number, description: string) => Promise<string \| null>` | Initiate payment |
| `isLoading` | `boolean` | Whether a payment is in progress |
| `status` | `PaymentStatusType` | Current payment status |
| `error` | `Error \| null` | Normalized error if any |
| `transactionId` | `string \| null` | Transaction ID on success |
| `reset` | `() => void` | Reset to idle state |

---

## Types

### WalletAdapter

```ts
interface WalletAdapter {
  publicKey?: { toString(): string };
  address?: string;
  signTransaction: (tx: VersionedTransaction) => Promise<VersionedTransaction>;
}
```

### ComponentClassNames

```ts
interface ComponentClassNames {
  container?: string;
  button?: string;
  card?: string;
  text?: string;
  status?: string;
  spinner?: string;
}
```

### ComponentStyles

```ts
interface ComponentStyles {
  container?: React.CSSProperties;
  button?: React.CSSProperties;
  card?: React.CSSProperties;
  text?: React.CSSProperties;
  status?: React.CSSProperties;
  spinner?: React.CSSProperties;
}
```

### PaymentStatusType

```ts
type PaymentStatusType = 'idle' | 'connecting' | 'pending' | 'success' | 'error';
```

### SolanaNetwork

```ts
type SolanaNetwork = 'solana' | 'solana-devnet';
```

---

## Styling

Use theme presets or tailor via `classNames` and `customStyles`. A full UI rebrand can swap classes in `shared/ui/*`.
