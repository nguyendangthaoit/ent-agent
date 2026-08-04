import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSafeRedirect(redirect: string | null | undefined, fallback: string = "/"): string {
  if (!redirect) return fallback;

  // Must start with exactly one "/", and not "//" (protocol-relative URL,
  // which the browser treats as an absolute URL to another host).
  if (redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  return fallback;
}
