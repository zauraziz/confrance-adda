import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './lib/auth';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Yalnız /admin marşrutlarını yoxla, login səhifəsi istisna
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const res = NextResponse.next();
    const session = await getIronSession(req.cookies, res.cookies, sessionOptions);
    if (!session?.admin) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
