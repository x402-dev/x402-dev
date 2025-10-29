import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// SSR-safe base64 decoder
export function decodeBase64(input: string): string {
  try {
    if (typeof atob === "function") return atob(input);
  } catch {
    // noop: atob may not exist or may fail
  }
  // Node/SSR fallback
  try {
    // Buffer exists in Node; guard for browsers where Buffer may not exist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const B: any = (globalThis as any).Buffer;
    if (B && typeof B.from === "function") {
      return B.from(input, "base64").toString("utf-8");
    }
  } catch {
    // noop: Buffer may not exist
  }
  // last resort: return input unchanged
  return input;
}
