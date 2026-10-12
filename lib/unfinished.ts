/** True when a field is empty, null, or an explicit TODO placeholder. */
export function isUnfinishedValue(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed === "TODO") return true;
  if (trimmed.startsWith("TODO_")) return true;
  return false;
}

/** Keep items that have no unfinished values in the listed fields. */
export function rejectUnfinished<T extends Record<string, unknown>>(
  items: readonly T[],
  fields: readonly (keyof T)[],
): T[] {
  return items.filter((item) =>
    fields.every((field) => !isUnfinishedValue(item[field])),
  );
}
