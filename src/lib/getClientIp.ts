export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim()).filter(Boolean);
    if (ips.length > 0) {
      return ips[0];
    }
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;

  // As a fallback, return localhost to avoid empty strings
  return '0.0.0.0';
}


