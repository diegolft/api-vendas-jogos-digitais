export function generateActivationKey(): string {
  return Array.from({ length: 4 }, () =>
    Math.random().toString(36).slice(2, 6).toUpperCase(),
  ).join('-');
}

