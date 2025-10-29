// New public API (x402 pay)
export { X402Pay } from './features/pay/X402Pay';
export { PayActionButton } from './features/pay/PayActionButton';
export { PayStateBadge } from './features/pay/PayStateBadge';
export { WalletPanel } from './entities/wallet/WalletPanel';

// UI primitives
export { Button } from './shared/ui/button';
export { Card, CardContent, CardDescription, CardHeader, CardTitle } from './shared/ui/card';
export { Badge } from './shared/ui/badge';
export { Spinner } from './shared/ui/spinner';

// Hooks
export { useX402Pay } from './features/pay/useX402Pay';
export type { PayConfig as PaymentConfig, UseX402PayReturn as UseX402PaymentReturn } from './features/pay/useX402Pay';

// Types
export type {
  Network as SolanaNetwork,
  SignerAdapter as WalletAdapter,
  PayState as PaymentStatusType,
  X402PayProps as X402PaywallProps,
  PayActionButtonProps as PaymentButtonProps,
  PayStateBadgeProps as PaymentStatusProps,
  WalletPanelProps as WalletSectionProps,
  ThemePreset,
  ComponentClassNames,
  ComponentStyles,
  ThemeConfig,
} from './types';

// Utilities
export { cx as cn } from './shared/lib/utils';

// Styles
import './styles/globals.css';
