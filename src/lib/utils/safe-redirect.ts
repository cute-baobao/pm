export const safeRedirect = (to?: string | null, defaultRedirect = '/') => {
  if (!to) return null;
  try {
    const url = decodeURIComponent(to);
    if (url.startsWith('/') && !url.startsWith('//')) return url;
  } catch {}
  return defaultRedirect;
};
