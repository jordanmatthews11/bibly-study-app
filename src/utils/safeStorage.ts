/**
 * Safe merge for localStorage-parsed data: copy only known keys to avoid
 * prototype pollution (e.g. __proto__, constructor) from tampered storage.
 */

/** Copy only allowed keys from obj; ignores __proto__, constructor, and unknown keys. */
export function safePick<T extends Record<string, unknown>>(
  obj: unknown,
  allowedKeys: readonly (keyof T)[]
): Partial<T> {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return {}
  }
  const out: Partial<T> = {}
  const keySet = new Set(allowedKeys as string[])
  for (const k of Object.keys(obj)) {
    if (keySet.has(k) && Object.prototype.hasOwnProperty.call(obj, k)) {
      ;(out as Record<string, unknown>)[k] = (obj as Record<string, unknown>)[k]
    }
  }
  return out
}

/** Return obj[key] only if it's a non-null object; then safePick with allowed keys. */
export function safePickNested<T extends Record<string, unknown>>(
  obj: unknown,
  key: string,
  allowedKeys: readonly (keyof T)[]
): Partial<T> {
  if (obj === null || typeof obj !== 'object') return {}
  const raw = (obj as Record<string, unknown>)[key]
  return safePick(raw, allowedKeys)
}
