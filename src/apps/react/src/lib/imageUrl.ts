// src/lib/imageUrl.ts
// Utility to resolve image URLs to absolute URLs if needed
import { settings } from "@/settings";

export function resolveImageUrl(url?: string | null): string {
  if (!url) return "/placeholder-image.jpg";
  // If already absolute (http/https/data), return as is
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  // Otherwise, prepend API base URL (remove trailing slash if present)
  const base = settings.baseAPI.replace(/\/$/, "");
  // Remove leading slash from url if present
  const rel = url.replace(/^\//, "");
  return `${base}/${rel}`;
}

export function resolveNeighborhoodUrl(url?: string | null): string {
  if (!url) return "/placeholder-image.jpg";
  // If already absolute (http/https/data), return as is
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  // Otherwise, prepend API base URL (remove trailing slash if present)
  const base = settings.baseAPI.replace(/\/$/, "");
  // Remove leading slash from url if present
  const rel = url.replace(/^\//, "");
  return `${base}/neighborhoods/${rel}`;
}

export function resolveAgencyUrl(url?: string | null): string {
  if (!url) return "/placeholder-image.jpg";
  // If already absolute (http/https/data), return as is
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  // Otherwise, prepend API base URL (remove trailing slash if present)
  const base = settings.baseAPI.replace(/\/$/, "");
  // Remove leading slash from url if present
  const rel = url.replace(/^\//, "");
  return `${base}/agencies/${rel}`;
}

export function resolveAgentsUrl(url?: string | null): string {
  if (!url) return "/placeholder-image.jpg";
  // If already absolute (http/https/data), return as is
  if (/^(https?:)?\/\//.test(url) || url.startsWith("data:")) return url;
  // Otherwise, prepend API base URL (remove trailing slash if present)
  const base = settings.baseAPI.replace(/\/$/, "");
  // Remove leading slash from url if present
  const rel = url.replace(/^\//, "");
  return `${base}/agents/${rel}`;
}