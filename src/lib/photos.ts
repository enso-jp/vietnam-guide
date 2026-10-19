import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function photoPath(id: string, fallbackId?: string): string | undefined {
  const file = (key: string) => join(process.cwd(), 'public', 'photos', `${key}.jpg`);
  if (id && existsSync(file(id))) return `/photos/${id}.jpg`;
  if (fallbackId && existsSync(file(fallbackId))) return `/photos/${fallbackId}.jpg`;
  return undefined;
}
