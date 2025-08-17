export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts: string[] = [];
  parts.push(`${h}h`);
  parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
}
