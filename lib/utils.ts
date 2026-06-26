// Shared utilities used across the codebase.

/** Join class names, silently filtering out falsy values (false, undefined, null, ""). */
export function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
