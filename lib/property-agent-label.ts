export function getPropertyAgentLabel(name: string): string {
  return /\bsharlene\b/i.test(name) ? "Alfima" : name;
}
