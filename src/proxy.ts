import { NextRequest, NextResponse } from 'next/server';
import { rootDomain } from './lib/utils';

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0]; // Remove port if present

  // local development
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const fullUrlMatch = url.match(/:\/\/(?:[^.]+\.)?([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    if (hostname.includes('localhost')) {
      const localhostParts = hostname.split('.');
      if (localhostParts.length > 1) {
        return localhostParts[0];
      }
    }

    return null;
  }
  // production environment
  const rootDomainFormatted = rootDomain.split(':')[0]; // Remove port if present

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const subdomain = extractSubdomain(request);
  console.log('Extracted subdomain:', subdomain, 'url:', request.nextUrl);
  if (subdomain) {
    return NextResponse.rewrite(
      new URL(`/s/${subdomain}${pathname}`, request.url),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|[\\w-]+\\.\\w+).*)',
  ],
};
