import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[əğıöşüç]/g, c => ({ə:'a',ğ:'g',ı:'i',ö:'o',ş:'s',ü:'u',ç:'c'}[c]))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
