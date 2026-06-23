/**
 * versionHistory.ts
 * localStorage snapshot system for the Site Editor.
 * Stores up to MAX_VERSIONS JSON snapshots keyed by page name.
 */

import type { PageBlock } from '@/lib/blocks/types'

const PREFIX    = 'jessie:site-versions:'
const MAX_VERSIONS = 10

export interface Version {
  id:        string
  page:      string
  label:     string
  blocks:    PageBlock[]
  savedAt:   string
}

function storageKey(page: string): string {
  return `${PREFIX}${page}`
}

function read(page: string): Version[] {
  try {
    const raw = localStorage.getItem(storageKey(page))
    return raw ? (JSON.parse(raw) as Version[]) : []
  } catch {
    return []
  }
}

function write(page: string, versions: Version[]): void {
  try {
    localStorage.setItem(storageKey(page), JSON.stringify(versions))
  } catch {}
}

/** Save the current block state as a named version. */
export function saveVersion(page: string, blocks: PageBlock[], label?: string): Version {
  const version: Version = {
    id:      `v-${Date.now()}`,
    page,
    label:   label ?? `Version — ${new Date().toLocaleString()}`,
    blocks:  JSON.parse(JSON.stringify(blocks)),  // deep clone
    savedAt: new Date().toISOString(),
  }

  const existing = read(page)
  const next     = [version, ...existing].slice(0, MAX_VERSIONS)
  write(page, next)
  return version
}

/** List saved versions for a page, most recent first. */
export function listVersions(page: string): Version[] {
  return read(page)
}

/** Restore a specific version's blocks. */
export function restoreVersion(page: string, versionId: string): PageBlock[] | null {
  const versions = read(page)
  return versions.find(v => v.id === versionId)?.blocks ?? null
}

/** Delete a specific version. */
export function deleteVersion(page: string, versionId: string): void {
  const versions = read(page).filter(v => v.id !== versionId)
  write(page, versions)
}

/** Clear all versions for a page. */
export function clearVersions(page: string): void {
  try { localStorage.removeItem(storageKey(page)) } catch {}
}